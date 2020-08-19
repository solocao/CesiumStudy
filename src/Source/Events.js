import {CoordsTransform,defined} from "./Utils"
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
    this.coordsTrans=new CoordsTransform(viewer);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    Object.keys(Events.EVENT_TYPE).forEach(key => {
      this[`_${key}`] = new Map();
    });
  }
  addEvent(type, cb) {
    if(!Object.keys(Events.EVENT_TYPE).some(v=>v===type)) return;
    let symbolId = Symbol()
    this[`_${type}`].set(symbolId, cb);
    if(!this._handler.getInputAction(Events.EVENT_TYPE[type])){
      this._handler.setInputAction((evt) => {
        let event = {}
        event.position=evt.position?evt.position:evt.endPosition
        // 转为wgs84坐标系，弧度
        let position = this.coordsTrans.winPositionToCarte3(evt.position?evt.position:evt.endPosition)
        if (defined(position)) {
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          event.degrees = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height];
          event.cartographic = cartographic;
          event.cartesian = position;
        }
        for (let cb of this[`_${type}`].values()) {
          cb(event)
        }
      }, Events.EVENT_TYPE[type])
    }
    return symbolId;
  }
  removeEvent(type, key) {
    this[`_${type}`].delete(key);
  }
  removeAll(type) {
    this[`_${type}`].clear()
  }
}