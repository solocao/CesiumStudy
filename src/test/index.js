import Globe from '../Source/index';
import Draw from "../Source/Interaction/Draw"
import Overlay from '../Source/Overlay';

let globe = new Globe('app', true);

// let draw=new Draw({
//   drawMode:'polygon'
// });
// globe.addInteraction(draw)
// setTimeout(()=>{
//   draw.draw('line')
//   setTimeout(()=>{
//     draw.close();
//     console.log(draw);
//   },5000);
// },10000);


let popup = new Overlay({
  element: document.getElementById('popup'),
  positioning: 'center-center',
  autoPan: true
})
globe.addOverLay(popup)

globe.viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(105.08310805754294, 31.832973133585675),
  point: {
    color: Cesium.Color.RED,
    pixelSize: 20
  }
})
globe.on('click', (evt) => {
  let feature = globe.scene.pick(evt.position);
  if (feature) {
    popup.setPosition(evt.cartesian);
  }else{
    popup.setPosition(undefined);
  }
})
// popup.setPosition(Cesium.Cartesian3.fromDegrees(105.08310805754294, 31.832973133585675));

// let key = globe.on('click', (evt) => {
//   // let features=globe.getEntitiesAtPosition(evt.cartesian);
//   console.log(evt);
// })
// let arr=[]
// let key1 = globe.on('mouseMove', (evt) => {
//   if(evt){
//     arr.push(evt.cartesian)
//   }
// })
// globe.viewer.entities.add({
//   polyline:{
//     positions:new Cesium.CallbackProperty(()=>{
//       return arr
//     },false)
//   }
// })
// setTimeout(() => {
//   globe.unByKey('click',key1)
// }, 5000)
// setTimeout(() => {
//   globe.un('click')
// }, 10000)