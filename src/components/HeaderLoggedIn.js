import React, { useContext} from "react"
//import {Link} from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import { withRouter } from "react-router-dom"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

 const handleLogout = async() => {
    const config = {
        headers: {
          Authorization: `Bearer ${appState.user.token}`
        }
      };
    await Axios.post('/users/logout', null, config);
    appDispatch({type: 'logout'})
    props.history.push('/');
  }

  return (
    <div className="flex-row my-3 my-md-0"> 
      <button onClick={handleLogout}
        className="logout">
        Log Out
      </button>
    </div>
  )
}

export default withRouter(HeaderLoggedIn)
