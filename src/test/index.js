import Globe from '../Source/index';

let globe = new Globe('app');
let key = globe.on('click', (evt) => {
  let features=globe.getEntitiesAtPosition(evt.cartesian);
  console.log(features);
})
let key1 = globe.on('click', (evt) => {
  console.log(evt);
})
setTimeout(() => {
  globe.unByKey('click',key1)
}, 10000)