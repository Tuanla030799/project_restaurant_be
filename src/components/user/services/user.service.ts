import { ConflictException, Injectable } from '@nestjs/common'
import { UserEntity } from '../entities/user.entity'
import { BaseService } from '../../../shared/services/base.service'
import { UserRepository } from '../repositories/user.repository'
import { Repository, Connection } from 'typeorm'
import { HashService } from '../../../shared/services/hash/hash.service'
import { RoleService } from 'src/components/auth/services/role.service'
import { UserRoleService } from 'src/components/auth/services/userRole.service'
import { difference, pick } from 'lodash'
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'
import { DEFAULT_USER_STATUS } from 'src/shared/defaultValue/defaultValue'
import { UserRegisterDto } from 'src/components/auth/dto/auth.dto'

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>
  public entity: any = UserEntity

  constructor(
    private connection: Connection,
    private hashService: HashService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(UserRepository)
  }

  async emailExist(email: string): Promise<boolean> {
    return (await this.repository.count({ where: { email } })) > 0
  }

  async usernameExist(username: string): Promise<boolean> {
    return (await this.repository.count({ where: { username } })) > 0
  }

  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verifyToken: `${this.hashService.md5(
        id.toString(),
      )}${this.hashService.md5(new Date().toISOString())}`,
    })
    return item
  }

  async verify(id: number): Promise<UserEntity> {
    const item = await this.update(id, {
      verifyToken: '',
      verified: true,
      verifiedAt: new Date(),
    })

    return item
  }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  hashPassword(password: string): string {
    return this.hashService.hash(password)
  }

  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.check(password, hashed)
  }

  /**
   * Change password of given user_id
   *
   * @param id  number
   * @param password string
   */
  async changePassword(id: number, password: string): Promise<UserEntity> {
    return await this.update(id, { password: this.hashService.hash(password) })
  }

  async attachRole(params: { userId: number; roleId: number }): Promise<void> {
    const { userId, roleId } = params
    const role = await this.roleService.findOneOrFail(roleId)

    const user = await this.repository.findOneOrFail(userId)

    if (role && user) {
      await this.userRoleService.firstOrCreate(
        {
          where: {
            userId: user.id,
            roleId: role.id,
          },
        },
        { userId: user.id, roleId: role.id },
      )
    }
  }

  async detachRole(params: { userId: number; roleId: number }): Promise<void> {
    const { userId, roleId } = params
    const role = await this.roleService.findOneOrFail(roleId)

    const user = await this.repository.findOneOrFail(userId)

    if (role && user) {
      const userRole = await this.userRoleService.firstOrFail({
        where: {
          userId: user.id,
          roleId: role.id,
        },
      })
      if (userRole) {
        await this.userRoleService.destroy(userRole.id)
      }
    }
  }

  /**
   * Save user and return user entity with relations
   *
   * @param params.data  CreateUserDto
   * @return User
   */
  async saveUser(params: {
    data: CreateUserDto | UserRegisterDto
  }): Promise<UserEntity> {
    let { data } = params
    const { email, username, password } = data

    if (await this.emailExist(email)) {
      throw new ConflictException('Email already exist')
    }

    if (await this.usernameExist(username)) {
      throw new ConflictException('Username already exist')
    }

    const userStatus = data.status ?? DEFAULT_USER_STATUS

    if (data instanceof UserRegisterDto) {
      const roleUser: number[] = await this.roleService.findWhere({
        where: { slug: 'user' },
        select: ['id'],
      })

      data = { ...data, roleIds: roleUser }
    }

    data.status = userStatus

    const saveUser = await this.create({
      ...pick(data, [
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'status',
      ]),
      ...{
        password: this.hashPassword(password),
        email: this.sanitizeEmail(email),
      },
    })

    if (data.roleIds && data.roleIds.length > 0) {
      for (const roleId of data.roleIds) {
        await this.attachRole({ userId: saveUser.id, roleId })
      }
    }

    return await this.findOneOrFail(saveUser.id, { relations: ['roles'] })
  }

  /**
   * Update user and return user entity with relations
   *
   * @param params.data  UpdateUserDto
   * @return User
   */
  async updateUser(params: {
    id: number
    data: UpdateUserDto
  }): Promise<UserEntity> {
    const { id, data } = params
    const { email, username, password, roleIds } = data

    const existingUser = await this.findOneOrFail(id)

    if (await this.emailExist(email)) {
      throw new ConflictException('Email already exist')
    }

    if (await this.usernameExist(username)) {
      throw new ConflictException('Username already exist')
    }

    const updateUser = await this.update(existingUser.id, {
      ...pick(data, [
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'status',
      ]),
      ...{
        password: this.hashPassword(password),
        email: this.sanitizeEmail(email),
      },
    })

    if (data.roleIds.length > 0) {
      await this.updateRelationUserAndRole({
        userId: updateUser.id,
        roleIds,
      })
    }

    return await this.findOneOrFail(updateUser.id, { relations: ['roles'] })
  }

  /**
   * Update relation role when update user ...
   * @param params.userId
   * @param params.roleIds
   */
  async updateRelationUserAndRole(params: {
    userId: number
    roleIds: number[]
  }): Promise<void> {
    const { userId, roleIds } = params

    const currentRoleIds: number[] = await this.userRoleService.findWhere({
      where: {
        userId,
      },
      select: ['roleId'],
    })

    if (currentRoleIds.length === 0) {
      return
    }

    // detach role
    const detachRoleIds: number[] = difference(currentRoleIds, roleIds)

    for (const detachRoleId of detachRoleIds) {
      await this.detachRole({ userId, roleId: detachRoleId })
    }

    // attach new role
    const newAttachRoleIds: number[] = difference(roleIds, currentRoleIds)

    const existingRoles = await this.roleService.findIdInOrFail(
      newAttachRoleIds,
    )

    if (existingRoles && existingRoles.length > 0) {
      const roleIds = existingRoles.map((role) => role.id)

      for (const roleId of roleIds) {
        await this.attachRole({ userId, roleId })
      }
    }
  }
}
