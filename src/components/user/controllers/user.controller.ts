import { UserService } from '../services/user.service'
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  Put,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service'
import { UserTransformer } from '../transformers/user.transformer'
import { isNil, pick, isBoolean } from 'lodash'
import { IPaginationOptions } from '../../../shared/services/pagination'
import { Auth } from '../../auth/decorators/auth.decorator'
import { NotificationService } from '../../../shared/services/notification/notification.service'
import { ConfigService } from '@nestjs/config'
import { VerifyUserNotification } from '../notifications/verifyUser.notification'
import { UserPasswordChangedNotification } from '../notifications/userPasswordChanged.notification'
import { InviteUserService } from '../services/inviteUser.service'
import { SendInviteUserLinkNotification } from '../../auth/notifications/sendInviteUserLink.notification'
import { QueryManyDto } from '../../../shared/dto/queryParams.dto'
import { Request } from 'express'
import { UserSendMailReportNotification } from '../notifications/userSendEmailReport.notification'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  UpdateUserPasswordDto,
  UserAttachRoleDto,
  UserDetachRoleDto,
  UserSendMailReportDto,
} from '../dto/user.dto'
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard'
import {
  CreateResponse,
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
  UpdateResponse,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import Messages from 'src/shared/message/message'
import { CommonService } from 'src/shared/services/common.service'
import { UserEntity } from '../entities/user.entity'
import { SelectQueryBuilder } from 'typeorm'

@ApiTags('Users')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private inviteUserService: InviteUserService,
    private commonService: CommonService,
  ) {}

  private entity = 'users'
  private fields = ['email', 'username', 'firstName', 'lastName']
  private relations = ['roles']

  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create user' })
  @ApiOkResponse({ description: 'New user entity' })
  async createUser(@Body() data: CreateUserDto): Promise<CreateResponse> {
    const saveUser = await this.userService.saveUser({
      data,
    })

    return this.response.item(saveUser, new UserTransformer(this.relations))
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list users' })
  @ApiOkResponse({ description: 'List users with query params' })
  async readUsers(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    let queryBuilder: SelectQueryBuilder<UserEntity> =
      await this.userService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        sortBy,
        sortType,
      })

    let joinAndSelects = []

    if (!isNil(includes)) {
      const includesParams = Array.isArray(includes) ? includes : [includes]

      joinAndSelects = this.commonService.includesParamToJoinAndSelects({
        includesParams,
        relations: this.relations,
      })

      if (joinAndSelects.length > 0) {
        joinAndSelects.forEach((joinAndSelect) => {
          queryBuilder = queryBuilder.leftJoinAndSelect(
            `${this.entity}.${joinAndSelect}`,
            `${joinAndSelect}`,
          )
        })
      }
    }

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.userService.paginate(queryBuilder, paginateOption)

      return this.response.paginate(
        data,
        new UserTransformer(
          joinAndSelects.length > 0 ? joinAndSelects : undefined,
        ),
      )
    }

    const users = await queryBuilder.getMany()

    return this.response.collection(
      users,
      new UserTransformer(
        joinAndSelects.length > 0 ? joinAndSelects : undefined,
      ),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get user by id' })
  @ApiOkResponse({ description: 'User entity' })
  async readUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const user = await this.userService.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(user, new UserTransformer(this.relations))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update user by id' })
  @ApiOkResponse({ description: 'Update user entity' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UpdateResponse> {
    const updateUser = await this.userService.updateUser({ id, data })

    if (isBoolean(data.notifyUser) && data.notifyUser === true) {
      this.notificationService.send(
        updateUser,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.item(updateUser, new UserTransformer(this.relations))
  }

  @Put(':id/password')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin change password for user by id' })
  @ApiOkResponse({ description: 'Update password user entity' })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ): Promise<SuccessfullyOperation> {
    const user = await this.userService.findOneOrFail(id)

    await this.userService.update(user.id, {
      password: this.userService.hashPassword(data.password),
    })

    if (isBoolean(data.notifyUser) && data.notifyUser === true) {
      this.notificationService.send(
        user,
        new UserPasswordChangedNotification(data.password),
      )
    }

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.updatePassword,
        keywords: ['password', 'user'],
      }),
    })
  }

  @Post(':id/sendVerifyLink')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin send verify link for user by id' })
  @ApiOkResponse({ description: 'Send mail successfully' })
  async sendVerifyLink(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const user = await this.userService.findOneOrFail(id)

    await this.userService.generateVerifyToken(user.id)

    this.notificationService.send(
      user,
      new VerifyUserNotification(
        user.generateVerifyEmailLink(this.configService.get('FRONTEND_URL')),
      ),
    )

    return this.response.success()
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify token' })
  @ApiOkResponse({ description: 'User verified successfully' })
  async verify(@Query('token') token: string): Promise<any> {
    const user = await this.userService.firstOrFail({
      where: { verifyToken: token, verified: false, verifiedAt: null },
    })

    const result = await this.userService.verify(user.id)

    return this.response.item(result, new UserTransformer())
  }

  @Post('invite')
  @Auth('admin')
  @ApiOperation({ summary: 'Invite new user using system' })
  @ApiOkResponse({ description: 'Mail notification user' })
  async inviteUser(@Req() request: Request): Promise<SuccessfullyOperation> {
    const data = (request as any).body

    const check = await this.userService.emailExist(data.email)

    if (check) {
      throw new BadRequestException('User is exist in system')
    }

    const item = await this.userService.create(pick(data, ['email']))

    await this.inviteUserService.expireAllToken(item.email)

    const passwordReset = await this.inviteUserService.generate(item.email)

    await this.notificationService.send(
      item,
      new SendInviteUserLinkNotification(
        passwordReset,
        this.configService.get('FRONTEND_URL'),
      ),
    )

    return this.response.success()
  }

  @Post(':id/attachRole')
  @Auth('admin')
  @ApiOperation({ summary: 'Attach user and role' })
  @ApiOkResponse({ description: 'Attach role successfully' })
  async attachRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserAttachRoleDto,
  ): Promise<SuccessfullyOperation> {
    await this.userService.attachRole({ userId: id, roleId: data.roleId })

    return this.response.success()
  }

  @Post(':id/detachRole')
  @Auth('admin')
  @ApiOperation({ summary: 'Detach user and role' })
  @ApiOkResponse({ description: 'Detach role successfully' })
  async detachRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserDetachRoleDto,
  ): Promise<SuccessfullyOperation> {
    await this.userService.detachRole({ userId: id, roleId: data.roleId })

    return this.response.success()
  }

  @Post(':id/sendMail')
  @Auth('admin')
  @ApiOperation({ summary: 'Send mail report user' })
  @ApiOkResponse({ description: 'Send mail successfully' })
  async sendMail(
    @Body() data: UserSendMailReportDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    const user = await this.userService.findOneOrFail(id)

    this.notificationService.send(
      user,
      new UserSendMailReportNotification(data.toEmail, data.linkReport),
    )

    return this.response.success()
  }
}
