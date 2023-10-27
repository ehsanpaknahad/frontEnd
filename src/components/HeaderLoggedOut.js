import React, { useState, useContext} from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut(props) {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const appDispatch = useContext(DispatchContext)

  async function handleSubmit(e) {
    e.preventDefault()
     
    try {
     const response = await Axios.post("/users/login", {username, password})      
     
     if (response.data) {
       appDispatch({ type: "login", data: response.data });
       appDispatch({type: 'confirm'}) 
     } 
    } catch (e) {
      //console.log("some login errors ", e.response)
      if (e.response.status === 401) {
        appDispatch({type: 'wait', data: "Please, Wait until admin confirm your account"})        
      }
      if (e.response.status === 400) {
        appDispatch({type: 'userpassError', data: "Password or Username are not valid."}) 
       
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} >
      <div className="login">
        <div className="login_v">
        <div className="login_h">
           <label  >
                Username
           </label>
          <input onChange={
              (e) => setUsername(e.target.value)
            }
            name="username"            
            type="text"
            placeholder="Username"
            autoComplete="off"/>
        </div>
        <div className="login_h">
           <label  >
                Password
           </label>
          <input onChange={
              (e) => setPassword(e.target.value)
            }
            name="password"            
            type="password"
            placeholder="Password"
            autoComplete="off"/>
        </div>
        </div>
        <div className="login-button">
          <button >Log In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
