import React, { useState ,useContext} from "react"
import Axios from "axios"
import Page from "./Page"
import DispatchContext from "../DispatchContext"


function HomeGuest(props) {
  const [username, setUsername] = useState()
  const [unit, setUnit] = useState()
  const [password, setPassword] = useState()
  const appDispatch = useContext(DispatchContext)
 

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await Axios.post("/users/register", { username, unit, password })
            
      if (response && response.status === 201) {
        appDispatch({type: 'signup'})        
      }      

    } catch (e) {
      console.log("some register errors ")
    }
  }
  // 192.168.140.130

  return (
    <Page title="Welcome!" wide="true">
      <div className="signup">
        <div className="signup-info">
          <h1>Welcome to Sirri Web-GIS App</h1>
          <p>
            Please, sign up and then inform admin (Tel: 40372) to confirm your account.
          </p>
          
        </div>
        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <div className="signup-form_h">
              <label htmlFor="username-register" >
                <small>Username</small>
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                required
              />
            </div>
           
            <div className="signup-form_h">
              <label htmlFor="password-register">
                <small>Password</small>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Choose a password"
                required
              />
            </div>
             <div className="signup-form_h">
              <label htmlFor="email-register">
                <small>Tel & Dept</small>
              </label>
              <input
                onChange={(e) => setUnit(e.target.value)}
                id="unit-register"
                name="unit"
                className="form-control"
                type="text"                
                autoComplete="off"
                placeholder="Your Tell & Department"
                required
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            > 
             Sign up
            </button>
          </form>

        </div>
     
      </div>
     
    </Page>
  )
}

export default HomeGuest
