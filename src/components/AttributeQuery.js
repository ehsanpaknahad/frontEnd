import React, { useState , useContext} from "react"
import Axios from "axios"
import "../index.css"
import { boundingExtent} from 'ol/extent';
import StateContext from "../StateContext"

const AttributeQuery = (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedSchema, setSelectedSchema] = useState("")
 
  const [selectedSchemaValue, setSelectedSchemaValue] = useState()
  const [selectedLayer, setSelectedLayer] = useState("")
  
  
  const [layerNameSelected, setLayerNameSelected] = useState("")
  const [layersList, setLayersList] = useState([])
  const [columnArray,setColumnArray]= useState([])
  const [selectedLi, setSelectedLi] = useState(null);
  const [notification, setNotification] = useState(null);
  const [summerizedValue,setSummerizedValue] = useState([])
  const [selecteSummarizeLi,setSelecteSummarizeLi]  = useState([])

  const [sQLStatementPart1, setSQLStatementPart1] = useState("")
  const [schemaOption, setSchemaOption] = useState(false)
  const [layerOption, setLayerOption] = useState(false)
  const appState = useContext(StateContext)
  // trigger when user click on query bottom
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // let schemaName = []
  // const layerSpecifications = props.layersSpecifications
  // layerSpecifications.map((layer) => {
  //   const layerName = layer.layername
  //   const schema = layerName.substring(0, 3)
  //   schemaName.push(schema)
  // })

  //const optionsLayer = []
  const optionsSchema = [
    { value: "Oil", alias: "oil" },
    { value: "Gas", alias: "gas" },
    { value: "Gasoline", alias: "gzl" },
    { value: "Water", alias: "wtr" },
    { value: "Process", alias: "prc" },
    { value: "Public", alias: "pub" },
  ]

  const handleSchemaChange = (event) => {
    setLayersList([])

    const selectedValue = event.target.value  // alias of schemanames : Oil Process

    if (selectedValue){
      setSchemaOption(true);

      const selectedSchemaSelect = optionsSchema.find(
        (option) => option.value === selectedValue
      )
      
      //setSelectedValue(selectedValue)
      setSelectedSchema(selectedValue)  //  Oil Process
      //setSelectedAlias(selectedSchema ? selectedSchema.alias : "")
      setSelectedSchemaValue(selectedSchemaSelect.alias)  // oil gzl

      if (selectedSchemaSelect) {
        props.layersSpecifications.map((layer) => {
          const layerName = layer.layername
          const schemaName = layerName.substring(0, 3)

          if (selectedSchemaSelect.alias === schemaName) {
            setLayersList(prev => [...prev, layer.alias])
            
          }
          return null;
        })
      }
    }
  }

  const columnsTable = new Map(props.columnsTable);

  const handleLayerChange = (event) => {
    setTextareaValue('');
    setNotification(null);
    const selectedValue = event.target.value   // Pipe Cap Valve 
    if(selectedValue){
        setLayerOption(true)
        setSelectedLayer(selectedValue) // alias name of layer
        
        // const fruits = new Map([
        //   ["oilvav", ["column_1", "column_2"]],
        //   ["oilpip", ["column_3", "column_4"]],
        //   ["pubrod", ["column_5", "column_6"]]
        // ]);
        
        const foundLayer = props.layersSpecifications.find(layer => {
      // Check if selectedSchema matches the first three characters of layername
          const layernameMatchesSchema = layer.layername.substring(0, 3) === selectedSchemaValue; 
          // Check if layerName.alias matches selectedValue
            const aliasMatchesValue = layer.alias === selectedValue; 
            // Return true if both conditions are satisfied
        return layernameMatchesSchema && aliasMatchesValue;
        });
        const layername = foundLayer.layername;
        setLayerNameSelected(layername)
        
        setColumnArray(columnsTable.get(layername ))

        // make part 1 of sql statement
        setSQLStatementPart1(`SELECT * FROM ${selectedSchemaValue}.${layername} WHERE`);
    }
 
  }

  const handleFormSubmit = async (event) => {

      event.preventDefault()
      
     //const encodedWherePart = encodeURIComponent(`"body_material" = 'CS '`);
    // const response = await Axios.post("/api/query", {
    //       params: {
    //         schema: selectedSchemaValue,
    //         layer: layerNameSelected, 
           
    //       },
    //       data: {
    //       // wherePart: textareaValue,
    //        wherePart: textareaValue,
    //      },
    // })

    const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`
          }
        };

    try { 
        const response = await Axios.post("/api/query?schema=" + selectedSchemaValue + "&layer=" + layerNameSelected,
        { wherePart: textareaValue},
        config);

        const queryResult = response.data
        
        setNotification(queryResult.length + " features returned")
          //
        if (queryResult.length === 0) {
         // Handle the case when coordinates are empty
         return;
        }      

        const attributeData = queryResult.map( row => {

            let extent = [] ;        

            if (row.geometry !== null){
              let type = row.geometry.type;  

              if (type === 'MultiLineString' || type === 'LineString'){
                  const coordinates = row.geometry.coordinates;
                  const flattenedCoordinates = coordinates.flat();
                  extent = boundingExtent(flattenedCoordinates);
                
              } else if (type === 'Polygon' || type === 'MultiPolygon') {
                const coordinates =row.geometry.coordinates[0]; 
                const flattenedCoordinates = coordinates.flat();         
                extent = boundingExtent(flattenedCoordinates);

              } else if (type === 'Point' || type === 'MultiPoint') {
                const coordinates = row.geometry.coordinates;
                extent = [coordinates[0], coordinates[1], coordinates[0], coordinates[1]];
              } else {
                return null
              }

              const feature = {
                ...row , geometry: { ...row.geometry, extent_: extent },
              }
                
              return feature
            }
            return null
        }).filter(feature => feature !== null);
        
        props.setMenuUp(true);
       //  console.log(attributeData)
        props.setAttributeData(attributeData)
    } catch (error) {
      if (error.response ) {
        const errorMessage = error.response.data.error;     
        console.log(errorMessage);  
      } else {     
        console.error("An error occurred:", error);
      }
    }
     

    
    //  const excludeGeom = result.rows.map(feature => {
    //    const { geom, ...rest } = feature;
    //    return rest;
    //  }); 
   

    //  // excludeGeom format : [ {location_type: 'above_ground', size: 20,..}, {...}]

    //  excludeGeom.map(feature => {
    //    feature['uid'] = `${layer}${feature['id']}`
    //     return null;
    //  });  
     
  }
  
  const handleLiClick = (item) => {
    setSelectedLi(item);
    setTextareaValue((prevValue) => prevValue + `"${item}"`);
  };

  const operatorClick = (value) => {
     setTextareaValue((prevValue) => prevValue + value);
   
  };

  const handleSummarizedClick = (item) => {
     setSelecteSummarizeLi(item);
     setTextareaValue((prevValue) => prevValue + "'" + item + "'");
  }

  const handleGetUniqueValue = async () => {
     const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`
          }
        };
        
    const response = await Axios.get("/api/summarize", {
          params: {
            selectedLi: selectedLi,
            selectedSchemaValue: selectedSchemaValue,
            layerNameSelected: layerNameSelected,            
          },...config
        })
    
    const summarizedValue = response.data
   // console.log(summarizedValue)
   setSummerizedValue(summarizedValue)
     
  }

  return (
    <div className="input-container">
      <div className="query-button" onClick={toggleMenu}>
        Query Attributes
      </div>
      <form
        className={`drop-down ${menuOpen ? "show" : ""}`}
        onSubmit={handleFormSubmit}
      >
        <div className="drop-down_container h">
          <div className="drop-down_label">Dataset:</div>
          <select
            className="drop-down_select"
            value={selectedSchema}
            onChange={handleSchemaChange}
          >
            <option value="">Select a Dataset:</option>
            {optionsSchema.map((option, index) => (
              <option key={index} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <div className="drop-down_container h">
          <div className="drop-down_label">Layer:</div>
          <select
            className="drop-down_select"
            value={selectedLayer}
            onChange={handleLayerChange}
          >
            <option value="">Select a Layer</option>
            {layersList.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="drop-down_label">Attribute Data List:</div>
        <div className="drop-down_container h">
          <ul className="attribute_result field" placeholder="" >
             {columnArray.map((item, index) => (
               <li key={index} onClick={() => handleLiClick(item)}
               className= 'attribute_result-li'
               style={{ backgroundColor: selectedLi === item ? "rgba(241,60,31,0.8)" : "" , color: selectedLi === item ? "#ffffff" : ""}}
               >{item}</li>
              ))}
          </ul>
          <div className="drop-down_container v">
            <button className="drop-down_button get" type="button" onClick={() => handleGetUniqueValue()}>Get Its Unique Values:</button>
             
             <ul className="attribute_result value" placeholder="" >
             {summerizedValue.map((item, index) => (
               <li key={index} onClick={() => handleSummarizedClick(item)}
               className= 'attribute_result-li'
               style={{ backgroundColor: selecteSummarizeLi === item ? "rgba(241,60,31,0.8)" : "" , color: selecteSummarizeLi === item ? "#ffffff" : ""}}
               >{item}</li>
              ))}
          </ul>
          </div>
        </div>
        <div className="drop-down_container v">
          <div className="drop-down_container h">
            <div className="drop-down_conditions">
              <button  type="button" onClick={() => operatorClick(' = ')} className="condition-button">=</button>
              <button  type="button" onClick={() => operatorClick(' <> ')} className="condition-button">&lt;&gt;</button>
              <button  type="button" onClick={() => operatorClick(' Like ')} className="condition-button">Like</button>

              <button  type="button" onClick={() => operatorClick(' < ')} className="condition-button">&lt;</button>
              <button  type="button" onClick={() => operatorClick(' > ')} className="condition-button">&gt;</button>
              <button  type="button" onClick={() => operatorClick(' And ')} className="condition-button">And</button>

              <button  type="button" onClick={() => operatorClick(' <= ')} className="condition-button">&lt;=</button>
              <button  type="button" onClick={() => operatorClick(' >= ')} className="condition-button">&gt;=</button>
              <button  type="button" onClick={() => operatorClick(' Or ')} className="condition-button">Or</button>

              <button  type="button" onClick={() => operatorClick('%')} className="condition-button">%</button>
              <button  type="button" onClick={() => operatorClick(' Is ')} className="condition-button">Is</button>
              <button  type="button" onClick={() => operatorClick(' Not ')} className="condition-button">Not</button>
            </div>
          </div>
        </div>

        <div className="drop-down_label">SQL Statement:</div>
        <div className="sql-statement_firstpart">{sQLStatementPart1} </div>        
        <textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} className="sql-statement" placeholder="" /> 
        <div className="drop-down_container h">       
          <button className="drop-down_button submit" disabled={!(schemaOption && layerOption)}
          >Submit</button>         
          <div className="attribute-query_notification">{notification}</div>
        </div> 
      </form>
    </div>
  )
}

export default AttributeQuery
