import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class IdEntity {
  @PrimaryGeneratedColumn()
  id: number
}

export class BaseTimeStampEntity extends IdEntity {
  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date
}
export class TimeStampEntity extends BaseTimeStampEntity {
  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date
}
