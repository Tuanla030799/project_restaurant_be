import { TimeStampEntity } from '../../base.entity'
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { RoleEntity } from './role.entity'

@Entity({ name: 'permissions' })
export class PermissionEntity extends TimeStampEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  slug: string

  @ManyToMany(() => RoleEntity, (role) => role.permissions, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'rolePermission',
    joinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[]
}
