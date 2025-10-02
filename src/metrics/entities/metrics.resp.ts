export interface SingleMetricsResp {
  meta?: {
    id: number
    gb: number
    name: string
    level: number
    year: number
  }
  metrics: Record<string, number>
}
