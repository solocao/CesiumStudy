import {EVENTTYPE} from './Event'
export class Viewer{
  constructor(element,opt){
    this._viewer=new Cesium.Viewer(element,opt);
    this._scene=this._viewer.scene;
    this._camera=this._viewer.camera;
    this._handlers=new Map()
  }
  //设置事件监听
  on(type,cb){
    
  }
  un(){

  }
}