import React, { useEffect, useRef } from "react"
import "ol/ol.css"
import "../index.css";
import { Map, View } from "ol"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { transform } from "ol/proj"
// import { fromLonLat } from "ol/proj"
// import { addProjection } from "ol/proj"
import { get as getProjection } from "ol/proj"

import proj4 from "proj4"
import { register } from "ol/proj/proj4.js"
proj4.defs("EPSG:32640", "+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs")
register(proj4)

function CreateMap(props) {
  const mapRef = useRef(null)
  const utm = getProjection("EPSG:32640")

  useEffect(() => {
    if (mapRef.current) {
      const centerUTM = [253610, 2867476]
      // const isProjectionDefined = getProjection("EPSG:32640") !== undefined
      //const isProjectionDefined2 = getProjection("EPSG:4326") !== undefined
      //  const centerWGS84 = transform(centerUTM, "EPSG:32640", "EPSG:4326")
      // const centerWebMercator = transform(centerWGS84, "EPSG:4326", "EPSG:3857")
      
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(), // OpenStreetMap tile layer
          }),
        ],
        view: new View({
          projection: utm,
          center: centerUTM, // center: centerWGS84, // Initial map center (longitude, latitude)
          zoom: 20, // Initial zoom level
        }),
      })

      props.setMap(map)
      return () => {
        map.setTarget(null)
      }
    }
  }, [])

  return <div ref={mapRef} style={{ margin:0 , padding:0,border:0, height: "calc((11 / 12) * 100vh)" }} />
}

export default CreateMap
