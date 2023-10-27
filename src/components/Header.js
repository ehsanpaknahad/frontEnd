import React, {useContext} from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from '../StateContext'
import "../index.css";
import iconImage from '../iconImage.png'; 
import  admin from '../admin.png'; 

function Header(props) {
  const appState = useContext(StateContext)
  

  return (
    <header className="header">
          
        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
        <div className ="header_notification"> {appState.notification}</div>

         {appState.user.role === "admin" && (<Link to="/admin" className="header_admin" style={{backgroundImage:`url(${admin})`}}/> )} 
        <Link to="/about-app" className="header_about" style={{ backgroundImage: `url(${iconImage})` }}/>        
         
      
    </header>
  )
}

export default Header
