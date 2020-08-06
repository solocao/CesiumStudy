import './css/common.css';
import "./js/materials/ImageLine"
import events from "./js/events";
const viewer = new Cesium.Viewer("app", {
    // animation: false,
    // scene3DOnly: true,
    // timeline: false,//时间线
    // terrainShadows: Cesium.ShadowMode.ENABLED,
    navigationHelpButton: false,
    sceneModePicker: false,
    vrButton: false,
    baseLayerPicker: false,
    infoBox: false,
    // shadows:true,
    fullscreenButton: false,
    geocoder: false,//搜索按钮
    homeButton: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    skyBox: false,
    automaticallyTrackDataSourceClocks: false,
    // globe: false
    // showRenderLoopErrors: false
    // contextOptions: false
    // navigationInstructionsInitiallyVisible: false,
    // imageryProvider: 
});
var shadowMap = viewer.shadowMap;
shadowMap.maximumDistance = 10000.0;
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
    layer: "tdtBasicLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false,
    maximumLevel: 18
}))
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=ebf64362215c081f8317203220f133eb",
    layer: "tdtAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false,

}))
viewer.scene.postProcessStages.fxaa.enabled = true;
const popup = document.createElement('div');
popup.className = "popup";
document.getElementById("app").appendChild(popup);
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
        cartographic.latitude, -cartographic.height
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
