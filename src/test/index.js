import Globe from '../Source/index';
import Draw from "../Source/Interaction/Draw"
import Overlay from '../Source/Overlay';

let globe = new Globe('app', {
    // selectionIndicator: false,
    // infoBox: false,
    terrainProvider: Cesium.createWorldTerrain(),
});
// globe.viewer.terrainProvider = Cesium.createWorldTerrain()
globe.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    minimumLevel: 1,
    maximumLevel: 20
}));
globe.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk=d71915a4c9b3f7e23a0e06b49c4c83c4",
    layer: "cia",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
}))
globe.camera.setView({
    destination: new Cesium.Cartesian3(-2852838.955648131, 4654137.236666314, 3287695.3615018753)
})

// let draw=new Draw({
//   // drawMode:'line',
//   viewer:globe.viewer,
//   onTerrain:true
// });
// draw.on('start',(p)=>{
//   console.log(p);
// })
// draw.on('end',(p)=>{
//   // draw.close()
// })
// globe.addInteraction(draw)
// setTimeout(()=>{
//   draw.draw('line')
//   setTimeout(()=>{
//     draw.close();
//     setTimeout(()=>{
//       draw.draw('polygon')
//     },5000)
//   },5000);
// },10000);

let el=document.createElement('div');
el.className="popup";
// document.getElementById('app').appendChild(el)
let popup = new Overlay({
    element: el,
    positioning: 'center-left',
    offset: [100, 100],
    autoPan: true,
    viewer: globe.viewer
})
// globe.addOverLay(popup);

globe.entities.add({
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
    } else {
        popup.setPosition(undefined)
    }
})

// popup.setPosition(Cesium.Cartesian3.fromDegrees(105.08310805754294, 31.832973133585675));


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






// var viewer = new Cesium.Viewer("app", {
//   selectionIndicator: false,
//   infoBox: false,
//   terrainProvider: Cesium.createWorldTerrain(),
// });

// if (!viewer.scene.pickPositionSupported) {
//   window.alert("This browser does not support pickPosition.");
// }

// viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
//   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
// );
// function createPoint(worldPosition) {
//   var point = viewer.entities.add({
//     position: worldPosition,
//     point: {
//       color: Cesium.Color.WHITE,
//       pixelSize: 5,
//       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//     },
//   });
//   return point;
// }
// var drawingMode = "line";
// function drawShape(positionData) {
//   var shape;
//   if (drawingMode === "line") {
//     shape = viewer.entities.add({
//       polyline: {
//         positions: positionData,
//         clampToGround: true,
//         width: 3,
//       },
//     });
//   } else if (drawingMode === "polygon") {
//     shape = viewer.entities.add({
//       polygon: {
//         hierarchy: positionData,
//         material: new Cesium.ColorMaterialProperty(
//           Cesium.Color.WHITE.withAlpha(0.7)
//         ),
//       },
//     });
//   }
//   return shape;
// }
// var activeShapePoints = [];
// var activeShape;
// var floatingPoint;
// var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
// handler.setInputAction(function (event) {
//   // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
//   // we get the correct point when mousing over terrain.
//   var earthPosition = viewer.scene.pickPosition(event.position);
//   // `earthPosition` will be undefined if our mouse is not over the globe.
//   if (Cesium.defined(earthPosition)) {
//     if (activeShapePoints.length === 0) {
//       floatingPoint = createPoint(earthPosition);
//       activeShapePoints.push(earthPosition);
//       var dynamicPositions = new Cesium.CallbackProperty(function () {
//         if (drawingMode === "polygon") {
//           return new Cesium.PolygonHierarchy(activeShapePoints);
//         }
//         return activeShapePoints;
//       }, false);
//       activeShape = drawShape(dynamicPositions);
//     }
//     activeShapePoints.push(earthPosition);
//     createPoint(earthPosition);
//   }
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// handler.setInputAction(function (event) {
//   if (Cesium.defined(floatingPoint)) {
//     var newPosition = viewer.scene.pickPosition(event.endPosition);
//     if (Cesium.defined(newPosition)) {
//       floatingPoint.position.setValue(newPosition);
//       activeShapePoints.pop();
//       activeShapePoints.push(newPosition);
//     }
//   }
// }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
// // Redraw the shape so it's not dynamic and remove the dynamic shape.
// function terminateShape() {
//   activeShapePoints.pop();
//   drawShape(activeShapePoints);
//   viewer.entities.remove(floatingPoint);
//   viewer.entities.remove(activeShape);
//   floatingPoint = undefined;
//   activeShape = undefined;
//   activeShapePoints = [];
// }
// handler.setInputAction(function (event) {
//   terminateShape();
// }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

