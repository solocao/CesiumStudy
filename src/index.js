import './css/common.css';
// import "../public/materials/ImageLine"
import events from "./js/events";
import controller from './js/virtualDom/controller'
controller()
const viewer = new Cesium.Viewer("CesiumContainer", {
    animation: false,
    // scene3DOnly: true,
    timeline: false,//时间线
    // terrainShadows: Cesium.ShadowMode.ENABLED,
    navigationHelpButton: false,
    sceneModePicker: false,
    vrButton: false,
    // baseLayerPicker: false,
    infoBox: false,
    // shadows: true,
    fullscreenButton: false,
    geocoder: false,//搜索按钮
    homeButton: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    skyBox: false,
    shouldAnimate: true,
    // automaticallyTrackDataSourceClocks: false,
    // terrainProvider:Cesium.createWorldTerrain()
    // globe: false
    // showRenderLoopErrors: false
    // contextOptions: false
    // navigationInstructionsInitiallyVisible: false,
    // imageryProvider: 
});
document.querySelector('.cesium-viewer-toolbar').style.display="none"
//移除默认鼠标事件
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);
// var shadowMap = viewer.shadowMap;
// shadowMap.maximumDistance = 10000.0;
viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 1,
    maximumLevel: 20
}));
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk=d71915a4c9b3f7e23a0e06b49c4c83c4",
    layer: "cia",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
}))

viewer.scene.postProcessStages.fxaa.enabled = true;
const popup = document.createElement('div');
popup.className = "popup";
document.getElementById("CesiumContainer").appendChild(popup);
popup.style.position = "absolute";
popup.style.display = "none";
const scene = viewer.scene;
//开启地形深度检测
// scene.globe.depthTestAgainstTerrain=true
let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(evt => {
    // scene.globe.depthTestAgainstTerrain = true;
    let feature = scene.pick(evt.position);
    console.log(feature);
    //返回笛卡尔坐标
    let position = viewer.scene.pickPosition(evt.position);
    console.log(position);
    // 转为wgs84坐标系，弧度
    if (position) {
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        console.log(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height);
        console.log(cartographic);

    }
    // scene.globe.depthTestAgainstTerrain=false
    if (Cesium.defined(feature)) {
        if (!popup.position) {
            Object.defineProperty(popup, "position", {
                value: position,
                writable: true
            })
        } else {
            popup.position = position;
        }
        console.log(feature.id.properties);
        popup.innerHTML = `<h1>${feature.id.properties.propertyNames.map(key => {
            return `${key}:${feature.id.properties[key].getValue()}`
        }).join('\n')}</h1>`;
        popup.style.left = evt.position.x + 'px';
        popup.style.top = evt.position.y + 'px';
        popup.style.display = "block";
        // let coords=Cesium.SceneTransforms.wgs84ToWindowCoordinates
    } else {
        popup.style.display = "none"
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
scene.postRender.addEventListener(() => {
    if (popup.style.display === "block") {
        let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, popup.position);
        if (!windowPosition) return;
        popup.style.left = windowPosition.x + 'px';
        popup.style.top = windowPosition.y - 10 + 'px';
    }
})
let url3D = "";
if (process.env.NODE_ENV == 'development') { // 开发环境
  url3D=""
} else if (process.env.NODE_ENV == 'production') { // 生产环境
  url3D = '/3Dplatform'
}
let tile = scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url3D + "/3DTiles/tileset.json"
}))
tile.readyPromise.then(tileset => {
    let bound = tileset.boundingSphere;
    let cartographic = Cesium.Cartographic.fromCartesian(
        bound.center
    );
    let surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
    );
    let offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude, -cartographic.height + 12
    );
    let translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // viewer.flyTo(tileset);
})

events(viewer)



