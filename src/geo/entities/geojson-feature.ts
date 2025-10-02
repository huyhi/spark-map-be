// {
//   "type": "Feature",
//   "properties": {
//     "name": "tom"
//   },
//   "geometry": {
//     "type": "Polygon",
//     "coordinates": [
//       [
//         [-2.8125, 34.59704151614417],
//         [65.390625, 34.59704151614417],
//         [65.390625, 61.10078883158897],
//         [-2.8125, 61.10078883158897],
//         [-2.8125, 34.59704151614417]
//       ]
//     ]
//   }
// }

interface GeoJsonFeature {
  type: string
  properties: {
    name: string
  }
  geometry: {
    type: string
    coordinates: number[][]
  }
}

interface GeoJsonFeatureCollection {
  type: string
  features: GeoJsonFeature[]
}
