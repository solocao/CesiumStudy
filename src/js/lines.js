let arr = [[141.32092413346064, 35.84288787589721], [137.15661425829046, 35.02026637244219], [133.5040436298469, 34.17577990362141], [130.68020615646589, 33.334906727581426], [117.33055116076375, 28.28434224076602], [125.39948490680999, 36.64823877391628], [131.17544713752238, 32.44545647661215]]
arr = insert(arr, 12000)
let entities = [
  new Cesium.Entity({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([117.74524327559975, 35.38476706965578, 114.20500875723677, 33.32715123237522]),
      width: 5,
      // arcType: Cesium.ArcType.RHUMB,
      // show:false,
      material: new Cesium.ODLineMaterialProperty(
        Cesium.Color.fromCssColorString("rgb(205, 97, 51)"),
        100
        // require("../assets/line.png").default
      )
    }
  }),

  {
    name: "Glowing blue line on the surface",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.76429925632405, 36.79108566378312,
        112.00380347159373, 33.67223639192952
      ]),
      width: 10,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        taperPower: 0.5,
        color: Cesium.Color.CORNFLOWERBLUE,
      }),
    },
  },
  {
    name:
      "Orange line with black outline at height and following the surface",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        114.39912793530219, 32.440883785915126,
        250000,
        118.11463799246998, 34.824831814883176,
        250000,
      ]),
      arcType: Cesium.ArcType.RHUMB,
      width: 5,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK,
      }),
    },
  },
  {
    name: "Purple straight arrow at height",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        115.41319698360863, 38.83939088425705,
        111.08894163084776, 36.138115252480915
      ]),
      width: 10,
      arcType: Cesium.ArcType.NONE,
      material: new Cesium.PolylineArrowMaterialProperty(
        Cesium.Color.PURPLE
      ),
    },
  },
  {
    name: "Blue dashed line",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        119.50010446568908, 35.12734322276294,
        114.99024045827305, 32.191186601045594
      ]),
      width: 4,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
      }),
    },
  },
  {
    name: 'Red tube with rounded corners',
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        120.01010289416253, 33.36672423091356,
        114.55661320458698, 30.302251829648743
      ]),
      shape: computeCircle(60000.0),
      material: require("../assets/墙面.png").default,
    }
  },
  {
    name: "Green box with beveled corners and outline",
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        120.84745641779308, 31.35518977014723,
        116.76551527678282, 28.852829699996533
      ]),
      shape: [
        new Cesium.Cartesian2(-50000, -50000),
        new Cesium.Cartesian2(50000, -50000),
        new Cesium.Cartesian2(50000, 50000),
        new Cesium.Cartesian2(-50000, 50000),
      ],
      cornerType: Cesium.CornerType.BEVELED,
      material: new Cesium.ImageMaterialProperty({
        image: require("../assets/墙面.png").default,
        repeat: new Cesium.Cartesian3(2, 2, 5)
      }),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  },
  {
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        117.97274986724413, 26.877292948794974,
        111.55676392275153, 25.190956231481827
      ]),
      shape: computeStar(7, 70000, 50000),
      cornerType: Cesium.CornerType.ROUNDED,
      material: Cesium.Color.BLUE,
    }
  },
  {
    polyline: getLine()
  },
  {
    name: "Blue extruded corridor with beveled corners and outline",
    corridor: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        -80.0,
        40.0,
        -85.0,
        40.0,
        -85.0,
        35.0,
      ]),
      height: 200000.0,
      extrudedHeight: 100000.0,
      width: 200000.0,
      cornerType: Cesium.CornerType.BEVELED,
      material: require("../assets/墙面.png").default,
      outline: true, // height or extrudedHeight must be set for outlines to display
      outlineColor: Cesium.Color.WHITE,
    },
  },
  {
    name: "Red box with black outline",
    position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 0.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 40000.0),
      material: new Cesium.ImageMaterialProperty({
        image: require("../assets/墙面.png").default,
        repeat: {
          x: 1,
          y: 3 / 4,
          z: 0.1
        }
      }),
      // outline: true,
      // outlineColor: Cesium.Color.BLACK,
    },
  }
];
function computeCircle(radius) {
  var positions = [];
  for (var i = 0; i < 360; i++) {
    var radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    );
  }
  return positions;
}

function computeStar(arms, rOuter, rInner) {
  var angle = Math.PI / arms;
  var length = 2 * arms;
  var positions = new Array(length);
  for (var i = 0; i < length; i++) {
    var r = i % 2 === 0 ? rOuter : rInner;
    positions[i] = new Cesium.Cartesian2(
      Math.cos(i * angle) * r,
      Math.sin(i * angle) * r
    );
  }
  return positions;
}

function getLine() {
  let index = 1;
  let array = [...arr[0]];
  let cbp1 = new Cesium.CallbackProperty((time, result) => {
    if (index < arr.length) {
      array.push(...arr[index]);
      index++
    }
    else {
      index = 1;
      array = [...arr[0]]
      // cbp.setCallback(()=>{
      //   return Cesium.Cartesian3.fromDegreesArray(array);
      // },true)
    }
    return Cesium.Cartesian3.fromDegreesArray(array);
  }, false)
  let cbp2 = new Cesium.CallbackProperty(() => {
    if (index >= arr.length) {
      // cbp.setCallback(()=>{
      //   return new Cesium.Cartesian2(time/arr.length*4, 1.0)
      // },true)
    }
    return new Cesium.Cartesian2(index / arr.length * 4, 1.0)
  }, false)
  return {
    positions: cbp1,
    material: new Cesium.ImageMaterialProperty({
      image: require("../assets/line.png").default,
      repeat: cbp2
    }),
    width: 5
  }
}
let time = 1
function getMateria() {

}
function insert(arr, step) {
  let buf = [];
  for (let i = 0; i < arr.length - 1; i++) {
    buf.push(arr[i]);
    let distance = getDistance(arr[i], arr[i + 1]);
    let percent = step / distance;
    if (distance > step) {
      let disbuf = 0;
      let start = arr[i];
      let end = arr[i + 1];
      let radio = 0.0;
      while ((distance - disbuf) > step) {
        radio += percent
        let x = start[0] + (end[0] - start[0]) * radio;
        let y = start[1] + (end[1] - start[1]) * radio;
        buf.push([x, y]);
        disbuf += step;
      }
    }
  }
  buf.push(arr[arr.length - 1]);
  return buf;
}
function getDistance(point1, point2) {
  var geodesic = new Cesium.EllipsoidGeodesic();
  var point1cartographic = Cesium.Cartographic.fromDegrees(...point1);
  var point2cartographic = Cesium.Cartographic.fromDegrees(...point2);
  geodesic.setEndPoints(point1cartographic, point2cartographic);
  var s = geodesic.surfaceDistance;
  return s
}
export default entities