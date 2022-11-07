import { Connection } from 'typeorm'
import { RoleEntity } from '../../src/components/auth/entities/role.entity'

export default class RolesTableSeeder {
  async up(connection: Connection): Promise<any> {
    const seed = [
      { name: 'Admin', slug: 'admin' },
      { name: 'User', slug: 'user' },
    ]

    const roles = seed.map((item) => {
      const role = new RoleEntity()
      role.name = item.name
      role.slug = item.slug
      return role
    })

    await connection.manager.save(roles)
  }
}
