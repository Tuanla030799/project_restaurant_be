import { EntityRepository, Repository } from 'typeorm'
import { UserRoleEntity } from '../entities/userRole.entity'

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {}
