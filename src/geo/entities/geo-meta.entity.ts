import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('geo_meta')
export class GeoMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  name: string

  @Column('integer')
  gb: number

  @Column('integer')
  level: number

  @Column('integer')
  year: number

  @Column('decimal', { precision: 10, scale: 8 })
  lat: number

  @Column('decimal', { precision: 10, scale: 8 })
  lng: number

  @Column('text', { nullable: false })
  geojson: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
