import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity('poi')
export class Poi {

  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  name: string

  @Column('decimal', { precision: 10, scale: 8 })
  lat: number

  @Column('decimal', { precision: 10, scale: 8 })
  lng: number
}

export interface PoiViewQuery {
  category?: string
  status?: number
  sortKey?: string
  order: 'asc' | 'desc'
  offset: number
  limit: number
}
