import Event from './Event';
export class Globe{
  constructor(elementId,options){
    this.viewer=new Cesium.Viewer(elementId,options);
    this.scene=this.viewer.scene;
    this.camera=this.viewer.camera;
    this.sources=this.viewer.dataSources;
    this.entities=this.viewer.entities;
    this.primitives=this.scene.primitives;
  }
  on(type,cb){

  }
  un(){

  }
  addInteraction(){

  }
  removeInteraction(){

  }
  addOverLay(){

  }
  removeOverLay(){

  }
}