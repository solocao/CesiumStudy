import Interaction from "../BaseClasses/Interaction";

export default class Draw extends Interaction{
  constructor(options){
    super(options)
  }
  init(){
    this._handler=new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    
  }
  destroy(){

  }
}