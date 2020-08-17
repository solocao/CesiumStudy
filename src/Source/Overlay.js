export default class Overlay {
  constructor(option = {}) {
    option = Object.assign({}, option);
    let _option = {
      element: null,
      position: null
    }
    this._option = Object.assign(_option, option)
  }
  _init() {
    if (!this._option.element) return;
    this._option.position && this._addListener();
  }
  setElement(element) {
    if (element instanceof HTMLElement) {
      this._option.element = element;
      this._viewer && this._init();
    }
  }
  setViewer(viewer) {
    this._viewer = viewer;
    this._init();
  }
  getElement() {
    return this._option.element
  }
  _addListener() {
    this._listener = this._viewer.scene.postRender.addEventListener(() => {
      let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._option.position);
      if (!windowPosition) return;
      this._option.element.style.left = windowPosition.x + 'px';
      this._option.element.style.top = windowPosition.y + 'px';
    })
  }
  setPosition(position) {
    if (position) {
      this._option.position = position;
      this._option.element.style.display = 'block';
      (!this._listener) && this._addListener()
    } else {
      this._option.element.style.display = 'none';
      this._option.position = undefined;
      this._listener && this._listener();
      this._listener = null
    }
  }
  destory() {
    this._listener && this._listener();
    this._option.element.style.display = 'none';
  }
}