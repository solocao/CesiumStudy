//坐标转换类
export class CoordsTransform {
  constructor(viewer) {
    this.viewer = viewer
  }
  static cartesianToDegrees(cartesian) {
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height]
  }
  static degreesToCartesian(degrees, height = false) {
    if (height) {
      return Cesium.Cartesian3.fromDegreesArrayHeights(degrees)
    }
    return Cesium.Cartesian3.fromDegreesArray(degrees)
  }
  //屏幕坐标转笛卡尔坐标
  winPositionToCarte3(position) {
    return this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(position), this.viewer.scene);
  }
  //世界坐标转屏幕坐标
  wgs84ToWinCoords(cartesian3) {
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian3);
  }
}


export function defined(value){
  return Cesium.defined(value)
}
