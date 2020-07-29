import pointEntities from "./points"
import lineEntities from "./lines"
import polygonEntities from "./polygons"
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
  elBindClick("addGeojson", () => {
    let datasource = viewer.dataSources.getByName("ows")[0];
    if (!datasource) {
      let ds = new Cesium.GeoJsonDataSource("ows");
      viewer.dataSources.add(ds)
      ds.load(require("../assets/shenzhen.json"), {
        stroke: Cesium.Color.fromCssColorString("#4CAF50"),
        fill: Cesium.Color.fromCssColorString("#fff4"),
        strokeWidth: 3,
        markerSymbol: '?'
      }).then(source => {
        viewer.flyTo(source)
      })
    } else {
      if (!datasource.show) {
        datasource.show = true;
        viewer.flyTo(datasource);
        return
      }
      datasource.show = false;
    }
  })
  elBindClick("point", () => {
    let datasource = viewer.dataSources.getByName("points")[0];
    if (!datasource) {
      let ds = new Cesium.CustomDataSource("points");
      viewer.dataSources.add(ds);
      pointEntities.forEach(entity => {
        ds.entities.add(entity)
      });
      viewer.flyTo(ds)
    } else {
      datasource.show = !datasource.show
      if (datasource.show) {
        viewer.flyTo(datasource)
      }
    }
  })
  elBindClick("line", () => {
    let datasource = viewer.dataSources.getByName("lines")[0];
    if (!datasource) {
      let ds = new Cesium.CustomDataSource('lines');
      viewer.dataSources.add(ds);
      lineEntities.forEach((entity, index) => {

        let e = ds.entities.add(entity)
        if (index == 0) {
          console.log(e);
        }
      })
      viewer.flyTo(ds)
    } else {
      datasource.show = !datasource.show
      if (datasource.show) {
        viewer.flyTo(datasource)
      }
    }
  })
  elBindClick("polygon", () => {
    let datasource = viewer.dataSources.getByName('polygons')[0];
    if (!datasource) {
      let ds = new Cesium.CustomDataSource('polygons');
      viewer.dataSources.add(ds);
      polygonEntities.forEach(entity => {
        ds.entities.add(entity)
      });
      viewer.flyTo(ds)
    } else {
      datasource.show = !datasource.show
      datasource.show && viewer.flyTo(datasource)
    }
  })
  elBindClick("polygonVol", () => {
    let datasource = viewer.dataSources.getByName('provinces')[0];
    if (!datasource) {
      let ds = new Cesium.GeoJsonDataSource('provinces');
      let promise = ds.load(require('../assets/wfs.json'));
      promise.then(source => {
        viewer.dataSources.add(source)
        let entities = source.entities.values;
        for (let i = 0; i < entities.length; i++) {
          //For each entity, create a random color based on the state name.
          //Some states have multiple entities, so we store the color in a
          //hash so that we use the same color for the entire state.
          var entity = entities[i];
          let color = Cesium.Color.fromRandom({
            alpha: 1.0,
          });
          //Set the polygon material to our random color.
          entity.polygon.material = color;
          //Remove the outlines.
          entity.polygon.outline = false;
          //Extrude the polygon based on the state's population.  Each entity
          //stores the properties for the GeoJSON feature it was created from
          //Since the population is a huge number, we divide by 50.
          let data = Math.random() * 300000;
          entity.polygon.extrudedHeight = data
          var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
          var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
          let cartographic = Cesium.Cartographic.fromCartesian(
            polyCenter
          );
          entity.position = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), entity.polygon.extrudedHeight.getValue() + 50000);
          // entity.label = {
          //   text: data.toFixed(2),
          //   font: "12px",
          //   showBackground:true,
          //   fillColor:Cesium.Color.fromCssColorString("#000"),
          // }
        }

        viewer.flyTo(source)
      })
    } else {
      datasource.show = !datasource.show
      if (datasource.show) {
        viewer.flyTo(datasource)
      }
    }
  })
  elBindClick("Billboard", () => {
    let billboard = viewer.entities.getById('billboard');
    if (!billboard) {
      let entity = viewer.entities.add({
        id: "billboard",
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: require("../assets/地理.png").default,
        }
      })
      viewer.flyTo(entity)
    } else {
      billboard.show = !billboard.show;
      if (billboard.show) {
        viewer.flyTo(billboard)
      }
    }
  })
  let waterPrimitive;
  elBindClick("water", () => {
    if (!waterPrimitive) {
      let waterFace = [
        130.0, 30.0, 0,
        150.0, 30.0, 0,
        150.0, 10.0, 0,
        130.0, 10.0, 0];
      waterPrimitive = new Cesium.Primitive({
        // show: true,// 默认隐藏
        allowPicking: false,
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(waterFace)),
            //extrudedHeight: 0,//注释掉此属性可以只显示水面
            //perPositionHeight : true//注释掉此属性水面就贴地了
          })
        }),
        // 可以设置内置的水面shader
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Water',
              uniforms: {
                // baseWaterColor:new Cesium.Color(45/255, 152/255, 218/255,0.5),
                //blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                //specularMap: 'gray.jpg',
                //normalMap: '../assets/waterNormals.jpg',
                normalMap: require('../assets/waterNormals.jpg').default,
                frequency: 100.0,
                animationSpeed: 0.002,
                amplitude: 10.0
              }
            }
          }),
        })
      });
      viewer.scene.primitives.add(waterPrimitive);
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(140, 20, 6000000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0), //默认朝北0度，顺时针方向，东是90度
          pitch: Cesium.Math.toRadians(-90), //默认朝下看-90,0为水平看，
          roll: Cesium.Math.toRadians(0) //默认0
        }
      });
    } else {
      waterPrimitive.show = !waterPrimitive.show;
      waterPrimitive.show && viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(140, 20, 6000000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0), //默认朝北0度，顺时针方向，东是90度
          pitch: Cesium.Math.toRadians(-90), //默认朝下看-90,0为水平看，
          roll: Cesium.Math.toRadians(0) //默认0
        }
      });
    }


  })
  let videoEntity;
  let videoElement=document.getElementById('video')
  elBindClick("playvideo", () => {
    if (!videoEntity) {
      videoEntity = new Cesium.Entity({
        name: "Rotating rectangle with rotating texture coordinate",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-122.0, 30.0, -106.0, 40.0),
          material:videoElement ,
        },
      });
      viewer.entities.add(videoEntity);
      videoElement.style.display="block"
      viewer.flyTo(videoEntity)
    } else {
      videoEntity.show = !videoEntity.show;
      videoElement.style.display=(videoEntity.show?"block":"none")
      videoEntity.show && viewer.flyTo(videoEntity)

    }
  })
}


function elBindClick(id, cb) {
  document.getElementById(id).addEventListener('click', cb);
}