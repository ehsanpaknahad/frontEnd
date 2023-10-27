import React from "react"
import pic from '../tochal.jpg'; 
import Page from "./Page"
import { Link } from "react-router-dom"

function About() {
  return (
      
      <Page title="About App">  
     
      <div className="about-back">
        <Link to="/" className="about-back_link">
          <span className="less-than">{"<<"}</span> Back to main page
        </Link>
      </div>
      <div className="about">        
        <img className="about-pic" src={pic} alt="pic"/>
        <div className="about-text">
          <h2>About App</h2>
          <p>Developed in 2024 with soul and heart by Ehsan Paknahad. </p>
          <p>This versatile application seamlessly integrates both client and server-side components, providing role-based access to ensure secure data viewing and editing.
          Leveraging the power of Node.js and React.js, Ehsan skillfully constructs the functionalities for both sides, ensuring a cohesive and efficient system.</p> 
          <p>Geo-data management is accomplished through PostgreSQL, while Mongoose effectively addresses user authentication challenges. Furthermore, feature rendering and visualization are facilitated by the OpenLayers JS library.</p>
          <p>What sets this application apart is its ability to bypass the need for a separate map server application like GeoServer for rendering, analyzing, and visualizing data. Instead, binary data is directly obtained from the server and rendered through the OpenLayers library, resulting in superior performance for data visualization. </p>
          <p>It's worth mentioning that all the employed libraries and applications adhere to open-source principles.</p>
        </div>
      </div>
    </Page>
      
  )
}

export default About
