import {
  Controller,
  Get,
  UseGuards,
  Body,
  Put,
  BadRequestException,
  Query,
  ParseIntPipe,
  Param,
} from '@nestjs/common'
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service'
import { UserService } from '../../user/services/user.service'
import { UserTransformer } from '../../user/transformers/user.transformer'
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard'
import { HashService } from '../../../shared/services/hash/hash.service'
import { UpdateProfileDto, UpdatePasswordDto } from '../dto/updateProfile.dto'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthenticatedUser } from 'src/components/auth/decorators/authenticatedUser.decorator'
import { GetItemResponse } from 'src/shared/services/apiResponse/apiResponse.interface'
import { Me } from 'src/components/user/dto/user.dto'
import { GetOrdersOfUserRequestDto } from '../../user/dto/get-orders-of-user-request.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { OrderEntity } from '../../order/entities/order.entity'

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/profile')
export class ProfileController {
  constructor(
    private response: ApiResponseService,
    private userService: UserService,
    private hashService: HashService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get profile current user' })
  @ApiOkResponse({ description: 'Profile current user' })
  async profile(
    @AuthenticatedUser() currentUser: Me,
  ): Promise<GetItemResponse> {
    const user = await this.userService.findOneOrFail(currentUser.id, {
      relations: ['roles'],
    })

    return this.response.item(user, new UserTransformer(['roles']))
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get list orders of current user' })
  @ApiOkResponse({ description: 'List orders of current user' })
  async index(
    @AuthenticatedUser() currentUser: Me,
    @Query() query: GetOrdersOfUserRequestDto
  ): Promise<Pagination<OrderEntity>> {
    return await this.userService.getOrders({
      page: query.page || 1,
      limit: query.limit || 10,
      status: query.status,
      orderStartTime: query.orderStartTime,
      orderEndTime: query.orderEndTime
    }, currentUser.id);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiOkResponse({ description: 'order entity' })
  async show(
    @AuthenticatedUser() currentUser: Me,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    try {
      return await this.userService.getOrder(orderId, currentUser.id)
    } catch (err) {
      throw err
    }
  }

  @Put()
  @ApiOperation({ summary: 'Update profile current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async updateProfile(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdateProfileDto,
  ): Promise<any> {
    const data: any = {}

    if (body.username) {
      data.username = body.username
    }
    if (body.firstName) {
      data.firstName = body.firstName
    }
    if (body.lastName) {
      data.lastName = body.lastName
    }

    data.phone = body.phone ?? null

    data.address = body.address ?? null

    const user = await this.userService.update(currentUser.id, data)

    return this.response.item(user, new UserTransformer())
  }

  @Put('password')
  @ApiOperation({ summary: 'Update password current user' })
  @ApiOkResponse({ description: 'New profile current user' })
  async changePassword(
    @AuthenticatedUser() currentUser: Me,
    @Body() body: UpdatePasswordDto,
  ): Promise<any> {
    const { password, oldPassword } = body

    if (!this.hashService.check(oldPassword, currentUser.password)) {
      throw new BadRequestException('Old password is not correct')
    }

    const hashed = this.hashService.hash(password)

    const result = await this.userService.update(currentUser.id, {
      password: hashed,
    })

    return this.response.item(result, new UserTransformer())
  }
}
