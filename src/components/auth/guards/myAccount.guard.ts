import { JwtAuthGuard } from './jwtAuth.guard'
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class MyAccountGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }

    console.log(info)

    return user
  }
}
