
let entities = [
  new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(114.6200877719163, 33.442230242824415,5000),
    model: {
      uri: "/Cesium_Air.glb",
      minimumPixelSize: 128,
      maximumScale: 20000
    }
  }),
  {
    position: Cesium.Cartesian3.fromDegrees(115.29890258253211,31.169192853189067),
    point: {
      show: true, // default
      color: Cesium.Color.SKYBLUE, // default: WHITE
      pixelSize: 10, // default: 1
      outlineColor: Cesium.Color.YELLOW, // default: BLACK
      outlineWidth: 3, // default: 0
    },
  }
]
export default entities