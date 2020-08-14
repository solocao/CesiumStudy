import Interaction from "../BaseClasses/Interaction";

export default class Draw extends Interaction {
  constructor(options = {}) {
    super(options)
  }
  init() {
    this.drawingMode = "line";
    this._handler=new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
    this._dataSource = new Cesium.CustomDataSource();
    this._viewer.dataSources.add(this._dataSource);
    this.activeShapePoints = [];
    this.activeShape = null;
    this.floatingPoint = null;
    this._handler.setInputAction((event)=> {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      var earthPosition = this._viewer.scene.pickPosition(
        event.position,
      );
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          
          this.floatingPoint = this.createPoint(earthPosition);
          this.activeShapePoints.push(earthPosition);
          var dynamicPositions = new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy(this.activeShapePoints);
          }, false);
          this.activeShape = this.drawShape(dynamicPositions);
        }
        this.activeShapePoints.push(earthPosition);
        this.createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler.setInputAction((event)=> {
      if (Cesium.defined(this.floatingPoint)) {
        var newPosition = this._viewer.scene.pickPosition(
          event.endPosition,
        );
        if (Cesium.defined(newPosition)) {
          this.floatingPoint.position.setValue(newPosition);
          this.activeShapePoints.pop();
          this.activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._handler.setInputAction((event)=> {
      this.terminateShape();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  terminateShape() {
    this.activeShapePoints.pop();
    drawShape(this.activeShapePoints);
    this._dataSource.entities.remove(this.floatingPoint);
    this._dataSource.entities.remove(this.activeShape);
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activeShapePoints = [];
  }

  drawShape(positionData) {
    var shape;
    if (this.drawingMode === "line") {
      shape = this._dataSource.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: true,
          width: 3,
        },
      });
    } else if (this.drawingMode === "polygon") {
      shape = this._dataSource.entities.add({
        polygon: {
          hierarchy: positionData,
          material: Cesium.Color.WHITE.withAlpha(0.7),
          height: 0,
          outline: true,
          outlineWidth: 2,
          outlineColor: Cesium.Color.YELLOW,
          arcType: Cesium.ArcType.RHUMB,
        },
      });
    }
    return shape;
  }
  createPoint(worldPosition) {
    var point = this._dataSource.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    });
    return point;
  }
  destroy() {

  }
}