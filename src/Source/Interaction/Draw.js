import Interaction from "../BaseClasses/Interaction";

export default class Draw extends Interaction {
  constructor(options = {}) {
    super(options);
    let _options = {
      drawMode: 'line',
      onTerrain: false,
      fillColor: Cesium.Color.WHITE.withAlpha(0.7),
      outlineColor: Cesium.Color.BLACK
    }
    this._options = Object.assign(_options, options)
  }

  _init() {
    if (!this._viewer.scene.pickPositionSupported) {
      window.alert("This browser does not support pickPosition.");
      this.destroy();
      return;
    }
    this._activeShapePoints = [];
    this._pointsBuffer = []
    this._activeShape = null;
    this._floatingPoint = null;
    this._floatingPoints = new Cesium.CustomDataSource();
    this._shapes = new Cesium.CustomDataSource();
    this._viewer.dataSources.add(this._floatingPoints);
    this._viewer.dataSources.add(this._shapes)
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);

  }
  draw(mode) {
    this._setDrawMode(mode);
    this._handler.setInputAction(event => {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      let earthPosition = this._pickPosition(event.position);
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (this._activeShapePoints.length === 0) {
          this._floatingPoint = this._createPoint(earthPosition);
          this._activeShapePoints.push(earthPosition);
          let dynamicPositions = new Cesium.CallbackProperty(() => {
            if (this._options.drawMode === "polygon") {
              return new Cesium.PolygonHierarchy(this._activeShapePoints);
            }
            return this._activeShapePoints;
          }, false);
          this._activeShape = this._drawShape(dynamicPositions);
        }
        this._activeShapePoints.push(earthPosition);
        this._createPoint(earthPosition);
        console.log(this._pointsBuffer.length, 'fsafsa');

      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler.setInputAction(event => {
      if (Cesium.defined(this._floatingPoint)) {
        let newPosition = this._pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          this._floatingPoint.position.setValue(newPosition);
          this._activeShapePoints.pop();
          this._activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._handler.setInputAction(() => {
      this._pointsBuffer = [];
      this._activeShapePoints.pop();
      this._terminateShape();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this._handler.setInputAction(() => {
      this._activeShapePoints.pop();
      let point = this._pointsBuffer.pop();
      this._floatingPoints.entities.remove(point);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  _terminateShape() {
    this._activeShapePoints.pop();
    this._drawShape(this._activeShapePoints);
    this._floatingPoints.entities.remove(this._floatingPoint);
    this._shapes.entities.remove(this._activeShape);
    this._floatingPoint = undefined;
    this._activeShape = undefined;
    this._activeShapePoints = [];
  }
  setViewer(viewer) {
    super.setViewer(viewer);
    this.draw()
  }
  _createPoint(worldPosition) {
    let point = this._floatingPoints.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 5,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    });
    this._pointsBuffer.push(point);

    return point;
  }

  _drawShape(positionData) {
    let shape;
    if (this._options.drawMode === "line") {
      shape = this._shapes.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: true,
          width: 3,
          material: this._options.fillColor
        },
      });
    } else if (this._options.drawMode === "polygon") {
      shape = this._shapes.entities.add({
        polygon: {
          hierarchy: positionData,
          height: 0,
          material: this._options.fillColor,
          outline: true,
          outlineColor: this._options.outlineColor
        }
      });
    }
    return shape;
  }

  _pickPosition(position) {
    return this._options.onTerrain ? this._viewer.scene.pickPosition(position) : this._viewer.camera.pickEllipsoid(position, this._viewer.scene.globe.ellipsoid)
  }

  _setDrawMode(mode) {
    if (['line', 'polygon'].find(v => v === mode)) {
      this._options.drawMode = mode
    } 
    this._floatingPoint && this._pointsBuffer.forEach(point => {
      this._floatingPoints.entities.remove(point)
    })
    this._pointsBuffer = []
    this._activeShape && this._shapes.entities.remove(this._activeShape);
    this._floatingPoint = undefined;
    this._activeShape = undefined;
    this._activeShapePoints = [];
  }

  close() {
    this._floatingPoint && this._pointsBuffer.forEach(point => {
      this._floatingPoints.entities.remove(point)
    })
    this._activeShape && this._shapes.entities.remove(this._activeShape);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  destroy() {
    this._floatingPoint && this._pointsBuffer.forEach(point => {
      this._floatingPoints.entities.remove(point)
    })
    this._activeShape && this._shapes.entities.remove(this._activeShape);
    this._viewer.dataSources.remove(this._shapes);
    this._viewer.dataSources.remove(this._floatingPoints);
    this._handler.destroy();
  }

}