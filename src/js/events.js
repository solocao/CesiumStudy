import pointEntities from ""
export default function (viewer) {
  let scene = viewer.scene;
  let camera = viewer.camera;
  elBindClick("modellocated", () => {
    camera.flyTo({
      destination: {
        x: -2212505.2474972415,
        y: 4837907.76249825,
        z: 3506938.860819313
      },
      orientation: {
        heading: 6.283185307179586,
        pitch: -0.500031662064985,
        roll: 6.283185307179586
      },
      duration: 2
    })
  })
  elBindClick("flyHome", () => {
    camera.flyHome(2)
  })
  elBindClick("getCamera", () => {
    let cartographic = camera.positionCartographic
    console.log("camera", JSON.stringify({
      destination: {
        x: cartographic.longitude,
        y: cartographic.latitude,
        z: cartographic.height
      },
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      }
    }).replace(/"/g, ""));
  })
  elBindClick("addGeojson",() => {
    let datasource = viewer.dataSources.getByName("shenzhen")[0];
    if (!datasource) {
      let ds = new Cesium.GeoJsonDataSource("shenzhen");
      viewer.dataSources.add(ds)
      ds.load(require("../assets/shenzhen.json"), {
        stroke: Cesium.Color.fromCssColorString("#4CAF50"),
        fill: Cesium.Color.fromCssColorString("#fff4"),
        strokeWidth: 3,
        markerSymbol: '?',
        // clampToGround:true
      }).then(source=>{
        viewer.flyTo(source)
      })
    } else {
      if(!datasource.show){
        datasource.show=true;
        viewer.flyTo(datasource);
        return
      }
      datasource.show=false;
    }
  })
  elBindClick("point",()=>{
    let datasource=viewer.dataSources.getByName("points")[0];
    if(!datasource){
      let ds=new Cesium.CustomDataSource("points");
      viewer.dataSources.add(ds);
      let pointEntities=require()
    }
  })
}






function elBindClick(id, cb) {
  document.getElementById(id).addEventListener('click', cb);
}