let rotation = Cesium.Math.toRadians(30);

function getRotationValue() {
  rotation += 0.005;
  return rotation;
}
let entities = [
  {
    name: "Rotating rectangle with rotating texture coordinate",
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-92.0, 30.0, -76.0, 40.0),
      material: require("../assets/Cesium_Logo_Color.jpg").default,
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false),
      classificationType: Cesium.ClassificationType.TERRAIN,
    },
  },
  {
    name: "Green extruded polygon",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -108.0,
        42.0,
        -100.0,
        42.0,
        -104.0,
        40.0,
      ]),
      extrudedHeight: 500000.0,
      material: Cesium.Color.GREEN,
      closeTop: false,
      closeBottom: false,
    },
  },
  {
    name: "Orange polygon with per-position heights and outline",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
        -108.0,
        25.0,
        100000,
        -100.0,
        25.0,
        100000,
        -100.0,
        30.0,
        100000,
        -108.0,
        30.0,
        300000,
      ]),
      extrudedHeight: 0,
      perPositionHeight: true,
      material: Cesium.Color.ORANGE.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  },
  {
    name: "Blue polygon with holes",
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -99.0,
          30.0,
          -85.0,
          30.0,
          -85.0,
          40.0,
          -99.0,
          40.0,
        ]),
        holes: [
          {
            positions: Cesium.Cartesian3.fromDegreesArray([
              -97.0,
              31.0,
              -97.0,
              39.0,
              -87.0,
              39.0,
              -87.0,
              31.0,
            ]),
            holes: [
              {
                positions: Cesium.Cartesian3.fromDegreesArray([
                  -95.0,
                  33.0,
                  -89.0,
                  33.0,
                  -89.0,
                  37.0,
                  -95.0,
                  37.0,
                ]),
                holes: [
                  {
                    positions: Cesium.Cartesian3.fromDegreesArray([
                      -93.0,
                      34.0,
                      -91.0,
                      34.0,
                      -91.0,
                      36.0,
                      -93.0,
                      36.0,
                    ]),
                  },
                ],
              },
            ],
          },
        ],
      },
      material: Cesium.Color.BLUE.withAlpha(0.5),
      height: 0,
      outline: true, // height is required for outline to display
    },
  },
  {
    name: "Cyan vertical polygon with per-position heights and outline",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
        -90.0,
        41.0,
        0.0,
        -85.0,
        41.0,
        500000.0,
        -80.0,
        41.0,
        0.0,
      ]),
      perPositionHeight: true,
      material: Cesium.Color.CYAN.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  },
  {
    name: "Purple polygon using rhumb lines with outline",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -120.0,
        45.0,
        -80.0,
        45.0,
        -80.0,
        55.0,
        -120.0,
        55.0,
      ]),
      extrudedHeight: 50000,
      material: Cesium.Color.PURPLE,
      outline: true,
      outlineColor: Cesium.Color.MAGENTA,
      arcType: Cesium.ArcType.RHUMB,
    },
  }
]
export default entities