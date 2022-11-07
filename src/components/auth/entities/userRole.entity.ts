import { IdEntity } from '../../base.entity'
import { Entity, Column } from 'typeorm'

@Entity({ name: 'userRole' })
export class UserRoleEntity extends IdEntity {
  @Column()
  userId: number

  @Column()
  roleId: number
}
