
export default class Draw {
  constructor({
    viewer
  }) {
    this._viewer = (viewer || null);
    this._activePoint = null;
    this._lines = [];
    this._activeGeom = [];
    this._viewer && this._init();
  }

  _init() {
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    this._handler.setInputAction((event) => {

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this._handler.setInputAction(event => {

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this._handler.setInputAction((event) => {

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  }
  setViewer(){
    
  }
  active(){

  }
  deactive(){

  }
  destroy(){

  }
}