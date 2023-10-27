import React, { useState, useEffect,useContext } from "react"
import "../index.css"

import { getCenter } from "ol/extent"
import { Style, Fill, Stroke, Circle } from "ol/style"
//import { zoom } from 'ol/animation';
import Axios from "axios"
import StateContext from "../StateContext"

const AttributeTable = ({
  setAttributeData,
  attributeData,
  menuUp,
  setMenuUp,
  map,
  dataRendered,
  setDataRendered,
  setVectorLayers,
  vectorLayers,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleKeys, setVisibleKeys] = useState([])
  const [isEmptyData, setIsEmptyData] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [startEditing, setStartEditing] = useState(false)
  const [isClicked, setIsClicked] = useState(false);
  const [storeIsClicked, setStoreIsClicked] = useState(false);
  
  const [notification, setNotification] = useState(false)

  const [rowSelected, setRowSelected] = useState()
  const [totalPages, setTotalPages] = useState()
  const [updateObject, setUpdateObject] = useState({})

  const [focusedInput, setFocusedInput] = useState("")
  
  const appState = useContext(StateContext)

  let bottomValue = 0
  //calculate  number of column by getting window width
  const monitorWidth = window.screen.width
  const columnWidth = 50
  const columnsPerPage =  Math.ceil(monitorWidth / columnWidth)

   


  useEffect(() => {
    if (attributeData.length !== 0) {
      setCurrentPage(1)
    
    }
  }, [attributeData])

  useEffect(() => {
    if (attributeData.length === 0) {
      setIsEmptyData(true)
      setVisibleKeys([])
    } else {
      setIsEmptyData(false)
      const totalPage = Math.ceil(
        Object.keys(attributeData[0]).length / columnsPerPage
      )
      setTotalPages(totalPage)

      const startIndex = (currentPage - 1) * columnsPerPage
      const endIndex = startIndex + columnsPerPage
      const keys = Object.keys(attributeData[0]).slice(startIndex, endIndex)
      setVisibleKeys(keys)
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeData, currentPage])

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1)
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const handelCloseTable = () => {
    setMenuUp(false)
  }

  const handleDownload = () => {
    const XLSX = require("xlsx")
    const exportToExcel = (data, filename) => {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      // Convert your array of objects to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(data)
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1")
      // Save the workbook as an Excel file
      XLSX.writeFile(workbook, filename)
    }
    exportToExcel(attributeData, "QueryResults.xlsx")
  }

  const handleDeSelectAll = () => {
    setSelectAll(false)
    setRowSelected()

    if (dataRendered) {
      // in case user finished his panning and changing extent
      if (attributeData && attributeData.length > 0) {
        // //attributeData:array of query results [{feature},{},...]
        // const uid = attributeData[0].uid
        // const layername = uid.substring(0, 6)

        // if (vectorLayers[layername]) {
        //   const vectorSource = vectorLayers[layername].getSource()
        //   vectorSource.getFeatures().forEach((renderFeature) => {
        //     renderFeature.setStyle(null)
        //   })
        // }
        Object.keys(vectorLayers).forEach((layerName) => {
          const vectorLayer = vectorLayers[layerName]
          const vectorSource = vectorLayer.getSource()
          vectorSource.getFeatures().forEach((renderFeature) => {
            renderFeature.setStyle(null)
          })
        })
      }
    }
  }

  const handleSelectAll = () => {
    handleDeSelectAll()
    setSelectAll(true)
  }

  useEffect(() => {
    const highlightStyle = new Style({
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
      }),
    })

    if (dataRendered && selectAll) {
      console.log(selectAll)
      //
      if (attributeData.length > 0) {
        //console.log(selectAll)
        //
        //attributeData:array of query results [{feature},{},...]
        const uid = attributeData[0].uid
        const layername = uid.substring(0, 6)

        if (vectorLayers[layername]) {
          const vectorSource = vectorLayers[layername].getSource()
          attributeData.forEach((queryFeature) => {
            const qf_uid = queryFeature.uid
            vectorSource.getFeatures().forEach((renderFeature) => {
              if (renderFeature.get("uid") === qf_uid) {
                renderFeature.setStyle(highlightStyle)
              }
            })
          })
        }
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRendered, selectAll])

  const handleZoomClick = (index) => {
    if (rowSelected !== undefined) {
      handleDeSelectAll()
    }

    const geometry = attributeData[index]?.geometry

    if (geometry && geometry.extent_) {
      const extent = geometry.extent_
      const view = map.getView()
      const center = getCenter(extent)

      view.animate({
        center: center,
        duration: 1000, // Animation duration (in milliseconds)
      })
    } else {
      console.log("Invalid geometry:", geometry)
    }
    setRowSelected(index)
  }

  const handleInputChange = (index, key, value) => {
    //console.log("New input value:", value);
    const updatedAttributeData = [...attributeData]
    updatedAttributeData[index][key] = value
    setAttributeData(updatedAttributeData)
  }
  const handleFocus = (key) => {
    setFocusedInput(key)
  }

  const handleFinalChange = (index, key, value) => {
    if (startEditing) {
      if (index in updateObject && !updateObject[index].includes(key)) {
        setUpdateObject({
          ...updateObject,
          [index]: [...updateObject[index], key], // [] make index  a varible
        })
      } else {
        setUpdateObject({
          ...updateObject,
          [index]: [key], // [] make index  a varible
        })
      }
    }
  }

  useEffect(() => {
    const highlightStyle = new Style({
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
      }),
    })

    if (dataRendered && rowSelected !== undefined) {
      const uid = attributeData[rowSelected].uid
      const layername = uid.substring(0, 6)
      console.log("uid:" + uid)
      const vectorSource = vectorLayers[layername].getSource()
      vectorSource.getFeatures().forEach((feature) => {
        console.log("uid2:" + feature.get("uid"))
        if (feature.get("uid") === uid) {
          feature.setStyle(highlightStyle)
        } else {
          // Reset the style for other features n
          feature.setStyle(null)
        }
      })
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRendered, rowSelected])

  const handleStartEditing = () => {
    setStoreIsClicked(false)
    setNotification(null);
    setStartEditing(true)
    setIsClicked(true)
  }
   

  
  const handleStoreChanges = async () => {
    setIsClicked(false)
    setStoreIsClicked(true)
    if (startEditing) {

      // check user changes any thing or not, in case he did not change ,we just send message
      if (Object.keys(updateObject).length === 0) {
        setNotification('Nothing changed to update ...');
        return; // Exit the function or stop further code execution
      }

      let updateObjectGot = {}

      Object.keys(updateObject).forEach((key) => {
        const uid = attributeData[key].uid

        const values = updateObject[key] // values are the columns that updated

        const columns = {}
        values.forEach((column) => {
          columns[column] = attributeData[key][column] // i am trying to get value of columns
        })
        updateObjectGot[uid] = columns
      })

       
      try {

        const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`
          }
        };        
        const response = await Axios.post("/api/attrUpdate", updateObjectGot, config)
        const updateResult = response.data        
       
        setNotification(
          () => {
             
            if (Array.isArray(updateResult)) {
              // Handle array type
              return `Congrats, ${updateResult.length} features updated...`;
            } else if (typeof updateResult === 'object') {
              // Handle other types of objects
              return `Congrats, ${updateResult.rowCount} feature updated...`;
            } else {
              // Handle other types or unexpected values
              return 'Invalid update result';
            }
          }
        )

        setTimeout(() => {
          setNotification(null);
          setStoreIsClicked(false)
        }, 5000);

        setStartEditing(false)
        if (updateResult.length === 0) {
          // Handle the case when coordinates are empty //
          setNotification( 'Nothing get from server ...')
          return
        }
        setUpdateObject({})
      } catch (error) {
        if (error.response && error.response.status === 403) {
           const errorMessage = error.response.data.error;
           setNotification(errorMessage);
        } else {
           console.error(error);
        }
      }
    }
  }

  return (
    <div
      className={`attribute-table_container ${menuUp ? "show" : ""}`}
      style={{ "--table-bottom": bottomValue }}
    >
      <div></div>
      {isEmptyData ? (
        <p></p>
      ) : (
        <>
          <div className="attribute-table-elements">
            <button
              className="attribute-table_button"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              {" "}
              Previous{" "}
            </button>
            <span className="attribute-table_span">{currentPage}</span>
            <button
              className="attribute-table_button"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next
            </button>
            <button
              className="attribute-table_selectall"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              className="attribute-table_selectall"
              onClick={handleDeSelectAll}
            >
              DeSelect All
            </button>
            <button
              className="attribute-table_download"
              onClick={handleDownload}
            >
              Download Results
            </button>
            
             {appState.user.role !== "viewer" && appState.user.attributeEditing.includes(attributeData[0]?.uid?.substring(0, 6)) && (
              <button
                className={`attribute-table_edit ${isClicked ? 'clicked' : ''}`}
                onClick={handleStartEditing}
              >
                Start Editing
              </button>
             )}
             
            {appState.user.role !== "viewer" && appState.user.attributeEditing.includes(attributeData[0]?.uid?.substring(0, 6)) && (
            <button
              className={`attribute-table_edit ${storeIsClicked ? 'clicked' : ''}`} 
              onClick={handleStoreChanges}
            >
              Store Changes
            </button>
             )}
            <div className="attribute-table_notification">{notification}</div>
            <button
              className="attribute-table_close"
              onClick={handelCloseTable}
            >
              X
            </button>
          </div>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            <table className="attribute-table">
              <thead>
                <tr>
                  <th> </th>
                  {visibleKeys.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributeData.map((attribute, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        rowSelected === index || selectAll
                          ? "rgba(241,60,31,0.8)"
                          : "",
                      color:
                        rowSelected === index || selectAll ? "#ffffff" : "",
                    }}
                  >
                    <td>
                      <button
                        className="attribute-table_zoom"
                        onClick={() => handleZoomClick(index)}
                      >
                        {" "}
                        {">"}
                      </button>
                    </td>

                    {visibleKeys.map((key) => (
                      <td key={key}>
                        {key === "geometry" ? (
                          attribute[key].extent_[0] +
                          "," +
                          attribute[key].extent_[1]
                        ) : (
                          <input
                            type="text"
                            value={attribute[key] || ""}
                            className={
                              focusedInput === `${index}-${key}` ? "focus" : ""
                            }
                            onBlur={(e) =>
                              handleFinalChange(index, key, e.target.value)
                            }
                            onChange={(e) =>
                              handleInputChange(index, key, e.target.value)
                            }
                            onFocus={() => handleFocus(`${index}-${key}`)}
                          />
                        )}
                      </td>
                    ))}
                    {/* </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AttributeTable
