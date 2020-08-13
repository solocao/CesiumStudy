
export default class Events {
  static EVENT_TYPE = {
    'click': Cesium.ScreenSpaceEventType.LEFT_CLICK,
    'rightClick': Cesium.ScreenSpaceEventType.RIGHT_CLICK,
    'mouseMove': Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    'dobuleClick': Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  }
  constructor(viewer) {
    //清除默认鼠标事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    Object.keys(Events.EVENT_TYPE).forEach(key => {
      this[`_${key}`] = new Map();
      this._handler.setInputAction((evt) => {
        for (let cb of this[`_${key}`].values()) {
          let position = viewer.camera.pickEllipsoid(
            evt.position,
            viewer.scene.globe.ellipsoid
          );
          let event = {}
          // 转为wgs84坐标系，弧度
          if (position) {
            let cartographic = Cesium.Cartographic.fromCartesian(position);
            event.degrees = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height];
            event.cartographic = cartographic;
            event.cartesian = position
          }
          cb(event)
        }
      }, Events.EVENT_TYPE[key])
    });
  }
  addEvent(type, cb) {
    let symbolId = Symbol()
    this[`_${type}`].set(symbolId, cb);
    return symbolId;
  }
  removeEvent(type, key) {
    this[`_${type}`].delete(key);
  }
  removeAll(type) {
    this[`_${type}`].clear()
  }
}