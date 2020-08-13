/**
 * 动态扩散圆纹理
 * @param {} color 颜色
 * @param {} duration 持续时间毫秒
 **/
function ScanMaterialProperty(color, duration) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = color;
  this.duration = duration;
  this._time = new Date().getTime();
}
Object.defineProperties(ScanMaterialProperty.prototype, {
  isConstant: {
      get: function () {
          return false;
      },
  },
  definitionChanged: {
      get: function () {
          return this._definitionChanged;
      },
  },
  color: Cesium.createPropertyDescriptor("color"),
});
ScanMaterialProperty.prototype.getType = function (time) {
  return "Scan";
};
ScanMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
      result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
  );
  result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
  return result;
};
ScanMaterialProperty.prototype.equals = function (other) {
  return (
      this === other ||
      (other instanceof ScanMaterialProperty &&
          Property.equals(this._color, other._color))
  );
};
Cesium.ScanMaterialProperty = ScanMaterialProperty;

Cesium.Material.ScanType = "Scan";

Cesium.Material.ScanSource = `czm_material czm_getMaterial(czm_materialInput materialInput){

czm_material material = czm_getDefaultMaterial(materialInput);
material.diffuse =  color.rgb;
vec2 st = materialInput.st;
float dis = distance(st, vec2(0.5, 0.5));
float per = fract(time);
if(dis > per * 0.5) {
  material.alpha = 0.0;
  discard;
}else{
  material.alpha = color.a * dis / per / per / 1.0;
}
return material;
}`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.ScanType, {
  fabric: {
      type: Cesium.Material.ScanType,
      uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 1),
          time: 0,
      },
      source: Cesium.Material.ScanSource,
  },
  translucent: function (material) {
      return true;
  },
});
