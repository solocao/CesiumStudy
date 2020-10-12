
export default class Draw {
  constructor(
    viewer, mode
  ) {
    this._viewer = (viewer || null);
    this._mode = (mode || null);
    this._activePoint = null;
    this._activeGeomPoints = [];
    this._activeGeom = null;
    this._active = false;
    this._viewer && this._init();
  }

  get isActive() {
    return this._active;
  }
  _init() {
    this._dataSource = new Cesium.CustomDataSource();
    this._viewer.dataSources.add(this._dataSource);
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._handler.setInputAction((event) => {
      let earthPosition = this._viewer.scene.pickPosition(event.position);
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
        this._createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this._handler.setInputAction(event => {
      if (Cesium.defined(this._activePoint)) {
        let earthPosition = this._viewer.scene.pickPosition(event.endPosition);
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
      this._drawShape(this._activeGeomPoints);
      this._viewer.entities.remove(this._activeGeom);
      this._viewer.entities.remove(this._activePoint);
      this._activePoint = null;
      this._activeGeom = null;
      this._activeGeomPoints = [];
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this._active = true;
  }
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
  _createPoint(position) {
    let point = this._viewer.entities.add({
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString("rgba(255, 255, 255,0.5)"),
        outlineColor: Cesium.Color.fromCssColorString("rgba(235, 59, 90,1.0)")
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
  destroy() {

  }
}