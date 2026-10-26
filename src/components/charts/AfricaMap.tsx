import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

import geoData from "world-atlas/countries-110m.json";

export function AfricaMap() {
  return (
    <div className="africa-map">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-20, 0, 0],
          center: [0, 3],
          scale: 400,
        }}
        width={500}
        height={520}
        className="africa-map__svg"
        aria-label="BioCOPPA assessment map of Africa"
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;

              let fill = "#e5e1d7";

              if (countryName === "Kenya") {
                fill = "#3d6d31";
              }

              if (countryName === "Uganda") {
                fill = "#d89a2b";
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill:
                        countryName === "Kenya"
                          ? "#2f5726"
                          : countryName === "Uganda"
                          ? "#bf811d"
                          : "#cbc6ba",
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="africa-map__legend">
        <div className="africa-map__legend-item">
          <span className="africa-map__legend-swatch africa-map__legend-swatch--eligible" />
          <span>Assessment complete</span>
        </div>

        <div className="africa-map__legend-item">
          <span className="africa-map__legend-swatch africa-map__legend-swatch--progress" />
          <span>Assessment in progress</span>
        </div>

        <div className="africa-map__legend-item">
          <span className="africa-map__legend-swatch africa-map__legend-swatch--none" />
          <span>No assessment data</span>
        </div>
      </div>
    </div>
  );
}