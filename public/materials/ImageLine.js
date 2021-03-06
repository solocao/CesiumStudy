console.log(Cesium);

function PolylineTrailLinkMaterialProperty(color, duration, image) {

  this._definitionChanged = new Cesium.Event();

  this._color = undefined;

  this._colorSubscription = undefined;

  this.color = color;

  this.duration = duration;

  this.image = image;

  this._time = (new Date()).getTime();

}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {

  isConstant: {

    get: function () {

      return false;

    }

  },

  definitionChanged: {

    get: function () {

      return this._definitionChanged;

    }

  },

  color: Cesium.createPropertyDescriptor('color')

});

PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {

  return 'PolylineTrailLink';

}

PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {

  if (!Cesium.defined(result)) {

    result = {};

  }

  result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);

  result.image = this.image;

  result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;

  return result;

}

PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {

  return this === other ||

    (other instanceof PolylineTrailLinkMaterialProperty &&

      Cesium.Property.equals(this._color, other._color))

}

Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;

Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';

// Cesium.Material.PolylineTrailLinkImage = "./sampledata/images/colors.png";
// Cesium.Material.PolylineTrailLinkImage = require('@/assets/images/line1.png');
// Cesium.Material.PolylineTrailLinkImage = lineImg;

Cesium.Material.PolylineTrailLinkSource = `czm_material czm_getMaterial(czm_materialInput materialInput)

{
	

	czm_material material = czm_getDefaultMaterial(materialInput); 

	vec2 st = materialInput.st; 

	vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.s)); 
	// vec4 colorImage = texture2D(image, vec2(st.s, st.t)); 

	material.alpha =colorImage.a;

	// material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
	material.diffuse = colorImage.rgb;
	// material.diffuse =   color.rgb; 

	material.specular=1.0;
	// material.shininess=0.5;
	// material.emission=vec3(0.5);

	return material; 

} `;

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {

  fabric: {

    // type: Cesium.Material.PolylineTrailLinkType,
    type: Cesium.Material.PolylineTrailLinkType,

    uniforms: {

      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),

      image: '',

      time: 0

    },

    source: Cesium.Material.PolylineTrailLinkSource

  },

  translucent: function (material) {

    return true;

  }

});

















































function ODLineMaterialProperty(color, duration) {

  this._definitionChanged = new Cesium.Event();

  this._color = undefined;

  this._colorSubscription = undefined;

  this.color = color;

  this.totoalFrameCount = duration;

  this._time = (new Date()).getTime();

}

Object.defineProperties(ODLineMaterialProperty.prototype, {

  isConstant: {

    get: function () {

      return false;

    }

  },

  definitionChanged: {

    get: function () {

      return this._definitionChanged;

    }

  },

  color: Cesium.createPropertyDescriptor('color')

});

ODLineMaterialProperty.prototype.getType = function (time) {

  return 'ODLine';

}

ODLineMaterialProperty.prototype.getValue = function (time, result) {

  if (!Cesium.defined(result)) {

    result = {};

  }

  result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
  result.totoalFrameCount = this.totoalFrameCount;
  return result;
}

ODLineMaterialProperty.prototype.equals = function (other) {

  return this === other ||

    (other instanceof ODLineMaterialProperty &&

      Cesium.Property.equals(this._color, other._color))

}

Cesium.ODLineMaterialProperty = ODLineMaterialProperty;

Cesium.Material.ODLineType = 'ODLine';

// Cesium.Material.PolylineTrailLinkImage = "./sampledata/images/colors.png";
// Cesium.Material.PolylineTrailLinkImage = require('@/assets/images/line1.png');
// Cesium.Material.PolylineTrailLinkImage = lineImg;

Cesium.Material.ODLineSource = `czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    //float t = time;
    float t = mod(czm_frameNumber, totoalFrameCount) / totoalFrameCount; 
    t *= 1.03;
    float alpha = smoothstep(t- 0.03, t, st.s) * step(-t, -st.s); 
    alpha += 0.6;
    //alpha *= step(-0.4, -abs(0.5-st.t));  
    material.diffuse = color.rgb;
    material.alpha = alpha;
    return material;
}`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.ODLineType, {
  fabric: {
    type: Cesium.Material.ODLineType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      totoalFrameCount: 45
    },
    source: Cesium.Material.ODLineSource
  }
});



//扫描线
function ScanLineMaterialProperty(color, duration) {

  this._definitionChanged = new Cesium.Event();

  this._color = undefined;

  this._colorSubscription = undefined;

  this.color = color;

  this.time = duration;

  this._time = (new Date()).getTime();

}

Object.defineProperties(ScanLineMaterialProperty.prototype, {

  isConstant: {

    get: function () {

      return false;

    }

  },

  definitionChanged: {

    get: function () {

      return this._definitionChanged;

    }

  },

  color: Cesium.createPropertyDescriptor('color')

});

ScanLineMaterialProperty.prototype.getType = function (time) {

  return 'ScanLine';

}

ScanLineMaterialProperty.prototype.getValue = function (time, result) {

  if (!Cesium.defined(result)) {

    result = {};

  }

  result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
  result.time = this.time;
  return result;
}

ScanLineMaterialProperty.prototype.equals = function (other) {

  return this === other ||

    (other instanceof ScanLineMaterialProperty &&

      Cesium.Property.equals(this._color, other._color))

}

Cesium.ScanLineMaterialProperty = ScanLineMaterialProperty;
Cesium.Material.ScanLineType = 'ScanLine';

// Cesium.Material.PolylineTrailLinkImage = "./sampledata/images/colors.png";
// Cesium.Material.PolylineTrailLinkImage = require('@/assets/images/line1.png');
// Cesium.Material.PolylineTrailLinkImage = lineImg;

Cesium.Material.ScanLineSource = `    float circle(vec2 uv, float r, float blur) {
  float d = length(uv) * 2.0;
  float c = smoothstep(r+blur, r, d);
  return c;
}

uniform vec4 color;
uniform float time;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st - 0.5;
material.diffuse = color.rgb;
material.emission = vec3(0);
float t = time;
float s = 0.3;
float radius1 = smoothstep(.0, s, t) * 0.5;
float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);
float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);
float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);

material.alpha = smoothstep(1.0, s, t) * (alpha1*0.0 + alpha2*0.4 + alpha3*0.2);
material.alpha *= color.a;

return material;
}
`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.ScanLineType, {
  fabric: {
    type: Cesium.Material.ScanLineType,
    uniforms: {
      color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
      time: 0.5
    },
    source: Cesium.Material.ScanLineSource
  }
});
