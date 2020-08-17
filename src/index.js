import './css/common.css';
// import "../public/materials/ImageLine"
import events from "./js/events";
import controller from './js/controller'
controller()
const viewer = new Cesium.Viewer("CesiumContainer", {
    // animation: false,
    // scene3DOnly: true,
    // timeline: false,//时间线
    // terrainShadows: Cesium.ShadowMode.ENABLED,
    // terrainProvider: ,
    navigationHelpButton: false,
    sceneModePicker: false,
    vrButton: false,
    baseLayerPicker: false,
    infoBox: false,
    // shadows: true,
    fullscreenButton: false,
    geocoder: false,//搜索按钮
    homeButton: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    skyBox: false,
    // automaticallyTrackDataSourceClocks: false,
    shouldAnimate: true,
    // globe: false
    // showRenderLoopErrors: false
    // contextOptions: false
    // navigationInstructionsInitiallyVisible: false,
    // imageryProvider: 
});
//移除默认鼠标事件

viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);
var shadowMap = viewer.shadowMap;
shadowMap.maximumDistance = 10000.0;
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
    let position = viewer.camera.pickEllipsoid(
        evt.position,
        scene.globe.ellipsoid
    );
    console.log(position);
    // 转为wgs84坐标系，弧度
    if (position) {
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        console.log(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height);
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
let tile = scene.primitives.add(new Cesium.Cesium3DTileset({
    url: "/3DTiles/tileset.json"
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


let camera1 = new Cesium.Camera(scene);
camera1.direction = new Cesium.Cartesian3(0.3679649465778106,
    -0.8045994346859792,
    0.46607032494355605);
camera1.position = new Cesium.Cartesian3(-2212527.989324894,
    4837953.918071975,
    3506908.080654449)

let sm = new Cesium.ShadowMap({
    context: scene.context,
    lightCamera: camera1,
    enabled: true,
    isPointLight: true,
    pointLightRadius: 100.0,
    cascadesEnabled: false,
    softShadows: true,
    normalOffset: false,
    fromLightSource: false
});
console.log(shadowMap);
console.log(sm);
