import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World ! \n Try SwaggerUi : http://localhost:3000/swaggerUI'
  }
}
