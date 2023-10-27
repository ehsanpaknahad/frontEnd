import { useEffect } from "react"
import L from "leaflet"
import "leaflet-draw/dist/leaflet.draw.css"
import "leaflet-toolbar/dist/leaflet.toolbar.css"
import "leaflet-draw/dist/leaflet.draw.js"
import "leaflet-toolbar/dist/leaflet.toolbar.js"
import "leaflet/dist/leaflet.css"

function Draw(props) {
  useEffect(() => {
    if (props.map) {
      const map = props.map
      console.log(" map  from draw")
      console.log(map)
      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)
      //
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polygon: true,
          circle: false,
          marker: false,
        },
      })
      map.addControl(drawControl)
    }
  }, [])

  return null
}

export default Draw
