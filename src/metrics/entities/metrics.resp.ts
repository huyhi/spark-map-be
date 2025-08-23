export interface SingleMetricsResp {
  meta?: {
    gb: number
    name: string
  }
  metrics: {
    [key: string]: number
  }
}

export interface MetricsResp {
  data: SingleMetricsResp[]
  total: number
}