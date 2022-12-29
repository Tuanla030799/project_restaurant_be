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
    type: 'timestamptz',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamptz',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date
}
export class TimeStampEntity extends BaseTimeStampEntity {
  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt: Date
}
