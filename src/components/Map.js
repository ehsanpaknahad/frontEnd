import React, { useState, useEffect,useContext } from "react"
import { Style, Fill, Stroke, Circle } from "ol/style"
import Axios from "axios"

import "../index.css"
import CreateMap from "./CreateMap"
import LayerPanel from "./LayerPanel"
import Rendering from "./Rendering"
import AttributeTable from "./AttributeTable"
import AttributeQuery from "./AttributeQuery"
import StateContext from "../StateContext"
 

const Map = () => {

  const [map, setMap] = useState(null)
  const [isMapSet, setIsMapSet] = useState(false)
  
  const [attributeData, setAttributeData] = useState([])
  const [menuUp, setMenuUp] = useState([false])
  const [layersSpecifications, setLayersSpecifications] = useState([])
  const [specRecieved, setSpecRecieved] = useState(false)
  const [vectorLayers, setVectorLayers] = useState({})
  const [dataRendered,setDataRendered] = useState(false)
  const [columnsTable, setColumnsTable] = useState([])
  const appState = useContext(StateContext)
  // useEffect( () => {
  //   if(isMapSet && map){
  //     const view = map.getView();
  //     view.on("change:resolution", () => {
  //        const zoom = map.getView().getZoom();
  //        console.log("Zoom level:", zoom);
  //     });
    
     
  //   }
  // }, [map ,isMapSet])
    
 useEffect(() => {
   

    const fetchData = async () => {
      try {

        const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`
          }
        };

      const [layersResponse, columnsResponse] = await Promise.all([
          Axios.post("/api/layers", null, config),
          Axios.post("/api/columns", null, config)
      ]);
  
        const layers = layersResponse.data;
        
        const columns = columnsResponse.data;
  
        setLayersSpecifications(layers);
        setColumnsTable(columns);
        setSpecRecieved(true);
         
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
  
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //
  useEffect(() => {
    if (map && specRecieved) {
      setIsMapSet(true)
    }
  }, [map, specRecieved])

  useEffect(() => {
    const highlightedStyle = new Style({
      stroke: new Stroke({
        color: "rgba(241, 60, 32 , 1)",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(241, 60, 32 , 0.3)",
      }),
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: "rgba(241, 60, 32 , 0.3)" }),
        // animation: blink 1s linear infinite,
      }),
    })

    let highlightedFeature = null

    if (map && specRecieved) {
      map.on("click", function (event) {
        //let coordinate = event.coordinate;
        let clickedFeature = map.forEachFeatureAtPixel(
          event.pixel,
          function (feature) {
            // console.log(feature.getGeometry().getType())
            return feature
          }
        )

        if (clickedFeature) {
          const attributeData = clickedFeature.getProperties()       
          setAttributeData([attributeData])
          setMenuUp(true)          
        }

        if (clickedFeature !== highlightedFeature) {
          if (highlightedFeature) {
            highlightedFeature.setStyle(null)
          }

          if (clickedFeature) {
            clickedFeature.setStyle(highlightedStyle)
            highlightedFeature = clickedFeature
          }
        } else {
          clickedFeature.setStyle(null) // Deselect the feature
          highlightedFeature = null
          setAttributeData([])
          setMenuUp(false)
        }
      })
    }
  }, [map, specRecieved])

  return (
    <div className="map-container">
      
      {specRecieved && isMapSet && (
        <AttributeQuery
          map={map}
          setMenuUp={setMenuUp}
          layersSpecifications = {layersSpecifications} 
          columnsTable = {columnsTable}
          setAttributeData = {setAttributeData}
        />
      )}

      <CreateMap setMap={setMap} />
      {/* {isMapSet && <Draw map={map} />} */}
      {specRecieved && isMapSet && (
        <Rendering
          map={map}
          setDataRendered ={setDataRendered}
          vectorLayers={vectorLayers}
          setVectorLayers={setVectorLayers}
          layersSpecifications={layersSpecifications}
        />
      )}
      {specRecieved && isMapSet && (
        <LayerPanel
          map={map}
          vectorLayers={vectorLayers}
          setVectorLayers={setVectorLayers}
          layersSpecifications={layersSpecifications}
          setLayersSpecifications={setLayersSpecifications}
        />
      )}
      {isMapSet && attributeData !== null && (
        <AttributeTable map={map}
         menuUp={menuUp} 
         setVectorLayers = {setVectorLayers}
         vectorLayers = {vectorLayers}
         dataRendered ={dataRendered}
         setDataRendered = {setDataRendered}
         setMenuUp={setMenuUp} 
         setAttributeData = {setAttributeData}
         attributeData={attributeData} />
      )}
    </div>
  )
}

export default Map
