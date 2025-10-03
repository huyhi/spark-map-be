import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Poi } from './entities/poi.entity'

@Injectable()
export class PoiService {
  constructor(
    @InjectRepository(Poi)
    private poiRepository: Repository<Poi>,
  ) { }


  async findPoiDataView(): Promise<Poi[]> {
    const data = await this.poiRepository.find({
      where: {},
      skip: 0,
      take: 5000,
    })

    return data
  }
}
