import { EntityRepository, Repository } from 'typeorm'
import { PasswordResetEntity } from '../entities/passwordReset.entity'

@EntityRepository(PasswordResetEntity)
export class PasswordResetRepository extends Repository<PasswordResetEntity> {}
