import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { RoleEntity } from '../../auth/entities/role.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../base.entity'

export enum UserStatus {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

@Notifiable()
@Entity({ name: 'users' })
export class UserEntity extends TimeStampEntity {
  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true })
  username: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar', default: '' })
  firstName: string

  @Column({ type: 'varchar', default: '' })
  lastName: string

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.active })
  status: UserStatus

  @Column({ type: 'varchar' })
  socketId: string

  @Column({ type: 'varchar', default: '' })
  verifyToken: string

  @Column({ type: 'boolean', default: false })
  verified: boolean

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: ['insert'] })
  @JoinTable({
    name: 'userRole',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[]

  getEmail(): string {
    return this.email
  }

  generateVerifyEmailLink(baseUrl: string): string {
    const path = `/auth/verify?token=${this.verifyToken}`
    const url = new URL(path, baseUrl)
    return url.href
  }
}
