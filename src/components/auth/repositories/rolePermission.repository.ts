import { EntityRepository, Repository } from 'typeorm'
import { RolePermissionEntity } from '../entities/rolePermission.entity'

@EntityRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {}