// var options = [
//   {
//     text: "Draw Lines",
//     onselect: function () {
//       if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
//         window.alert(
//           "This browser does not support polylines on terrain."
//         );
//       }

//       terminateShape();
//       drawingMode = "line";
//     },
//   },
//   {
//     text: "Draw Polygons",
//     onselect: function () {
//       terminateShape();
//       drawingMode = "polygon";
//     },
//   },
// ];

// Sandcastle.addToolbarMenu(options);
// // Zoom in to an area with mountains
// viewer.camera.lookAt(
//   Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
//   new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
// );
// viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
let viewer = globe.viewer

let lightCamera = new Cesium.Camera(viewer.scene);
lightCamera.position = new Cesium.Cartesian3(-2852838.955648131, 4654137.236666314, 3287695.3615018753);
lightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE;
lightCamera.frustum.near = 1.0;
lightCamera.frustum.far = 1000;
lightCamera.setView({
    destination: new Cesium.Cartesian3(-2852838.955648131, 4654137.236666314, 3287695.3615018753),
    orientation: {
        heading: 6.074354589652639, pitch: 0.06751239637465978, roll: 6.282567622990175
    }
})
viewer.camera.setView({
    destination: new Cesium.Cartesian3(-2852838.955648131, 4654137.236666314, 3287695.3615018753),
})
let shadowMap = new Cesium.ShadowMap({
    context: viewer.scene.context,
    lightCamera,
    enabled: true,
    isPointLight: true,
    pointLightRadius: 1000,
    softShadows: true,
    normalOffset: false,
    fromLightSource: false
});
viewer.scene.shadowMap = shadowMap;

