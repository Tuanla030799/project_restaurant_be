import { UserEntity } from '../src/components/user/entities/user.entity'
import { RoleEntity } from '../src/components/auth/entities/role.entity'
import { UserRoleEntity } from '../src/components/auth/entities/userRole.entity'
import { PermissionEntity } from '../src/components/auth/entities/permission.entity'
import { RolePermissionEntity } from '../src/components/auth/entities/rolePermission.entity'
import { PasswordResetEntity } from '../src/components/auth/entities/passwordReset.entity'
import { CategoryEntity } from '../src/components/category/entities/category.entity'
import { FoodEntity } from '../src/components/food/entities/food.entity'
import { SeatEntity } from '../src/components/seat/entities/seat.entity'
import { OrderEntity } from '../src/components/order/entities/order.entity'
import { OrderDetailEntity } from '../src/components/order/entities/orderDetail.entity'

export default (): any => ({
  type: process.env.DB_CONNECTION || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  entities: [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    PasswordResetEntity,
    RolePermissionEntity,
    UserRoleEntity,
    CategoryEntity,
    FoodEntity,
    SeatEntity,
    OrderEntity,
    OrderDetailEntity,
  ],
  // autoLoadEntities: true,

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: process.env.DB_LOGGING === 'true',
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'database/migrations',
  },
})