// let lightCamera = new Cesium.Camera(viewer.scene);
// // lightCamera.position=new Cesium.Cartesian3(  -2212539.3438496306,  4837819.1181787215,  3506839.8299608896);
// lightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE;
// lightCamera.frustum.near = 1.0;
// lightCamera.frustum.far = 200;
// lightCamera.setView({
//     destination: Cesium.Cartesian3.fromDegrees(114.57609751727144, 33.572034732917295, 13.790375165636664),
//     orientation: {
//         heading: 6.074354589652639, pitch: 0.06751239637465978, roll: 6.282567622990175
//     }
// })
// viewer.entities.add({
//     position: Cesium.Cartesian3.fromDegrees(114.57609751727144, 33.572034732917295, 16.790375165636664),
//     point: {
//         pixelSize: 20,
//         color: Cesium.Color.RED
//     }
// })

// viewer.camera.setView({
//     destination: new Cesium.Cartesian3(-2212400.698512635
//         , 4837671.96370474
//         , 3507128.347197567),
// })
// let shadowMap = new Cesium.ShadowMap({
//     context: viewer.scene.context,
//     lightCamera,
//     enabled: true,
//     isPointLight: true,
//     pointLightRadius: 5000,
//     softShadows: true,
//     normalOffset: false,
//     fromLightSource: true,
//     // darkness:0.4,
//     maximumDistance: 5000
// });
// shadowMap.size = 2048
// viewer.scene.shadowMap = shadowMap;
// // viewer.scene.globe.shadows = Cesium.ShadowMode.ENABLED
// const fragmentShader = `
//  #define USE_CUBE_MAP_SHADOW true
//  uniform sampler2D colorTexture;
//  uniform sampler2D depthTexture;
//  varying vec2 v_textureCoordinates;
//  uniform mat4 camera_projection_matrix;
//  uniform mat4 camera_view_matrix;
//  uniform float far;
//  uniform samplerCube shadowMap_textureCube;
//  uniform mat4 shadowMap_matrix;
//  uniform vec4 shadowMap_lightPositionEC;
//  uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
//  uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;

//  struct zx_shadowParameters
//  {
//      vec3 texCoords;
//      float depthBias;
//      float depth;
//      float nDotL;
//      vec2 texelStepSize;
//      float normalShadingSmooth;
//      float darkness;
//  };


//  float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters)
//  {
//      float depthBias = shadowParameters.depthBias;
//      float depth = shadowParameters.depth;
//      float nDotL = shadowParameters.nDotL;
//      float normalShadingSmooth = shadowParameters.normalShadingSmooth;
//      float darkness = shadowParameters.darkness;
//      vec3 uvw = shadowParameters.texCoords;
//      depth -= depthBias;
//      float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
//      return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
//  }

//  vec4 getPositionEC(){
//      return czm_windowToEyeCoordinates(gl_FragCoord);
//  }

//  vec3 getNormalEC(){
//      return vec3(1.);
//  }

//  vec4 toEye(in vec2 uv,in float depth){
//      vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
//      vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
//      posInCamera=posInCamera/posInCamera.w;
//      return posInCamera;
//  }

//  vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point){
//      vec3 v01=point-planeOrigin;
//      float d=dot(planeNormal,v01);
//      return(point-planeNormal*d);
//  }

//  float getDepth(in vec4 depth){
//      float z_window=czm_unpackDepth(depth);
//      z_window=czm_reverseLogDepth(z_window);
//      float n_range=czm_depthRange.near;
//      float f_range=czm_depthRange.far;
//      return(2.*z_window-n_range-f_range)/(f_range-n_range);
//  }

