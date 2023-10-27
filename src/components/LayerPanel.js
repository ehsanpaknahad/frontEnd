import React, { useState } from 'react';
import "../index.css";

const LayerPanel = (props) => {
  const [activeSchema, setActiveSchema] = useState('');

  //const vectorLayers = props.vectorLayers; // Use the prop
  //const setVectorLayers = props.setVectorLayers; // Use the prop
   

  const handleSchemaClick = (schemaName) => {
    setActiveSchema(prevSchema => prevSchema === schemaName ? '' : schemaName);
  };

  const updatedLayersSpecifications = [...props.layersSpecifications];
   
  const handleCheckboxChange = (index , layerName ) => {           
    updatedLayersSpecifications[index].visible = !updatedLayersSpecifications[index].visible;
    props.setLayersSpecifications(updatedLayersSpecifications);  

    props.setVectorLayers(prev => {
      const updatedVectorLayers = { ...prev }; // Create a copy of the previous state
    
      if (updatedVectorLayers[layerName]) {
        //updatedVectorLayers[layerName].setVisible(!updatedVectorLayers[layerName].getVisible());
        updatedVectorLayers[layerName].setVisible(updatedLayersSpecifications[index].visible);
      }
    
      return updatedVectorLayers; // Return the updated state
    })
    
  };

  const handleClick = (event) => {
    event.stopPropagation();
  };

  const renderLayerNames = (schemaName) => {
          return (
          <ul className="layer-names" onClick={handleClick} >
             { props.layersSpecifications.map( (layer,index) => {
                 const layerName = layer.layername
                 const firstThreeLetter= layerName.substring(0, 3);
                 if (firstThreeLetter === schemaName && schemaName === activeSchema){
                  return (
                   <li  key={index}>{props.layersSpecifications[index].alias}
                   <input type="checkbox" id={`myCheckbox-${index}`} checked={props.layersSpecifications[index].visible} onChange={ () => handleCheckboxChange(index ,layerName)}></input>
                   </li> 
                  );
                 }
                 return null;
                })}           
          </ul>
        );      
  };

  return (
    <div className="LayerPanel">
      <div className="LayerPanel_title">Layers Panel</div>
      <div className="schema" onClick={() => handleSchemaClick('oil')}>
        Oil
        {renderLayerNames('oil')}
      </div>
      <div className="schema" onClick={() => handleSchemaClick('gas')}>
        Gas
        {renderLayerNames('gas')}
      </div>
      <div className="schema" onClick={() => handleSchemaClick('Schema 3')}>
        Gasoline 
        {renderLayerNames('Schema 3')}
      </div>
       <div className="schema" onClick={() => handleSchemaClick('Schema 9')}>
        Water 
        {renderLayerNames('Schema 9')}
      </div>
       <div className="schema" onClick={() => handleSchemaClick('Schema 4')}>
        Process 
        {renderLayerNames('Schema 4')}
      </div>
       <div className="schema" onClick={() => handleSchemaClick('Schema 5')}>
        Electricity 
        {renderLayerNames('Schema 5')}
      </div>
      <div className="schema" onClick={() => handleSchemaClick('Schema 6')}>
        FireFighting 
        {renderLayerNames('Schema 6')}
      </div>
      <div className="schema" onClick={() => handleSchemaClick('Schema 7')}>
        Instrumentation  
        {renderLayerNames('Schema 7')}
      </div>
      <div className="schema" onClick={() => handleSchemaClick('pub')}>
        Public 
        {renderLayerNames('pub')}
      </div>
    </div>
  );
};

export default LayerPanel;