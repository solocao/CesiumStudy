import pointEntities from "./points"
import lineEntities from "./lines"
import polygonEntities from "./polygons"
export default function (viewer) {
  console.log(Cesium.Cartesian3.fromDegreesArray([117.74524327559975, 35.38476706965578, 114.20500875723677, 33.32715123237522]));
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
        110.0, 30.0, 0,
        150.0, 30.0, 0,
        150.0, 10.0, 0,
        110.0, 10.0, 0
      ];
      waterPrimitive = new Cesium.Primitive({
        // show: true,// 默认隐藏
        allowPicking: false,
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(waterFace)),
            //extrudedHeight: 0,//注释掉此属性可以只显示水面
            // perPositionHeight : true//注释掉此属性水面就贴地了
          })
        }),
        // 可以设置内置的水面shader
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Water',
              uniforms: {
                baseWaterColor: new Cesium.Color(45 / 255 * 1.0, 71 / 255 * 1.0, 140 / 255 * 1.0, 0.6),
                blendColor: new Cesium.Color(0 / 255 * 1.0, 0 / 255 * 1.0, 255 / 255 * 1.0, 1.0),
                //specularMap: 'gray.jpg',
                //normalMap: '../assets/waterNormals.jpg',
                normalMap: require('../assets/waterNormals.jpg').default,
                frequency: 3000.0,
                animationSpeed: 0.05,
                amplitude: 1.0
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
              if (drawingMode === "polygon") {
                return new Cesium.PolygonHierarchy(activeShapePoints);
              }
              return activeShapePoints;
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
      document.getElementById("app").appendChild(popup);
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
            Cesium.Color.fromCssColorString(`rgb(${Math.random() * 255}, 183, 49,1.0)`),
            100
          )
          en.polyline.width = 3
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
        var val = Math.floor(Math.random() * 100);
        // now also with custom radius
        var radius = Math.floor(Math.random() * 30);
        // max = Math.max(max, val);
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val,
          // radius configuration on point basis
          radius: radius
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
        aboveGround: false,
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
        
        let a=camera.positionCartographic.height;
        if(a>9000000){
          a=100
        }else {
          a=a/9000000*100
        }
        console.log(a);
        points=points.map(p=>{
          p.radius=Math.floor(Math.random()* a)
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
        rectang.appearance = new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: new Cesium.Material({
            fabric: {
              type: "Image",
              uniforms: {
                image: canvasContainer.lastChild.toDataURL("image/png"),
              },
            },
          })
        })
      })
      camera.flyTo({ destination: { x: -1971975.4191203448, y: -14803000.39336014, z: 4949683.691860933 }, orientation: { heading: 0.007126499771088035, pitch: -1.5625996938330577, roll: 0 } })
    } else {
      rectang.show = !rectang.show
      rectang.show && camera.flyTo({ destination: { x: -1971975.4191203448, y: -14803000.39336014, z: 4949683.691860933 }, orientation: { heading: 0.007126499771088035, pitch: -1.5625996938330577, roll: 0 } })
    }
  })
}


function elBindClick(id, cb) {
  document.getElementById(id).addEventListener('click', cb);
}