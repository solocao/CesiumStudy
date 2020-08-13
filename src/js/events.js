import pointEntities from "./points"
import lineEntities from "./lines"
import polygonEntities from "./polygons"
import * as turf from '@turf/turf'
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
    console.log(camera);
    console.log("camera", JSON.stringify({
      destination: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      },
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      }
    }).replace(/"/g, ""));
    console.log(cartographic);
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
      pointEntities.forEach((entity, index) => {
        let e = ds.entities.add(entity);
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
          // entity.shadows=
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
        114.57764581645323, 33.57116444757951, 20,
        114.57420069500392, 33.57116444757951, 20,
        114.57420069500392, 33.57399014528327, 20,
        114.57764581645323, 33.57399014528327, 20
      ];
      waterPrimitive = new Cesium.Primitive({
        // show: true,// 默认隐藏
        allowPicking: false,
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(waterFace)),
            extrudedHeight: 12,//注释掉此属性可以只显示水面
            // perPositionHeight : true//注释掉此属性水面就贴地了
          })
        }),
        // 可以设置内置的水面shader
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Water',
              uniforms: {
                baseWaterColor: new Cesium.Color(45 / 255 * 1.0, 71 / 255 * 1.0, 140 / 255 * 1.0, 0.7),
                blendColor: new Cesium.Color(0 / 255 * 1.0, 0 / 255 * 1.0, 255 / 255 * 1.0, 1.0),
                //specularMap: 'gray.jpg',
                //normalMap: '../assets/waterNormals.jpg',
                normalMap: require('../assets/waterNormals.jpg').default,
                frequency: 10000.0,
                animationSpeed: 0.05,
                amplitude: 1.0
              }
            }
          }),

        })
      });
      viewer.scene.primitives.add(waterPrimitive);
      viewer.camera.flyTo({ destination: { x: -2212505.247497241, y: 4837907.762498249, z: 3506938.8608193123 }, orientation: { heading: 6.283185307179586, pitch: -0.500031662064985, roll: 6.283185307179586 } });
    } else {
      waterPrimitive.show = !waterPrimitive.show;
      waterPrimitive.show && viewer.camera.flyTo({ destination: { x: -2212505.247497241, y: 4837907.762498249, z: 3506938.8608193123 }, orientation: { heading: 6.283185307179586, pitch: -0.500031662064985, roll: 6.283185307179586 } });
    }


  })
  let videoEntity;
  let videoElement = document.getElementById('video')
  elBindClick("playvideo", () => {
    if (!videoEntity) {
      videoEntity = new Cesium.Entity({
        name: "Rotating rectangle with rotating texture coordinate",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(-122.0, 30.0, -106.0, 40.0),
          material: videoElement,
        },
      });
      viewer.entities.add(videoEntity);
      videoElement.style.display = "block"
      viewer.flyTo(videoEntity)
    } else {
      videoEntity.show = !videoEntity.show;
      videoElement.style.display = (videoEntity.show ? "block" : "none")
      videoEntity.show && viewer.flyTo(videoEntity)

    }
  })
  let handler;
  let drawDataSource = new Cesium.CustomDataSource();
  viewer.dataSources.add(drawDataSource)
  elBindClick("draw", () => {
    var drawingMode = "line"

    if (!viewer.scene.pickPositionSupported) {
      alert("This browser does not support pickPosition.");
    }
    if (!handler) {
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      let promt = prompt("请输入type（0:线；1:面）:")
      drawingMode = (promt == 0 ? "line" : "polygon");
      var activeShapePoints = [];
      var activeShape;
      var floatingPoint;
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function (event) {
        // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
        // we get the correct point when mousing over terrain.
        var earthPosition = viewer.camera.pickEllipsoid(
          event.position,
          scene.globe.ellipsoid
        );
        // `earthPosition` will be undefined if our mouse is not over the globe.
        if (Cesium.defined(earthPosition)) {
          if (activeShapePoints.length === 0) {
            floatingPoint = createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            var dynamicPositions = new Cesium.CallbackProperty(function () {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }, false);
            activeShape = drawShape(dynamicPositions);
          }
          activeShapePoints.push(earthPosition);
          createPoint(earthPosition);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(function (event) {
        if (Cesium.defined(floatingPoint)) {
          var newPosition = viewer.camera.pickEllipsoid(
            event.endPosition,
            scene.globe.ellipsoid
          );
          if (Cesium.defined(newPosition)) {
            floatingPoint.position.setValue(newPosition);
            activeShapePoints.pop();
            activeShapePoints.push(newPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // Redraw the shape so it's not dynamic and remove the dynamic shape.
      function terminateShape() {
        activeShapePoints.pop();
        drawShape(activeShapePoints);
        drawDataSource.entities.remove(floatingPoint);
        drawDataSource.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
      }
      handler.setInputAction(function (event) {
        terminateShape();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    } else {
      handler.destroy();
      drawDataSource.entities.removeAll()
      handler = null;
    }
    function drawShape(positionData) {
      var shape;
      if (drawingMode === "line") {
        shape = drawDataSource.entities.add({
          polyline: {
            positions: positionData,
            clampToGround: false,
            width: 3,
          },
        });
      } else if (drawingMode === "polygon") {
        shape = drawDataSource.entities.add({
          polygon: {
            hierarchy: positionData,
            material: Cesium.Color.WHITE.withAlpha(0.7),
            height: 0,
            outline: true,
            outlineWidth: 2,
            outlineColor: Cesium.Color.YELLOW,
            arcType: Cesium.ArcType.RHUMB,
          },
        });
      }
      return shape;
    }
    function createPoint(worldPosition) {
      var point = drawDataSource.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      });
      return point;
    }
  })
  elBindClick("model", () => {
    let entity = viewer.entities.getById('plane');
    if (!entity) {
      let e = viewer.entities.add({
        id: 'plane',
        position: Cesium.Cartesian3.fromDegrees(114.6200877719163, 33.442230242824415, 5000),
        model: {
          uri: "/Cesium_Air.glb",
          minimumPixelSize: 128,
          maximumScale: 20000
        }
      });
      viewer.trackedEntity = e;
      setInterval(() => {
        let coords = Cesium.Cartographic.fromCartesian(e.position.getValue());
        e.position = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(coords.longitude) + 0.05, Cesium.Math.toDegrees(coords.latitude), 5000)
      }, 10)
    } else {
      entity.show = !entity.show;
      (!entity.show) && (viewer.trackedEntity = undefined)
      entity.show && (viewer.trackedEntity = entity);
    }
  })
  let radar;
  elBindClick("radar", () => {
    if (!radar || radar.isDestroyed()) {
      radar = undefined
      let length = prompt('请输入半径');
      let height = prompt('请输入高度');
      let positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9);
      // 1.3 中心位置
      let centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length * 0.5);
      // 1.4 顶部位置(卫星位置)
      let topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length);
      // 1.5 矩阵计算
      let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
        new Cesium.Cartesian3(0.0, 0.0, height * 0.5), new Cesium.Matrix4()
      );
      // 2 相机飞入特定位置
      viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(centerOnEllipsoid, length));
      // 3 创建卫星
      // let imageUri = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjgzLjIzIiBoZWlnaHQ9IjIwNi42NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiA8ZGVmcz4KICA8bGluZWFyR3JhZGllbnQgaWQ9ImIiPgogICA8c3RvcCBvZmZzZXQ9IjAiLz4KICAgPHN0b3Agc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iaCIgeDE9IjQ2NjEiIHgyPSI0MzcxLjkiIHkxPSIyMTYxLjIiIHkyPSIyMzk1LjYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iIzQ1NDU4NSIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNiYWJhZmQiIG9mZnNldD0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJpIiB4MT0iNDY2OS45IiB4Mj0iNDU0My42IiB5MT0iMjI5Ny4xIiB5Mj0iMjU1Ni4xIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiMzYTNhNjMiIG9mZnNldD0iMCIvPgogICA8c3RvcCBzdG9wLWNvbG9yPSIjYmFiYWZkIiBvZmZzZXQ9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iayIgeDE9IjU0MDguMiIgeDI9IjU0ODIuNiIgeTE9IjM1ODkuNSIgeTI9IjM5NjAuNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMDU0OTA3IC45MzYwMiAuOTM2OTEgLjA3MjA4MyAxNzcuNDMgLTI3MTkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNkOWQ5ZDkiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNmZmYiIG9mZnNldD0iLjYyOTYzIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNlOWU5ZTkiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8bGluZWFyR3JhZGllbnQgaWQ9ImwiIHgxPSI1MzE5LjMiIHgyPSI1MzcxLjIiIHkxPSIzNTA4LjEiIHkyPSIzNTY5LjgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjE1Mzg2IC45NDkxOCAxLjAyNDMgLjI3MjUzIC02NzIuMzcgLTM1MjUuMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNmZmYiIG9mZnNldD0iLjUiLz4KICAgPHN0b3Agc3RvcC1jb2xvcj0iIzBkMDAwMCIgb2Zmc2V0PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiPgogICA8c3RvcCBvZmZzZXQ9IjAiLz4KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2ExYTFhMSIgb2Zmc2V0PSIuNSIvPgogICA8c3RvcCBvZmZzZXQ9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0iZiIgeDE9IjQ2NTguOSIgeDI9IjQ0OTcuOCIgeTE9IjIyODguNSIgeTI9IjI2MzMuNyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICA8c3RvcCBzdG9wLWNvbG9yPSIjNDU0NTg1IiBvZmZzZXQ9IjAiLz4KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSI1MDY0LjEiIHgyPSI0NzU5LjYiIHkxPSIyMzE4LjkiIHkyPSIyNjA1LjkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iIzUxNTE5YyIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNmM2YzZjkiIG9mZnNldD0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJqIiB4MT0iNDY3My4yIiB4Mj0iNDc4Ni40IiB5MT0iMTYyNy4xIiB5Mj0iMTg2NS42IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgIDxzdG9wIG9mZnNldD0iMCIvPgogICA8c3RvcCBzdG9wLWNvbG9yPSIjZmZmYmZiIiBvZmZzZXQ9Ii4yNDA3NCIvPgogICA8c3RvcCBvZmZzZXQ9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDI9IjAiIHkxPSI1MjUxLjciIHkyPSI0NTYwLjkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjcwNjMyIC43MDc4OSAuNzA3ODkgLS43MDYzMiAtMjQ3Mi41IDMwOTIuMykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4bGluazpocmVmPSIjYiIvPgogIDxsaW5lYXJHcmFkaWVudCBpZD0ibiIgeDE9IjQxNTcuNSIgeDI9IjQwNzkuNiIgeTE9IjE3ODYuOCIgeTI9IjIxNDQuNCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguOTM5NjIgLjY3ODk3IC0uNjc4OTcgLjkzOTYyIDIyODQuNyAtMjk3NS4yKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHhsaW5rOmhyZWY9IiNiIi8+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJvIiB4MT0iNDg1MS43IiB4Mj0iNDg4Ni4yIiB5MT0iMTgzMS4zIiB5Mj0iMTgwMC44IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC4wNzc0NjcgMS4xNTA2IC0xLjE2NjEgLS4yNzA1OCA2MjQyLjIgLTMyMzIuNCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4bGluazpocmVmPSIjYSIvPgogIDxsaW5lYXJHcmFkaWVudCBpZD0icCIgeDE9IjQ4NDUuNSIgeDI9IjQ4NzUuNCIgeTE9IjE4MjkuNSIgeTI9IjE4MDAuMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtLjAwNDg0NTUgLS42MTExOCAtLjcwMjQ0IC4wMDU1NjkxIDU5MjQuNSA0NjE5LjkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeGxpbms6aHJlZj0iI2EiLz4KICA8bGluZWFyR3JhZGllbnQgaWQ9InEiIHgxPSI0ODQ1LjUiIHgyPSI0ODc1LjQiIHkxPSIxODI5LjUiIHkyPSIxODAwLjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjg0MjIxIC0uMDU4NTA0IC4wNjcyMzkgLjk2Nzk3IDYwMy42NCAzNjkuNTkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeGxpbms6aHJlZj0iI2EiLz4KICA8cmFkaWFsR3JhZGllbnQgaWQ9ImMiIGN4PSI1MTAxLjQiIGN5PSIzNzIwIiByPSIzNTMuODIiIGZ4PSI1MDY4LjIiIGZ5PSIzNjUwLjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjI2MjYxIDIuMTE0IDEuNTkzNCAuMDgwODQ2IC0zMzMyLjUgLTg3NjEuNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iIzA1MDEwMSIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiNmZmYiIG9mZnNldD0iMSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPHJhZGlhbEdyYWRpZW50IGlkPSJkIiBjeD0iNTA2My4xIiBjeT0iMzc0Ny41IiByPSIzMjkuMzYiIGZ4PSI1MTMyLjciIGZ5PSIzNjU0LjkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLS4wNzM5MDMgLS42NzM2NSAtLjU5NTI5IC4wMTE4NTMgNjUxMi41IDU3NDkuOSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2M2YzZjNiIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiMxYTFhMWEiIG9mZnNldD0iMSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iMzk3Ny42IiBjeT0iMjQxNS40IiByPSIxMTkuMTUiIGZ4PSIzOTY0LjQiIGZ5PSIyNDYxLjciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTEuMjczMSAuNDA1ODcgLS4zNzA3MSAtMS4xNjI4IDEwNTU4IDMwMDAuNCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgPHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIwIi8+CiAgIDxzdG9wIHN0b3AtY29sb3I9IiMwNDAwMDAiIG9mZnNldD0iMSIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiA8L2RlZnM+CiA8ZyB0cmFuc2Zvcm09Im1hdHJpeCg3LjYwNzQgLS4yNTYwNCAuMjU2MDQgNy42MDc0IC0zMzM2MSAtNjY4NC44KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCguODgzMzMgLjExMDYxIC0uMTY4MzUgLjg3OTQ5IDgyNy4xNCAtMTAxNSkiPgogICA8cGF0aCBkPSJtNDYxMS4yIDI1MDkuOCAyNzYuNTktMTYzLjM0LTQwMi45Mi0yMjAuOTMtMjYzLjA5IDExMS45NyAzODkuNDIgMjcyLjI5eiIgZmlsbD0iIzVlODg5ZCIvPgogICA8cGF0aCBkPSJtNDY0Ny41IDIyMzMuOS0xNjAuNDQtODkuNDM0LTkxLjM4MSA0MS4xMjggMTU1LjQ1IDEwMS4zNSA5Ni4zNy01My4wNDV6bS0zODEuNjMgOS4wMjYgMTYwLjc1IDExMi44NiAxMDYuNDctNTguODI2LTE1Ny4yNC0xMDIuNjYtMTA5Ljk3IDQ4LjYzMXptMjg0LjQgNjUuMTUzLTEwNS4xMiA1OS40MDEgMTY3LjEgMTE2LjA2IDExMC45My02My4yNTQtMTcyLjkxLTExMi4yMXptMTg5LjU5IDEwMS41OSAxMDkuNDktNjMuMjg5LTE4NC4zNS0xMDIuODYtOTYuODY5IDUzLjg1NCAxNzEuNzMgMTEyLjI5eiIgZmlsbD0idXJsKCNoKSIgZmlsbC1ydWxlPSJub256ZXJvIi8+CiAgPC9nPgogIDxnIHRyYW5zZm9ybT0ibWF0cml4KC41NzcyNSAuMjYwNDcgLS41NjE4NSAuODY4MDUgMjkyNC4zIC0xOTY3LjQpIj4KICAgPHBhdGggZD0ibTQ2MTEuMiAyNTA5LjggMjc2LjU5LTE2My4zNC0zNzUuMTktMjE5LjY2Yy05LjQwNjYtNC4zODI5LTE1Ljk4Ni01Ljc0LTI4Ljk1LTMuMTUyOGwtMjQ2LjM4IDEwNy4xMmMtNi4zMjY5IDQuMjM1OC02LjI4MiA5LjcyOTItMi4yMjM4IDE2LjAxNWwzNzYuMTUgMjYzLjAxeiIgZmlsbD0iIzNjNjg3ZSIvPgogICA8cGF0aCBkPSJtNDY1MS4zIDIyMzEuOC0xNTMuMzgtOTIuNjc5LTEwMi4xOSA0Ni41NDYgMTU1LjQ1IDEwMS4zNSAxMDAuMTItNTUuMjJ6bS0zODUuMzkgMTEuMjAxIDE2MC43NSAxMTIuODYgMTA2LjQ3LTU4LjgyNi0xNTcuMjQtMTAyLjY2LTEwOS45NyA0OC42MzF6bTI4NC40IDY1LjE1My0xMDUuMTIgNTkuNDAxIDE2Ny4xIDExNi4wNiAxMTAuOTMtNjMuMjU0LTE3Mi45MS0xMTIuMjF6bTE4OS41OSAxMDEuNTkgMTA5LjQ5LTYzLjI4OS0xODAuNi0xMDUuMDQtMTAwLjYyIDU2LjAyOSAxNzEuNzMgMTEyLjI5eiIgZmlsbD0idXJsKCNpKSIgZmlsbC1ydWxlPSJub256ZXJvIi8+CiAgPC9nPgogIDxwYXRoIGQ9Im00NjA0LjggMTY0Ny44Yy0xNi42MjYtMTUuNzU1LTEuMDcyLTI4LjE5IDEzLjc4Ny0xMy40OGwyOC4xNjQgMjAuOTZjMTcuOTM5IDEwLjgwMi01Ljg0OTUgMjguODE0LTE3LjkwNCAyMy4zMTlsLTI2LjQ3OS0yOS4wMzQgMi40MzIxLTEuNzY1eiIgZmlsbD0idXJsKCNwKSIgZmlsbC1ydWxlPSJub256ZXJvIi8+CiAgPHBhdGggZD0ibTQ2NDAuNSAxOTYwLjVjNTguMjkxLTM0LjY4MiA1MC40MTktMTYwLjkxLTUuODEyMi0yMTMuNzktNDMuOTg2LTQxLjcyLTEwMi4xOC01My4zNy0xNDIuODItMzAuNzA3bDMzNy4xOC0xNDkuM2M0NC42NTQtMjMuNTQyIDExNy42Mi0zMS4yNTIgMTY2LjgxIDIxLjE2NCAzMi4wNTYgMzQuMTU4IDQ3LjM2OCAxMjYuMTYtMTkuNjI5IDE3MC4xNGwtMzM1Ljc0IDIwMi41eiIgZmlsbD0idXJsKCNqKSIvPgogIDxwYXRoIGQ9Im00NDgzLjMgMTcyMi44YzQ0LjQtMzQuODE4IDEwMS43My0yNS4zMjkgMTUwLjI5IDIwLjczIDYwLjU3IDU4LjU3MyA3NS4xMzQgMTg4LjEzLTYuNDUyOCAyMjUuMDUtMTIwLjYxIDU0LjU3Mi0yNDYuNzEtMTY1LjExLTE0My44My0yNDUuNzh6IiBmaWxsPSJ1cmwoI2UpIi8+CiAgPHBhdGggZD0ibTQ2NDAuNSAxOTYwLjVjNTguMjkxLTM0LjY4MiA1MC40MTktMTYwLjkxLTUuODEyMi0yMTMuNzktNDMuOTg2LTQxLjcyLTEwMi4xOC01My4zNy0xNDIuODItMzAuNzA3bDMzNy4xOC0xNDkuM2M0NC42NTQtMjMuNTQyIDExNy42Mi0zMS4yNTIgMTY2LjgxIDIxLjE2NCAzMi4wNTYgMzQuMTU4IDQ3LjM2OCAxMjYuMTYtMTkuNjI5IDE3MC4xNGwtMzM1Ljc0IDIwMi41eiIgZmlsbD0idXJsKCNuKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZD0ibTQ0MzYuMyAxODg0LjhjMjEuMTg0IDkuNjYzNCAyNS42MzMgMjUuNDI3IDM1LjE1NiA1Mi4yMDZsODMuODE3LTQ1LjQyOGMyNS43OTktMjMuNTI4LTYuMDY5Mi03MS4wMDMtMzMuNDY4LTYzLjQ3MmwtODUuNTA2IDU2LjY5NHoiIGZpbGw9InVybCgjbykiIGZpbGwtcnVsZT0ibm9uemVybyIvPgogIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMDE5NCAtLjAzODE3OSAtLjAwOTgyNDIgMS4zOTQzIDQwOC45NyAtMTAxMC41KSI+CiAgIDxwYXRoIGQ9Im00NjExLjIgMjUwOS44IDI3Ni41OS0xNjMuMzQtNDAyLjkyLTIyMC45My0yNjMuMDkgMTExLjk3IDM4OS40MiAyNzIuMjl6IiBmaWxsPSIjNWU4ODlkIi8+CiAgIDxwYXRoIGQ9Im00NjU0LjMgMjIzOC4zLTE2Ny4yNS05My43ODktOTEuMzgxIDQxLjEyOCAxNTguODUgMTAzLjEyIDk5Ljc3Ny01MC40NTR6bS0zODguNDQgNC42NzE2IDE2MC43NSAxMTIuODYgMTA4Ljc0LTU1LjQ0MS0xNTkuNTItMTA2LjA1LTEwOS45NyA0OC42MzF6bTI4Ny44MSA2Ni45MTYtMTA4LjUzIDU3LjYzOCAxNjcuMSAxMTYuMDYgMTEwLjkzLTYzLjI1NC0xNjkuNS0xMTAuNDR6bTE4Ni4xOSA5OS44MjggMTA5LjQ5LTYzLjI4OS0xNzQuMTQtOTcuNTcyLTEwMi41NCA1Mi44NSAxNjcuMTggMTA4LjAxeiIgZmlsbD0idXJsKCNmKSIgZmlsbC1ydWxlPSJub256ZXJvIi8+CiAgPC9nPgogIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMTI5MiAuMDQwOTI1IC4xNjA3MiAxLjU0MTcgLTUyMy45NCAtMTc0NC40KSI+CiAgIDxwYXRoIGQ9Im01MDIyLjIgMjYxMC45IDI2MS41LTE4NC40MWM0LjQxOTQtNi4xNTYzLTIuMjgzNS0xMC43MTgtOS4wNjYyLTE0LjEzOWwtMzc5LjU0LTYxLjkwOS0yNzYuMTUgMTY0LjM1IDM4MS4zOCA5OS40NzJjOC4wNzY1IDEuMzAyNSAxNS4zMSAwLjAwODUgMjEuODY5LTMuMzYyMnoiIGZpbGw9IiM2Zjk1YTkiLz4KICAgPHBhdGggZD0ibTUwNTMuMiAyMzkyLjQtMTU2Ljg2LTI3LjY5Ni05Ni4wMjcgNTguODQ4IDE1NC43MiAzNS4xMjggOTguMTYxLTY2LjI4MXptLTM4OS4yNCAxMTMuODkgMTU5LjYgNDIuNjc5IDExMi40My03Ny4xNzUtMTU2LjUtMzUuNjQzLTExNS41MiA3MC4xNHptMjg5LjEzLTMwLjY3OC0xMTEuMDggNzcuMjQxIDE2NS45NiA0My4zNzQgMTE3LjI0LTgxLjk1OC0xNzIuMTMtMzguNjU3em0xODkuODIgMjUuNDU4IDEwOC41OC03NS41OTUtMTc5LjU3LTI5LjY4MS05OS45MTQgNjYuMjEgMTcwLjkxIDM5LjA2NnoiIGZpbGw9InVybCgjZykiIGZpbGwtcnVsZT0ibm9uemVybyIvPgogIDwvZz4KICA8cGF0aCBkPSJtNDgzNS4zIDE4NjcuOGMyMy40NzEgMjEuMjE3IDQxLjExIDAuNzAyNSAxOS4yNjctMTguMTkzbC0zMS44NjgtMzYuNTUxYy0xNi43OS0yMy41NTQtNDEuMjY0IDEwLjc2MS0zMi40MTEgMjYuNzc2bDM1LjM0MyAyNi4xOSAzLjgyODctMS44NTI0IDUuODQxMiAzLjYyOTN6IiBmaWxsPSJ1cmwoI3EpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCguOTk2MzMgLS4wODU1NzIgLjA4NTU3MiAuOTk2MzMgMjYzLjYxIC0zMC40MDQpIj4KICAgPHBhdGggZD0ibTQxNTEuMyAyODAzLjNjOTQuODU3LTI3LjM0MyAyNi4wNTYtMjEzLjc2LTE0OC4yOC00MDMuNjQtMTc1LjE4LTE4OS41OS0zOTcuOTMtMzI4LjA2LTQ4NS41OC0yODUuODMtNzkuNTg0IDM4LjMzOS0yNS4zNzcgMjEyLjM3IDE0OC43MiA0MDIuNDYgMTI5Ljc4IDEzOS40MiAzNjAuMTggMzIzLjA0IDQ4NS4xNCAyODcuMDJ6IiBmaWxsPSJ1cmwoI2MpIi8+CiAgIDxwYXRoIGQ9Im00MTU0LjcgMjc5NmM5NC44NTctMjcuMzQzIDI2Ljg4Ny0xODIuMzItMTMwLjg3LTM4My44OC0xNzUuNDQtMjI0LjE1LTM5Mi42MiA5NC4wNDQtMjU2LjkzIDE5Ni45MSAxMTMuMzQgODUuOTI0IDI2Mi44NCAyMjIuOTkgMzg3LjggMTg2Ljk3eiIgZmlsbD0idXJsKCNrKSIgb3BhY2l0eT0iLjUiLz4KICAgPHBhdGggZD0ibTM5NTAuNiAyMzcxLjRjNC4zOTAxLTUuNDIxMy0yNi45MjEtMzcuNzY4LTM0LjIxNS0zMi40NDRsLTI5OS4xOCAzMjEuMjRjLTExLjY4OSAxMy4wODQgMC43MzA4IDI0LjAzMiAxMi40OTYgMTEuMjc5bDMyMC45LTMwMC4wOHoiIGZpbGw9InVybCgjbCkiLz4KICAgPHBhdGggZD0ibTM1MTcuMyAyMTE0YzEyNC45Ni02Ny4zMiAzMzQuMjcgNC4xNDEgNDY5LjQxIDEyMy4xNiAxNDAuMDUgMTIzLjM0IDI0OS4zNSAzNTMuMyAyMDIuNyA1MjkuNyAyMy4xMzgtNjkuNzExLTQ4LjAyNC0yMTYuNDYtMTg2LjM3LTM2Ny4xNC0xNzUuMTgtMTg5LjU5LTM5Ni4xNy0zMjQuNTEtNDg1LjczLTI4NS43MnoiIGZpbGw9InVybCgjZCkiLz4KICAgPHBhdGggZD0ibTM5NTAuNiAyMzcxLjRjNC4zOTAxLTUuNDIxMy0yNi45MjEtMzcuNzY4LTM0LjIxNS0zMi40NDRsLTI5OS4xOCAzMjEuMjRjLTExLjY4OSAxMy4wODQgMC43MzA4IDI0LjAzMiAxMi40OTYgMTEuMjc5bDMyMC45LTMwMC4wOHoiIGZpbGw9InVybCgjbSkiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPgo='
      // let billboards = scene.primitives.add(new Cesium.BillboardCollection());
      // billboard=billboards.add({
      //   // image : './Tutorials/satellite1.svg',
      //   image: imageUri,
      //   position: topOnEllipsoid,
      //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //   pixelOffset: new Cesium.Cartesian2(-10, 10),
      //   scale: 0.3,
      // });
      // 4 创建雷达放射波
      // 4.1 先创建Geometry
      let cylinderGeometry = new Cesium.CylinderGeometry({
        length: height,
        topRadius: 0.0,
        bottomRadius: length * 0.5,
        // vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
      });
      // 4.2 创建GeometryInstance
      let redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry,
        modelMatrix: modelMatrix,
        // attributes : {
        //     color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
        // }
      });
      // 4.3 创建Primitive
      radar = scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [redCone],
        // appearance : new Cesium.PerInstanceColorAppearance({
        //     closed : true,
        //     translucent: false
        // })
        appearance: new Cesium.MaterialAppearance({
          // 贴图像纹理
          // material: Cesium.Material.fromType('Image', {
          //     image: './images/earth.png'
          // }),
          // 贴棋盘纹理
          // material: Cesium.Material.fromType('Checkerboard'),
          // 自定义纹理
          material: new Cesium.Material({
            fabric: {
              type: 'VtxfShader1',
              uniforms: {
                color: new Cesium.Color(0.2, 1.0, 0.0, 1.0),
                repeat: 30.0,
                offset: 0.0,
                thickness: 0.3,
              },
              source: `
                                uniform vec4 color;
                                uniform float repeat;
                                uniform float offset;
                                uniform float thickness;
                                czm_material czm_getMaterial(czm_materialInput materialInput)
                                {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    float sp = 1.0/repeat;
                                    vec2 st = materialInput.st;
                                    float dis = distance(st, vec2(0.5));
                                    float m = mod(dis + offset, sp);
                                    float a = step(sp*(1.0-thickness), m);
                                    material.diffuse = color.rgb;
                                    material.alpha = a * color.a;
                                    return material;
                                }
                            `
            },
            translucent: false
          }),
          faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
          closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
        }),
      }));
      // 5 动态修改雷达材质中的offset变量，从而实现动态效果。
      viewer.scene.preUpdate.addEventListener(function () {
        let offset = radar.appearance.material.uniforms.offset;
        offset -= 0.001;
        if (offset > 1.0) {
          offset = 0.0;
        }
        radar.appearance.material.uniforms.offset = offset;
      });
    } else {
      scene.primitives.remove(radar);
      radar.destroy();
    }
  })
  let wmslayer;
  elBindClick('wms', () => {
    if (!wmslayer) {
      wmslayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapServiceImageryProvider({
          url:
            "/geoserver/cite/wms",
          layers: "cite:shebei_polygon_polygon1",
          parameters: {
            transparent: true,
            format: "image/png",
          },
        })
      );
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      const popup = document.createElement('div');
      popup.className = "popup";
      document.getElementById("CesiumContainer").appendChild(popup);
      popup.style.position = "absolute";
      popup.style.display = "none";
      handler.setInputAction((evt) => {
        let position = viewer.camera.pickEllipsoid(
          evt.position,
          scene.globe.ellipsoid
        );
        let pickRay = viewer.camera.getPickRay(evt.position);
        let featuresPromise = viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene);
        if (!Cesium.defined(featuresPromise)) {
          popup.style.display = "none"
          console.log('No features picked.');
        } else {
          Cesium.when(featuresPromise, function (features) {
            // This function is called asynchronously when the list if picked features is available.
            console.log('Number of features: ' + features.length);
            if (features.length > 0) {
              console.log('First feature name: ', features[0]);
              if (!popup.position) {
                Object.defineProperty(popup, "position", {
                  value: position,
                  writable: true
                })
              } else {
                popup.position = position;
              }
              popup.innerHTML = `<h1>${features[0].name}</h1>`;
              popup.style.left = evt.position.x + 'px';
              popup.style.top = evt.position.y + 'px';
              popup.style.display = "block";
            } else {
              popup.style.display = 'none'
            }
          });
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
      // Start off looking at Australia.
      viewer.camera.flyTo({
        destination:
        {
          x: -2272634.046189484,
          y: 5001513.668794747,
          z: 3233797.0636541545
        },
        orientation: {
          heading: 0.1342750068328442,
          pitch: -1.5324484265208729,
          roll: 0
        }
      })
    } else {
      wmslayer.show = !wmslayer.show;
      wmslayer.show && viewer.camera.flyTo({
        destination:
        {
          x: -2272634.046189484,
          y: 5001513.668794747,
          z: 3233797.0636541545
        },
        orientation: {
          heading: 0.1342750068328442,
          pitch: -1.5324484265208729,
          roll: 0
        }
      })
    }
  })
  let myBox;
  let matrix = 'translate';
  elBindClick('pandm', () => {
    if (!myBox) {
      let boxLength = 20.0;
      let position = Cesium.Cartesian3.fromDegrees(116.39, 39.9, 0.5 * boxLength);
      let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      let scale = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(2.0, 1, 1));
      //缩放
      Cesium.Matrix4.multiply(modelMatrix, scale, modelMatrix);
      // 0 立方体顶点位置标号，以及坐标系示意图
      // 立方体
      //    v6----- v5
      //   /|      /|
      //  v1------v0|
      //  | |     | |
      //  | |v7---|-|v4
      //  |/      |/
      //  v2------v3
      // 坐标系
      //  z
      //  | /y
      //  |/
      //  o------x
      // 1 定义位置数组
      let v0 = [0.5, -0.0, 0.5];
      let v1 = [-1.0, -0.0, 0.5];
      let v2 = [-1.0, -0.0, -0.5];
      let v3 = [0.5, -0.0, -0.5];
      let v4 = [0.5, 0.5, -0.5];
      let v5 = [0.5, 0.5, 0.5];
      let v6 = [-1.0, 0.5, 0.5];
      let v7 = [-1.0, 0.5, -0.5];
      let rawVertex = [
        // 下 -z
        ...v2, ...v3, ...v4, ...v7,
        // 前 -y
        ...v2, ...v3, ...v0, ...v1,
        // 后 +y
        ...v4, ...v7, ...v6, ...v5,
        // 左 -x
        ...v7, ...v2, ...v1, ...v6,
        // 右 +x
        ...v3, ...v4, ...v5, ...v0,
        // 上 +z
        ...v1, ...v0, ...v5, ...v6,
      ];
      // 乘上box的长度
      let boxVertex = rawVertex.map(function (v) {
        return v * boxLength;
      });
      let positions = new Float64Array(boxVertex);
      // 2 定义法向数组
      let npx = [1, 0, 0];
      let nnx = [-1, 0, 0];
      let npy = [0, 1, 0];
      let nny = [0, -1, 0];
      let npz = [0, 0, 1];
      let nnz = [0, 0, -1];
      let normals = new Float32Array([
        // 下 -z
        ...nnz, ...nnz, ...nnz, ...nnz,
        // 前 -y
        ...nny, ...nny, ...nny, ...nny,
        // 后 +y
        ...npy, ...npy, ...npy, ...npy,
        // 左 -x
        ...nnx, ...nnx, ...nnx, ...nnx,
        // 右 +x
        ...npx, ...npx, ...npx, ...npx,
        // 上 +z
        ...npz, ...npz, ...npz, ...npz,
      ]);
      // 3 定义纹理数组
      let sts = new Float32Array([
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
      ]);
      // 4 定义索引
      let indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
      ]);
      // 5 创建Primitive
      myBox = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.Geometry({
            attributes: {
              position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions
              }),
              normal: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: normals
              }),
              st: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: sts
              }),
            },
            indices: indices,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
          }),
          // attributes : {
          //     color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 1.0))
          // }
        }),
        // appearance: new Cesium.PerInstanceColorAppearance({
        //     flat : true,
        //     translucent : false
        // }),
        appearance: new Cesium.MaterialAppearance({
          material: Cesium.Material.fromType('Image', {
            image: require('../assets/墙面.png').default
          }),
          //faceForward : true // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
          closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
        }),
        modelMatrix: modelMatrix,
        asynchronous: false
      }));
      viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 30));
      document.onkeydown = (e) => {
        console.log(e.keyCode);
        if (matrix == "translate") {
          switch (e.keyCode) {
            case 37:
              let translate = new Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-1, 0, 0));
              Cesium.Matrix4.multiply(myBox.modelMatrix, translate, myBox.modelMatrix)
              break;
            case 38:
              let translate1 = new Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 1, 0));
              Cesium.Matrix4.multiply(myBox.modelMatrix, translate1, myBox.modelMatrix)
              break;
            case 39:
              let translate2 = new Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(1, 0, 0));
              Cesium.Matrix4.multiply(myBox.modelMatrix, translate2, myBox.modelMatrix)
              break;
            case 40:
              let translate3 = new Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, -1, 0));
              Cesium.Matrix4.multiply(myBox.modelMatrix, translate3, myBox.modelMatrix)
              break;
          }
        } else if (matrix == "scale") {
          switch (e.keyCode) {
            case 187:
              let scale = new Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1.05, 1.05, 1.05))
              Cesium.Matrix4.multiply(myBox.modelMatrix, scale, myBox.modelMatrix)
              break;
            case 189:
              let scale1 = new Cesium.Matrix4.fromScale(new Cesium.Cartesian3(0.95, 0.95, 0.95))
              Cesium.Matrix4.multiply(myBox.modelMatrix, scale1, myBox.modelMatrix)
              break;
          }
        } else if (matrix == "rotate") {
          switch (e.keyCode) {
            case 187:
              let mat3RoateX = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45))
              let rotate = Cesium.Matrix4.fromRotationTranslation(mat3RoateX)
              Cesium.Matrix4.multiply(myBox.modelMatrix, rotate, myBox.modelMatrix)
              break;
            case 189:
              let mat3RoateX1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-45))
              let rotate1 = Cesium.Matrix4.fromRotationTranslation(mat3RoateX1)
              Cesium.Matrix4.multiply(myBox.modelMatrix, rotate1, myBox.modelMatrix)
              break;
          }
        }
      }
    } else {
      myBox.show = !myBox.show;
      myBox.show && viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(116.39, 39.9, 0.5 * 20), 30))
    }
  })
  elBindClick("translate", () => {
    matrix = "translate"
  })
  elBindClick("rotate", () => {
    matrix = "rotate"
  })
  elBindClick('scale', () => {
    matrix = "scale"
  })
  elBindClick('odline', () => {
    let datasource = viewer.dataSources.getByName('odlines')[0];
    if (!datasource) {
      let ds = new Cesium.GeoJsonDataSource('odlines');
      viewer.dataSources.add(ds)
      ds.load(require("../js/车行路.json")).then(source => {
        source.entities.values.forEach(en => {
          en.polyline.material = new Cesium.ODLineMaterialProperty(
            Cesium.Color.fromCssColorString(`rgb(0, 156, ${Math.random() * 255},1.0)`),
            100
          )
          en.polyline.width = 5
        })
        viewer.flyTo(source)
      })
    } else {
      datasource.show = !datasource.show;
      datasource.show && viewer.flyTo(datasource)
    }
  })
  let rectang;
  elBindClick('heatmap', () => {
    viewer.scene.globe.depthTestAgainstTerrain = false; //开启深度检测

    if (!rectang) {
      //heatmap
      let canvasContainer = document.createElement("div");
      canvasContainer.style.width = 968 + "px";
      canvasContainer.style.height = 968 + "px";
      var heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: canvasContainer,
        width: 968,
        height: 968
      });

      // now generate some random data
      var points = [];
      var max = 100;
      var width = 968;
      var height = 968;
      var len = 1000;
      while (len--) {
        var val = Math.floor(Math.random() * 80);
        // now also with custom radius
        var radius = 100
        // max = Math.max(max, val);
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val,
          // radius configuration on point basis
          radius: radius,
          clone: radius
        };
        points.push(point);
      }
      // heatmap data format
      var data = {
        max: max,
        data: points
      };
      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapInstance.setData(data);
      rectang = scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
              rectangle: Cesium.Rectangle.fromDegrees(
                -120.0,
                0.0,
                -80.0,
                40.0
              ),
              vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            }),
          }),
          // appearance: ,
          show: true,
          allowPicking: false
        })
      );
      rectang.appearance = new Cesium.EllipsoidSurfaceAppearance({
        // aboveGround: false,
        material: new Cesium.Material({
          fabric: {
            type: "Image",
            uniforms: {
              image: canvasContainer.lastChild.toDataURL("image/png"),
            },
          },
        })
      })
      viewer.camera.moveEnd.addEventListener(() => {
        let a = camera.positionCartographic.height;
        if (a > 9000000) {
          a = 1
        } else {
          a = a / 9000000
        }

        points = points.map(p => {
          let num = Math.floor(p.clone * a)
          p.radius = num > 0 ? num : 1
          return p
        })
        // heatmap data format
        var data = {
          max: max,
          data: points
        };
        // if you have a set of datapoints always use setData instead of addData
        // for data initialization
        heatmapInstance.setData(data);
        console.log(rectang.appearance.material);
        rectang.appearance.material.uniforms.image = canvasContainer.lastChild.toDataURL("image/png")
        // rectang.appearance = new Cesium.EllipsoidSurfaceAppearance({
        //   aboveGround: false,
        //   material: new Cesium.Material({
        //     fabric: {
        //       type: "Image",
        //       uniforms: {
        //         image: canvasContainer.lastChild.toDataURL("image/png"),
        //       },
        //     },
        //   })
        // })
      })
      camera.flyTo({ destination: { x: -1971975.4191203448, y: -14803000.39336014, z: 4949683.691860933 }, orientation: { heading: 0.007126499771088035, pitch: -1.5625996938330577, roll: 0 } })
    } else {
      rectang.show = !rectang.show
      rectang.show && camera.flyTo({ destination: { x: -1971975.4191203448, y: -14803000.39336014, z: 4949683.691860933 }, orientation: { heading: 0.007126499771088035, pitch: -1.5625996938330577, roll: 0 } })
    }
  })
  let lastStage
  elBindClick('radarScan', () => {
    viewer.scene.postProcessStages.remove(lastStage);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117.270739, 31.84309, 3213.48)
    })
    showRadarScan()
  })
  elBindClick('circleScan', () => {
    viewer.scene.postProcessStages.remove(lastStage);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117.270739, 31.84309, 3213.48)
    })
    showCircleScan()
  })

  function showCircleScan() {
    viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
    var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(117.270739), Cesium.Math.toRadians(31.84309), 32);
    var scanColor = new Cesium.Color(0.0, 1.0, 0.0, 1);
    lastStage = addCircleScanPostStage(viewer, cartographicCenter, 1000, scanColor, 2000);
  }

  function showRadarScan() {
    viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
    var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(117.270739), Cesium.Math.toRadians(31.84309), 32);
    var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
    lastStage = addRadarScanPostStage(viewer, cartographicCenter, 1000, scanColor, 3000);
  }
  let flowingWall;
  elBindClick('flowWall', () => {
    if (!flowingWall) {
      const newLocal = `data:image/png;base64,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`
      flowingWall = viewer.entities.add({
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArray([117.154815, 31.853495, 117.181255, 31.854257, 117.182284, 31.848255, 117.184748, 31.840141, 117.180557, 31.835556, 117.180023, 31.833741, 117.166846, 31.833737, 117.155531, 31.833151, 117.154787, 31.835978, 117.151994, 31.839036, 117.150691, 31.8416, 117.151215, 31.844734, 117.154457, 31.848152, 117.154814, 31.853494]),
          maximumHeights: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
          minimumHeights: [43.9, 49.4, 38.7, 40, 54, 51, 66.7, 44.6, 41.2, 31.2, 50.1, 53.8, 46.9, 43.9],
          material: new Cesium.PolylineTrailLinkMaterialProperty(new Cesium.Color(1, 0, 0, 0.4), 2000, newLocal),
        },
      })
      viewer.flyTo(flowingWall)
    } else {
      flowingWall.show = !flowingWall.show;
      flowingWall.show && viewer.flyTo(flowingWall)
    }
  });
  elBindClick('area', () => {
    var drawingMode = "polygon"
    if (!viewer.scene.pickPositionSupported) {
      alert("This browser does not support pickPosition.");
    }
    if (!handler) {
      var activeShapePoints = [];
      var activeShape;
      var floatingPoint;
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function (event) {
        // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
        // we get the correct point when mousing over terrain.
        var earthPosition = viewer.camera.pickEllipsoid(
          event.position,
          scene.globe.ellipsoid
        );
        // `earthPosition` will be undefined if our mouse is not over the globe.
        if (Cesium.defined(earthPosition)) {
          if (activeShapePoints.length === 0) {
            floatingPoint = createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            var dynamicPositions = new Cesium.CallbackProperty(function () {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }, false);
            activeShape = drawShape(dynamicPositions);
          }
          activeShapePoints.push(earthPosition);
          createPoint(earthPosition);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(function (event) {
        if (Cesium.defined(floatingPoint)) {
          var newPosition = viewer.camera.pickEllipsoid(
            event.endPosition,
            scene.globe.ellipsoid
          );
          if (Cesium.defined(newPosition)) {
            floatingPoint.position.setValue(newPosition);
            activeShapePoints.pop();
            activeShapePoints.push(newPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      // Redraw the shape so it's not dynamic and remove the dynamic shape.
      function terminateShape() {
        activeShapePoints.pop();
        drawShape(activeShapePoints);
        drawDataSource.entities.remove(floatingPoint);
        drawDataSource.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
      }
      function drawShape(positionData) {
        var shape;
        shape = drawDataSource.entities.add({
          position: new Cesium.CallbackProperty(() => {
            if (activeShapePoints.length > 0) {
              return activeShapePoints[0]
            }
            return positionData[0]
          }, false),
          polygon: {
            hierarchy: positionData,
            material: Cesium.Color.WHITE.withAlpha(0.7),
            // height: 0,
            outline: true,
            outlineWidth: 2,
            outlineColor: Cesium.Color.YELLOW,
            // arcType: Cesium.ArcType.RHUMB,
          },
          label: {
            backgroundColor: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
            text: new Cesium.CallbackProperty(() => {
              if (activeShapePoints.length > 2) {
                let geojson = [];
                activeShapePoints.forEach(p => {
                  let cartographic = Cesium.Cartographic.fromCartesian(p)
                  geojson.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)])
                })
                let c = Cesium.Cartographic.fromCartesian(activeShapePoints[0]);
                geojson.push([Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)])
                let polygon = new turf.polygon([geojson])
                return (turf.area(polygon) / 1000000).toFixed(2)+'km²'
              }
              if (positionData instanceof Array) {
                let geojson = []
                positionData.forEach(p => {
                  let cartographic = Cesium.Cartographic.fromCartesian(p)
                  geojson.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)])
                })
                let c = Cesium.Cartographic.fromCartesian(positionData[0]);
                geojson.push([Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)])
                let polygon = new turf.polygon([geojson])
                return (turf.area(polygon) / 1000000).toFixed(2)+'km²'
              }
            }, false),
            showBackground: true
          },

        });
        return shape;
      }
      handler.setInputAction(function (event) {
        terminateShape();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    } else {
      handler.destroy();
      drawDataSource.entities.removeAll()
      handler = null;
    }

    function createPoint(worldPosition) {
      var point = drawDataSource.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      });
      return point;
    }
  })
}



function elBindClick(id, cb) {
  document.getElementById(id).addEventListener('click', cb);
}



