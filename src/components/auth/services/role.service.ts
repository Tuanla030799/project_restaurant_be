import { Injectable } from '@nestjs/common'
import { BaseService } from '../../../shared/services/base.service'
import { Repository, Connection } from 'typeorm'
import { RoleEntity } from '../entities/role.entity'
import { RoleRepository } from '../repositories/role.repository'

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<any>
  public entity: any = RoleEntity

  constructor(private connection: Connection) {
    super()
    this.repository = connection.getCustomRepository(RoleRepository)
  }
}
