export default class Interaction{
  constructor(options){
    options=Object.assign({},options);
    Object.keys(options).forEach(key=>{
      this[key]=options[key]
    })
  }
  init(){

  }
  setViewer(viewer){
    this._viewer=viewer;
    this.init();
  }
  destroy(){
    
  }
}