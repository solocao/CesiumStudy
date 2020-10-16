import Interaction from "../BaseClasses/Interaction";

export default class Draw extends Interaction{
  constructor(
    viewer, mode, clampMode
  ) {
    super();
    this._viewer = (viewer || null);
    this._mode = (mode || null);
    this._activePoint = null;
    this._activeGeomPoints = [];
    this._clampMode = (clampMode||Draw.clampMode.Normal);
    this._activeGeom = null;
    this._active = false;
    this._deactivePoints=[];
    this._actionCollection = {
      "end": []
    };
    this._viewer && this._init();
  }

  static clampMode={
    ClampToGround:"ClampToGround",
    Normal:"Normal"
  }

  get isActive() {
    return this._active;
  }

  //初始化生成事件处理监听
  _init() {
    this._dataSource = new Cesium.CustomDataSource();
    this._viewer.dataSources.add(this._dataSource);
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._handler.setInputAction((event) => {

      let earthPosition = this._getPosition(event.position);
      if (Cesium.defined(earthPosition)) {
        if (this._activeGeomPoints.length === 0) {
          this._activePoint = this._createPoint(earthPosition);
          this._activeGeomPoints.push(earthPosition);
          let dynamicPoints = new Cesium.CallbackProperty(() => {
            if (this._mode === "polygon") {
              return new Cesium.PolygonHierarchy(this._activeGeomPoints);
            }
            return this._activeGeomPoints;
          }, false);
          this._activeGeom = this._drawShape(dynamicPoints);
        }
        this._activeGeomPoints.push(earthPosition);
        this._deactivePoints.push(this._createPoint(earthPosition));
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this._handler.setInputAction(event => {
      if (Cesium.defined(this._activePoint)) {
        let earthPosition = this._getPosition(event.endPosition);
        if (Cesium.defined(earthPosition)) {
          console.log(34535);
          this._activePoint.position.setValue(earthPosition);
          this._activeGeomPoints.pop();
          this._activeGeomPoints.push(earthPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this._handler.setInputAction(() => {
      this._activeGeomPoints.pop();
      let s = this._drawShape(this._activeGeomPoints);
      this._actionCollection.end.forEach(cb => cb(s));
      this._dataSource.entities.remove(this._activeGeom);
      this._viewer.entities.remove(this._activePoint);
      this._activePoint = null;
      this._activeGeom = null;
      this._activeGeomPoints = [];
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this._active = true;
  }
  //获取位置
  _getPosition(position) {
    if (this._clampMode === Draw.clampMode.ClampToGround) {
      return this._viewer.scene.pickPosition(position)
    } else {
      return this._viewer.camera.pickEllipsoid(
        position,
        this._viewer.scene.globe.ellipsoid
      );
    }
  }
  //绘制线/面
  _drawShape(positions) {
    let shape;
    if (this._mode === "line") {
      shape = this._dataSource.entities.add({
        polyline: {
          positions: positions,
          clampToGround: true,
          width: 3
        }
      });
    } else if (this._mode === "polygon") {
      shape = this._dataSource.entities.add({
        polygon: {
          hierarchy: positions,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.WHITE.withAlpha(0.7)
          )
        },
      });
    }
    return shape;
  }
  //绘制点
  _createPoint(position) {
    let point = this._viewer.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString("rgba(255, 255, 255,0.5)"),
        outlineColor: Cesium.Color.fromCssColorString("rgba(235, 59, 90,1.0)"),
        outlineWidth :2
      }
    });
    return point
  }
  setViewer(viewer) {
    this._viewer = viewer;
    this._init();
  }
  active() {
    if (this._handler) {
      return
    }
    this._init();
  }
  deactive() {
    this._handler && this._handler.destroy();
    this._handler = null;
    this._active = false
  }
  clear() {
    this._activePoint && this._viewer.entities.remove(this._activePoint);
    this._deactivePoints.forEach(e=>this._viewer.entities.remove(e))
    this._activePoint = null;
    this._activeGeom = null;
    this._activeGeomPoints = [];
    this._dataSource.entities.removeAll();
  }
  on(key, cb) {
    if (typeof key === "string" && this._actionCollection[key] !== undefined) {
      this._actionCollection[key].push(cb)
    } else {
      console.error("The type of the first parameter must be string")
    }
  }
  destroy() {
    if(!this._viewer) return;
    this._handler && this._handler.destroy();
    this._handler = null;
    this._activeGeom && this._viewer.entities.remove(this._activeGeom);
    this._activeGeom = null;
    this._activePoint && this._viewer.entities.remove(this._activePoint);
    this._activePoint = null;
    this._activeGeomPoints = [];
    this._viewer.dataSources.remove(this._dataSource);
    this._dataSource=null;
  }
}