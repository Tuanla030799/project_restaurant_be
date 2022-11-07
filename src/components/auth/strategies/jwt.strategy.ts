import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../../user/services/user.service'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_KEY,
    })
  }

  async validate(payload: any) {
    const user = this.userService.findOneOrFail(payload.id, {
      relations: ['roles'],
    })
    return user
  }
}
