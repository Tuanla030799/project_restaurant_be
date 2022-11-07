import { UserService } from '../../user/services/user.service'
import { ApiResponseService } from '../../../shared/services/apiResponse/apiResponse.service'
import { JwtService } from '@nestjs/jwt'
import { pick, isNil } from 'lodash'
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { UserLoginDto, UserRegisterDto, LoginGoogleDto } from '../dto/auth.dto'
import { OAuth2Client } from 'google-auth-library'
import { ConfigService } from '@nestjs/config'
import { ResponseEntity } from 'src/shared/interfaces/interface'

const authenticatedUserFields = ['id', 'email']
@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @Post('loginGoogle')
  @ApiOperation({ summary: 'Login with google token' })
  @ApiOkResponse({ description: 'Token for access system' })
  async googleAuthCallback(
    @Body() body: LoginGoogleDto,
  ): Promise<ResponseEntity> {
    const client = new OAuth2Client(this.config.get('GOOGLE_CONSUMER_KEY'))

    let ticket

    try {
      ticket = await client.verifyIdToken({
        idToken: body.idToken,
      })
    } catch (e) {
      throw new BadRequestException('Token is not valid')
    }

    const payload = ticket.getPayload()

    if (!payload) {
      throw new BadRequestException('Can not parser idToken')
    }

    const email: string = payload.email

    if (isNil(email) || email === '') {
      throw new BadRequestException('Can not get email address')
    }

    let user = await this.userService.first({ where: { email } })

    if (!user) {
      user = await this.userService.create({
        email: this.userService.sanitizeEmail(email),
        firstName: payload.givenName,
        lastName: payload.familyName,
      })
    }

    return this.response.object({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    })
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user with email' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userRegister(@Body() data: UserRegisterDto): Promise<ResponseEntity> {
    const user = await this.userService.saveUser({
      data,
    })

    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    })
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiOkResponse({ description: 'Token for access system' })
  async userLogin(@Body() data: UserLoginDto): Promise<ResponseEntity> {
    const { email, password } = data

    const user = await this.userService.firstOrFail({
      where: {
        email: this.userService.sanitizeEmail(email),
      },
      select: [...authenticatedUserFields, 'password'],
    })

    const isValidPassword = this.userService.checkPassword(
      password,
      user.password,
    )

    if (!isValidPassword) {
      throw new UnauthorizedException('Password does not match')
    }

    return this.response.primitive({
      token: this.jwtService.sign(pick(user, authenticatedUserFields)),
    })
  }
}