const fragmentShader = `
 #define USE_CUBE_MAP_SHADOW true
 uniform sampler2D colorTexture;
 uniform sampler2D depthTexture;
 varying vec2 v_textureCoordinates;
 uniform mat4 camera_projection_matrix;
 uniform mat4 camera_view_matrix;
 uniform float far;
 uniform samplerCube shadowMap_textureCube;
 uniform mat4 shadowMap_matrix;
 uniform vec4 shadowMap_lightPositionEC;
 uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
 uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;

 struct zx_shadowParameters
 {
     vec3 texCoords;
     float depthBias;
     float depth;
     float nDotL;
     vec2 texelStepSize;
     float normalShadingSmooth;
     float darkness;
 };

 float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters)
 {
     float depthBias = shadowParameters.depthBias;
     float depth = shadowParameters.depth;
     float nDotL = shadowParameters.nDotL;
     float normalShadingSmooth = shadowParameters.normalShadingSmooth;
     float darkness = shadowParameters.darkness;
     vec3 uvw = shadowParameters.texCoords;
     depth -= depthBias;
     float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
     return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
 }

 vec4 getPositionEC(){
     return czm_windowToEyeCoordinates(gl_FragCoord);
 }

 vec3 getNormalEC(){
     return vec3(1.);
 }

 vec4 toEye(in vec2 uv,in float depth){
     vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
     vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
     posInCamera=posInCamera/posInCamera.w;
     return posInCamera;
 }

 vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point){
     vec3 v01=point-planeOrigin;
     float d=dot(planeNormal,v01);
     return(point-planeNormal*d);
 }

 float getDepth(in vec4 depth){
     float z_window=czm_unpackDepth(depth);
     z_window=czm_reverseLogDepth(z_window);
     float n_range=czm_depthRange.near;
     float f_range=czm_depthRange.far;
     return(2.*z_window-n_range-f_range)/(f_range-n_range);
 }

 float shadow( in vec4 positionEC ){
     vec3 normalEC=getNormalEC();
     zx_shadowParameters shadowParameters;
     shadowParameters.texelStepSize=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
     shadowParameters.depthBias=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
     shadowParameters.normalShadingSmooth=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
     shadowParameters.darkness=shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
     vec3 directionEC=positionEC.xyz-shadowMap_lightPositionEC.xyz;
     float distance=length(directionEC);
     directionEC=normalize(directionEC);
     float radius=shadowMap_lightPositionEC.w;
     if(distance>radius)
     {
         return 2.0;
     }
     vec3 directionWC=czm_inverseViewRotation*directionEC;
     shadowParameters.depth=distance/radius-0.0003;
     shadowParameters.nDotL=clamp(dot(normalEC,-directionEC),0.,1.);
     shadowParameters.texCoords=directionWC;
     float visibility=czm_shadowVisibility(shadowMap_textureCube,shadowParameters);
     return visibility;
 }

 bool visible(in vec4 result)
 {
     result.x/=result.w;
     result.y/=result.w;
     result.z/=result.w;
     return result.x>=-1.&&result.x<=1.
     &&result.y>=-1.&&result.y<=1.
     &&result.z>=-1.&&result.z<=1.;
 }

 void main(){
     // 得到釉色 = 结构二维(彩色纹理,纹理坐标)
     gl_FragColor=texture2D(colorTexture,v_textureCoordinates);
     // 深度 = (釉色 = 结构二维(深度纹理,纹理坐标))
     float depth=getDepth(texture2D(depthTexture,v_textureCoordinates));
     // 视角 = (纹理坐标,深度)
     vec4 viewPos=toEye(v_textureCoordinates,depth);
     //世界坐标
     vec4 wordPos=czm_inverseView*viewPos;
     // 虚拟相机中坐标
     vec4 vcPos=camera_view_matrix*wordPos;
     float near=.001*far;
     float dis=length(vcPos.xyz);
     if(dis>near&&dis<far){
         //透视投影
         vec4 posInEye=camera_projection_matrix*vcPos;
         // 可视区颜色
         vec4 v_color=vec4(0.,1.,0.,.5);
         vec4 inv_color=vec4(1.,0.,0.,.5);
         if(visible(posInEye)){
             float vis=shadow(viewPos);
             if(vis>0.3){
                 gl_FragColor=mix(gl_FragColor,v_color,.5);
             } else{
                 gl_FragColor=mix(gl_FragColor,inv_color,.5);
             }
         }
     }
 }`;


const postStage = new Cesium.PostProcessStage({
    fragmentShader,
    uniforms: {
        camera_projection_matrix: lightCamera.frustum.projectionMatrix,
        camera_view_matrix: lightCamera.viewMatrix,
        far: () => {
            return 1000;
        },
        shadowMap_textureCube: () => {
            shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
            return Reflect.get(shadowMap, "_shadowMapTexture");
        },
        shadowMap_matrix: () => {
            shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
            return Reflect.get(shadowMap, "_shadowMapMatrix");
        },
        shadowMap_lightPositionEC: () => {
            shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
            return Reflect.get(shadowMap, "_lightPositionEC");
        },
        shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
            shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
            const bias = shadowMap._pointBias;
            return Cesium.Cartesian4.fromElements(
                bias.normalOffsetScale,
                shadowMap._distance,
                shadowMap.maximumDistance,
                0.0,
                new Cesium.Cartesian4()
            );
        },
        shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
            shadowMap.update(Reflect.get(viewer.scene, "_frameState"));
            const bias = shadowMap._pointBias;
            const scratchTexelStepSize = new Cesium.Cartesian2();
            const texelStepSize = scratchTexelStepSize;
            texelStepSize.x = 1.0 / shadowMap._textureSize.x;
            texelStepSize.y = 1.0 / shadowMap._textureSize.y;
            return Cesium.Cartesian4.fromElements(
                texelStepSize.x,
                texelStepSize.y,
                bias.depthBias,
                bias.normalShadingSmooth,
                new Cesium.Cartesian4()
            );
        }
    }
});
viewer.scene.postProcessStages.add(postStage);

