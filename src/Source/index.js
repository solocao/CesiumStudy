import Events from './Events.js';
import Interaction from './BaseClasses/Interaction';
import Overlay from './Overlay'
export default class Globe {
  constructor(elementId, options) {
    this.viewer = new Cesium.Viewer(elementId, options);
    this.scene = this.viewer.scene;
    this.camera = this.viewer.camera;
    this.dataSources = this.viewer.dataSources;
    this.entities = this.viewer.entities;
    this.primitives = this.scene.primitives;
    this._events = new Events(this.viewer);
    this._overlays = [];
  }
  //添加一个监听事件，返回唯一的key值
  on(type, cb) {
    return this._events.addEvent(type, cb);
  }
  un(type) {
    this._events.removeAll(type)
  }
  //根据key值删除鼠标事件监听
  unByKey(type, key) {
    this._events.removeEvent(type, key)
  }
  addInteraction(interaction) {
    (interaction instanceof Interaction) && interaction.setViewer(this.viewer);
  }
  removeInteraction(interaction) {
    if (interaction instanceof Interaction) {
      interaction.destroy();
      interaction = null;
    }
  }
  addOverLay(overlay) {
    if (overlay instanceof Overlay) {
      overlay.setViewer(this.viewer);
      this._overlays.push(overlay)
    }
  }
  getOverlays() {
    return this._overlays;
  }
  removeOverLay(overlay) {
    if (overlay instanceof Overlay) {
      this._overlays = this._overlays.filter(ol => {
        return ol !== overlay;
      });
      overlay.destory();
    }
  }
}