//  float shadow( in vec4 positionEC ){
//      vec3 normalEC=getNormalEC();
//      zx_shadowParameters shadowParameters;
//      shadowParameters.texelStepSize=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
//      shadowParameters.depthBias=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
//      shadowParameters.normalShadingSmooth=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
//      shadowParameters.darkness=shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
//      vec3 directionEC=positionEC.xyz-shadowMap_lightPositionEC.xyz;
//      float distance=length(directionEC);
//      directionEC=normalize(directionEC);
//      float radius=shadowMap_lightPositionEC.w;
//      if(distance>radius)
//      {
//          return 2.0;
//      }
//      vec3 directionWC=czm_inverseViewRotation*directionEC;
//      shadowParameters.depth=distance/radius-0.0003;
//      shadowParameters.nDotL=clamp(dot(normalEC,-directionEC),0.,1.);
//      shadowParameters.texCoords=directionWC;
//      float visibility=czm_shadowVisibility(shadowMap_textureCube,shadowParameters);
//      return visibility;
//  }

//  bool visible(in vec4 result)
//  {
//      result.x/=result.w;
//      result.y/=result.w;
//      result.z/=result.w;
//      return result.x>=-1.&&result.x<=1.
//      &&result.y>=-1.&&result.y<=1.
//      &&result.z>=-1.&&result.z<=1.;
//  }

//  void main(){
//      // 得到釉色 = 结构二维(彩色纹理,纹理坐标)
//      gl_FragColor=texture2D(colorTexture,v_textureCoordinates);
//      // 深度 = (釉色 = 结构二维(深度纹理,纹理坐标))
//      float depth=getDepth(texture2D(depthTexture,v_textureCoordinates));
//      // 视角 = (纹理坐标,深度)
//      vec4 viewPos=toEye(v_textureCoordinates,depth);
//      //世界坐标
//      vec4 wordPos=czm_inverseView*viewPos;
//      // 虚拟相机中坐标
//      vec4 vcPos=camera_view_matrix*wordPos;
//      float near=.001*far;
//      float dis=length(vcPos.xyz);
//      if(dis>near&&dis<far){
//          //透视投影
//          vec4 posInEye=camera_projection_matrix*vcPos;
//          // 可视区颜色
//          vec4 v_color=vec4(0.,1.,0.,.5);
//          vec4 inv_color=vec4(1.,0.,0.,.5);
//          if(visible(posInEye)){
//              float vis=shadow(viewPos);
//              if(vis>0.3){
//                  gl_FragColor=mix(gl_FragColor,v_color,.5);
//              } else{
//                  gl_FragColor=mix(gl_FragColor,inv_color,.5);
//              }
//          }
//      }
//  }`;


// const postStage = new Cesium.PostProcessStage({
//     fragmentShader,
//     uniforms: {
//         camera_projection_matrix: lightCamera.frustum.projectionMatrix,
//         camera_view_matrix: lightCamera.viewMatrix,
//         far: () => {
//             return 100;
//         },
//         shadowMap_textureCube: () => {
//             shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
//             return Reflect.get(shadowMap, "_shadowMapTexture");
//         },
//         shadowMap_matrix: () => {
//             shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
//             return Reflect.get(shadowMap, "_shadowMapMatrix");
//         },
//         shadowMap_lightPositionEC: () => {
//             shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
//             return Reflect.get(shadowMap, "_lightPositionEC");
//         },
//         shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
//             shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
//             const bias = shadowMap._pointBias;
//             return Cesium.Cartesian4.fromElements(
//                 bias.normalOffsetScale,
//                 shadowMap._distance,
//                 shadowMap.maximumDistance,
//                 0.0,
//                 new Cesium.Cartesian4()
//             );
//         },
//         shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
//             shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
//             const bias = shadowMap._pointBias;
//             const scratchTexelStepSize = new Cesium.Cartesian2();
//             const texelStepSize = scratchTexelStepSize;
//             texelStepSize.x = 1.0 / shadowMap._textureSize.x;
//             texelStepSize.y = 1.0 / shadowMap._textureSize.y;
//             return Cesium.Cartesian4.fromElements(
//                 texelStepSize.x,
//                 texelStepSize.y,
//                 bias.depthBias,
//                 bias.normalShadingSmooth,
//                 new Cesium.Cartesian4()
//             );
//         }
//     }
// });
// viewer.scene.postProcessStages.add(postStage);