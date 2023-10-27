import "../index.css"
import { useEffect, useContext } from "react"
import Axios from "axios"
import { debounce } from "lodash"
import GeoJSON from "ol/format/GeoJSON"
import { Vector as VectorLayer } from "ol/layer"
import { Vector as VectorSource } from "ol/source"
import { Text, Circle, Style, Fill, Stroke } from "ol/style"
import proj4 from "proj4"
import { register } from "ol/proj/proj4.js"
import StateContext from "../StateContext"

proj4.defs("EPSG:32640", "+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs")
register(proj4)

function Rendering(props) {
  
  const appState = useContext(StateContext)
  const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`
          }
  };

  useEffect(() => {
    if (props.map) {      
 
      let layerNames = []
      props.layersSpecifications.map((layer) => {
        layerNames.push(layer.layername)
         return null;
      })

      const map = props.map
      let layerColor = "rgb(255, 204, 255)"
    
      const vectorLayers = props.vectorLayers; // Use the prop
      const setVectorLayers = props.setVectorLayers; // Use the prop

      let circleStyle
      let textStyle
      let previousExtent = null
      let previousViewZoom = null
      let viewZoom = map.getView().getZoom()

      const debouncedApiRequest = debounce(async () => {
        const view = map.getView()
        const extent = view.calculateExtent(map.getSize())
        viewZoom = map.getView().getZoom()
        

        if (
          previousExtent &&
          viewZoom > 19.5 &&
          previousViewZoom > 19.5 &&
          extent[0] >= previousExtent[0] &&
          extent[1] >= previousExtent[1] &&
          extent[2] <= previousExtent[2] &&
          extent[3] <= previousExtent[3]
        ) {
          return
        }

        previousViewZoom = viewZoom

        const minLng = extent[0]
        const minLat = extent[1]
        const maxLng = extent[2]
        const maxLat = extent[3]

        const response = await Axios.get("/api/geojson", {
          params: {
            layerNames: layerNames,
            minLng: minLng,
            minLat: minLat,
            maxLng: maxLng,
            maxLat: maxLat,
          }, ...config
        })

        const geojsonData = response.data
      

         // features[i].properties.uid
        // * vectorLayers : is an object to store all vector layers
        if (Object.keys(vectorLayers).length > 0) {
          Object.values(vectorLayers).forEach((layer) => {
            layer.getSource().clear()
          })
        }

        const layerSpecificationsMap = new Map()
        props.layersSpecifications.map((row) => {
          layerSpecificationsMap.set(row.layername, row)
          return null;
        })

        layerNames.forEach((layerName) => {
          
          const retrievedLayer = layerSpecificationsMap.get(layerName)
         
          const geojsonFormat = new GeoJSON()
          const geojsonFeatures = geojsonFormat.readFeatures(
            geojsonData[layerName]
          )

          const layerType = layerName.substring(layerName.length - 3)
          layerColor = retrievedLayer.color           

          if (geojsonFeatures.length > 0) {
            //const firstFeature = geojsonData[layerName].features[0];
            // const { geometry } = firstFeature;
             
            let style
            if (retrievedLayer.type === "Point") {
              if (viewZoom > 19.5) {
                circleStyle = new Style({
                  image: new Circle({
                    radius: 12,
                    fill: new Fill({ color: layerColor }),
                  }),
                })
                textStyle = new Style({
                  text: new Text({
                    text: layerType,
                    font: "12px Arial",
                    textAlign: "center",
                    textBaseline: "middle",
                    fill: new Fill({ color: "white" }),
                  }),
                })
                style = [circleStyle, textStyle]
              } else {
                circleStyle = new Style({
                  image: new Circle({
                    radius: 2,
                    fill: new Fill({ color: layerColor }),
                  }),
                })
                style = [circleStyle]
              }
            } else if (retrievedLayer.type === "Line") {
              

              style = function (feature) {
                const locationType = feature.get("location_type")
                const lineColor = layerColor
                const lineWidth = getLineWidth(feature.get("size"))
                const lineDash =
                  locationType === "under_ground"
                    ? retrievedLayer.linedash
                    : undefined
                if (locationType !== undefined) {
                  return new Style({
                    stroke: new Stroke({
                      color: lineColor,
                      width: lineWidth,
                      lineDash: lineDash,
                    }),
                  })
                } else {
                  return new Style({
                    stroke: new Stroke({
                      color: layerColor,
                      width: retrievedLayer.width,
                      lineDash: retrievedLayer.linedash,
                    }),
                  })
                }
              }
            } else if (retrievedLayer.type === "Polygon") {
              style = new Style({
                stroke: new Stroke({
                  color: "rgba(226, 198, 160, 0.3)",
                  width: 2,
                }),
                fill: new Fill({
                  color: "rgba(220, 198, 86, 0.3)",
                }),
              })
            } else {
              // Handle other geometry types
              style = null
            }

            function getLineWidth(size) {
              if (size < 6) {
                return 1
              } else if (size >= 6 && size < 14) {
                return 2
              } else {
                return 3
              }
            }

            if (vectorLayers[layerName]) {
              vectorLayers[layerName].getSource().addFeatures(geojsonFeatures)
              vectorLayers[layerName].setStyle(style)
              vectorLayers[layerName].setVisible(retrievedLayer.visible)
              // console.log(vectorLayers[layerName].getSource().getFeatures().length)
            } else {
              const vectorSource = new VectorSource({
                features: geojsonFeatures,
              })
              //console.log(vectorSource.getFeatures().length)

              const vectorLayer = new VectorLayer({
                source: vectorSource,
                style: style,
              })
               vectorLayer.setVisible(retrievedLayer.visible)

              if (retrievedLayer.type === "Point") {
                vectorLayer.setZIndex(2)
              } else if (retrievedLayer.type === "Line") {
                vectorLayer.setZIndex(1)
              } else if (retrievedLayer.type === "Polygon") {
                vectorLayer.setZIndex(0)
              }

              vectorLayers[layerName] = vectorLayer              

              setVectorLayers(vectorLayers); 
            
              map.addLayer(vectorLayers[layerName])
            }
          }
        })
       // map.updateSize();
       map.render() 
       previousExtent = extent
       props.setDataRendered(true);
      }, 2000)

      const handleMoveEnd = () => {
        //  console.log(map.getView().getZoom() )
        props.setDataRendered(false);
        debouncedApiRequest()
      }
      map.on("moveend", handleMoveEnd)

      return () => {
        map.un("moveend", handleMoveEnd)
      }
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default Rendering
