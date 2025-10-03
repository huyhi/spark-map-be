import { Poi } from "./poi.entity"

export interface PoiWithDistance extends Poi {
  distance?: number
}

export interface PoiSearchResult {
  pois: PoiWithDistance[]
  total: number
}
