export default class Interaction{
  constructor(options){
    options=Object.assign({},options);
  }
  _init(){}
  setViewer(viewer){
    this._viewer=viewer;
    this._init();
  }
  destroy(){}
}