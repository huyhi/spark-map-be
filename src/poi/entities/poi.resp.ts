export interface PoiResp {
  id: number
  name: string
  category?: string
  address?: string
  lat: number
  lng: number
  description?: string
  phone?: string
  website?: string
  status: number
  distance?: number
}

export interface PoiListResp {
  pois: PoiResp[]
  total: number
  offset: number
  limit: number
}
