import Interaction from "../BaseClasses/Interaction";

export default class Measure extends Interaction {
  constructor(viewer,measureMode) {
    this._viewer=(viewer||null);
    this._measureMode=(measureMode||Measure.measureMode.LENGTH);
    this._viewer&&this._init();
  }
  static measureMode = {
    LENGTH: 'length',
    AREA: 'area',
    HEIGHT: 'height'
  }
  _init() {
    
  }
  setViewer(viewer) {
    this._viewer=viewer;
    this._init();
  }
  destroy() {

  }
}