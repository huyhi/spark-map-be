import { GeoMeta } from "src/geo/entities/geo-meta.entity"
import { MetricsData } from "./metrics.entity"

export interface MetricsDataWithGeoMeta {
  geoMeta: GeoMeta[]
  metricsData: MetricsData[]
}