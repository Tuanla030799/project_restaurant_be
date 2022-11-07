import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/services/base.service'
import { Repository, Connection } from 'typeorm'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionRepository } from '../repositories/permission.repository'

@Injectable()
export class PermissionService extends BaseService {
  public repository: Repository<any>
  public entity: any = PermissionEntity

  constructor(private connection: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(PermissionRepository)
  }
}
