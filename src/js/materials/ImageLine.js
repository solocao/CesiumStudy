// export function PolylineTrailLinkMaterialProperty(color, duration, image) {

//   this._definitionChanged = new Cesium.Event();

//   this._color = undefined;

//   this._colorSubscription = undefined;

//   this.color = color;

//   this.duration = duration;

//   this.image = image;

//   this._time = (new Date()).getTime();

// }

// Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {

//   isConstant: {

//     get: function () {

//       return false;

//     }

//   },

//   definitionChanged: {

//     get: function () {

//       return this._definitionChanged;

//     }

//   },

//   color: Cesium.createPropertyDescriptor('color')

// });

// PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {

//   return 'PolylineTrailLink';

// }

// PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {

//   if (!Cesium.defined(result)) {

//     result = {};

//   }

//   result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);

//   result.image = this.image;

//   result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;

//   return result;

// }

// PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {

//   return this === other ||

//     (other instanceof PolylineTrailLinkMaterialProperty &&

//       Cesium.Property.equals(this._color, other._color))

// }

// Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;

// Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';

// // Cesium.Material.PolylineTrailLinkImage = "./sampledata/images/colors.png";
// // Cesium.Material.PolylineTrailLinkImage = require('@/assets/images/line1.png');
// // Cesium.Material.PolylineTrailLinkImage = lineImg;

// Cesium.Material.PolylineTrailLinkSource = `czm_material czm_getMaterial(czm_materialInput materialInput)

// {
	

// 	czm_material material = czm_getDefaultMaterial(materialInput); 

// 	vec2 st = materialInput.st; 

// 	vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t)); 
// 	// vec4 colorImage = texture2D(image, vec2(st.s, st.t)); 

// 	material.alpha = 1.0;

// 	// material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
// 	material.diffuse = colorImage.rgb;
// 	// material.diffuse =   color.rgb; 

// 	material.specular=1.0;
// 	// material.shininess=0.5;
// 	// material.emission=vec3(0.5);

// 	return material; 

// } `;

// Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {

//   fabric: {

//     // type: Cesium.Material.PolylineTrailLinkType,
//     type: Cesium.Material.PolylineTrailLinkType,

//     uniforms: {

//       color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),

//       image: '',

//       time: 0

//     },

//     source: Cesium.Material.PolylineTrailLinkSource

//   },

//   translucent: function (material) {

//     return true;

//   }

// });




