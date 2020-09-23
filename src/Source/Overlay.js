export default class Overlay {
  constructor({
    element,
    position,
    positioning ,
    autoPan,
    offset,
    viewer
  }) {
    this._element=element;
    this._position=position;
    this._positioning=(positioning||'top-center');
    this._autoPan=(autoPan||false);
    this._offset=(offset||[0, 0]);
    this._viewer=viewer;
    if (this._viewer && (this._viewer instanceof Cesium.Viewer)) {
      
      this.setViewer(this._viewer)
    }
  }
  _init() {
    if (!this._element) return;
    let element = this._element
    let positioning = this._positioning.split('-');
    element.style.transform = ''
    let x, y;
    switch (positioning[0]) {
      case 'bottom':
        y = `translateY(calc(-100% + ${this._offset[1]}px))`
        break;
      case 'center':
        y = `translateY(calc(-50% + ${this._offset[1]}px))`
        break;
      case 'top':
        y = `translateY(${this._offset[1]}px)`
    }
    switch (positioning[1]) {
      case 'left':
        x = `translateX(${this._offset[0]}px)`
        break;
      case 'center':
        x = `translateX(calc(-50% + ${this._offset[0]}px))`;
        break;
      case 'right':
        x = `translateX(calc(-100% + ${this._offset[0]}px))`;
        break;
    }
    element.style.transform = `${x} ${y}`;
    this._position && this._addListener();
  }
  setElement(element) {
    if (element instanceof HTMLElement) {
      this._element = element;
      this._viewer && this._init();
    }
  }
  setViewer(viewer) {
    viewer.container.style.position="relative";
      this._element.style.position="absolute";
      (!viewer.container.contains(this._element))&&viewer.container.appendChild(this._element)
    this._viewer = viewer;
    this._init();
  }
  getElement() {
    return this._element
  }

  _addListener() {
    this._listener = this._viewer.scene.postRender.addEventListener(() => {
      if (!this._position) return;
      let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._position);
      if (!windowPosition) return;
      this._element.style.left = windowPosition.x + 'px';
      this._element.style.top = windowPosition.y + 'px';
    })
  }
  setPosition(position) {
    if (!this._viewer || !this._element) return;
    this._listener && this._listener();
    this._listener = null;
    if (position) {
      this._position = position;
      (!this._listener) && this._addListener()
      this._element.style.display = 'block';
    } else {
      this._element.style.display = 'none';
      this._position = undefined;
    }
  }
  destory() {
    if (!this._viewer) return;
    this._listener && this._listener();
    this._element.style.display = 'none';
    this._viewer = null;
    this._element = null
  }
}