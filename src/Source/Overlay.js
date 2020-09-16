export default class Overlay {
  constructor(option = {}) {
    let _option = {
      element: null,
      position: null,
      positioning: 'top-center',
      autoPan:false,
      offset:[0,0]
    }
    this._option = Object.assign(_option, option)
    if(this._option.viewer&&(this._option.viewer instanceof Cesium.Viewer)){
      this.setViewer(this._option.viewer)
    }
  }
  _init() {
    if (!this._option.element) return;
    let element = this._option.element
    let positioning = this._option.positioning.split('-');
    element.style.transform = ''
    switch (positioning[0]) {
      case 'bottom':
        element.style.transform += 'translateY(-100%)'
        break;
      case 'center':
        element.style.transform += 'translateY(-50%)';
        break;
      case 'top':
        element.style.transform += 'translateY(0)'
    }
    switch (positioning[1]) {
      case 'left':
        element.style.transform += 'translateX(0)';
        break;
      case 'center':
        element.style.transform += 'translateX(-50%)';
        break;
      case 'right':
        element.style.transform += 'translateX(-100%)';
        break;
    }
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
      if(!this._option.position) return;
      let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._option.position);
      if (!windowPosition) return;
      this._option.element.style.left = windowPosition.x + 'px';
      this._option.element.style.top = windowPosition.y + 'px';
    })
  }
  setPosition(position) {
    if(!this._viewer||!this._option.element) return;
    this._listener && this._listener();
    this._listener=null;
    if (position) {
      this._option.position = position;
      (!this._listener) && this._addListener()
      this._option.element.style.display = 'block';
    } else {
      this._option.element.style.display = 'none';
      this._option.position = undefined;
    }
  }
  destory() {
    if(!this._viewer) return;
    this._listener && this._listener();
    this._option.element.style.display = 'none';
    this._viewer=null;
    this._option.element=null
  }
}