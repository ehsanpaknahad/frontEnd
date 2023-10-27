import React, { useEffect , useState} from "react"
import "./index.css";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
 

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
//import Footer from "./components/Footer"
import About from "./components/About"
import Admin from "./components/Admin"

import Map from "./components/Map"
 
 
//import FlashMessages from "./components/FlashMessages"

import reportWebVitals from "./reportWebVitals"

Axios.defaults.baseURL = "http://localhost:8081"

function Index() {
  const [notification, setNotification] = useState(null);

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      role: null,
      attributeEditing: [],
      geometryEditing: []
    },
    notification: null
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user.token = action.data.token
        draft.user.username = action.data.user.username  
        draft.user.role = action.data.user.role  
        draft.user.attributeEditing = action.data.user.attributeEditing 
        draft.user.geometryEditing = action.data.user.geometryEditing   
        return      
      case "logout":
        draft.loggedIn = false
        return
      case "signup":
        draft.notification = "Congrats... Your account has been created, inform admin to confirm it."
        return
      case "wait":
        draft.notification = action.data        
        return
      case "confirm":
        draft.notification = ""       
        return
      case "userpassError":
        draft.notification = action.data       
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return

      default:
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  
    
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
       
    } else {
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loggedIn])

  return (
    <div className="main-container">
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <FlashMessages messages={state.flashMessages} /> */}
          <Header  className="header"  notification = {notification}/>
        
         <div className="body-container">
          <Switch>           
            <Route exact path="/">
              {state.loggedIn ? <Map /> : <HomeGuest setNotification = {setNotification} />} 
            </Route>
             
            
            <Route exact path="/about-app">
              <About />
            </Route> 
            <Route exact path="/admin">
              <Admin />
            </Route> 
          </Switch>
        </div>
          
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Index />)

reportWebVitals()
 
