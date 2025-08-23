import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('metrics_meta')
export class MetricsMeta {

  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  key: string

  @Column('text')
  realName: string

  @Column('int')
  datatype: number

  @Column('int')
  year: number

  @Column('decimal', { precision: 10, scale: 8 })
  maxVal: number

  @Column('decimal', { precision: 10, scale: 8 })
  minVal: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity('metrics_data')
export class MetricsData {

  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  gb: number

  @Column('text')
  key: string

  @Column('decimal', { precision: 10, scale: 8 })
  value: number

  @Column('int')
  year: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}