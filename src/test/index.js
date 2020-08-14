import Globe from '../Source/index';
import Draw from "../Source/Interaction/Draw"

let globe = new Globe('app',true);

let draw=new Draw();
globe.addInteraction(draw)
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