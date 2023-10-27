 import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";

function Admin() {
  const appState = useContext(StateContext);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${appState.user.token}`,
          },
        };

        const response = await Axios.get("/users/all", config);
        const usersData = response.data;
        setAllUsers(usersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (event, user) => {
    const updatedUsers = allUsers.map( u => {
      if (u._id === user._id) {
        return {
          ...u,
          role: event.target.value,
        };
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };

  const handleAttributeEditingChange = (event, user) => {
    const updatedUsers = allUsers.map(u => {
      if (u._id === user._id) {
        return {
          ...u,
          attributeEditing: event.target.value.split(",").map((value) => value.trim()),
        };
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };

  const handleUsernameChange = (event, user) => {
    const updatedUsers = allUsers.map((u) => {
      if (u._id === user._id) {
        return {
          ...u,
          username: event.target.value,
        };
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };
const  handleUnitChange = (event, user) => {
    const updatedUsers = allUsers.map((u) => {
      if (u._id === user._id) {
        return {
          ...u,
          unit: event.target.value,
        };
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };
 
  const handleGeometryEditingChange = (event, user) => {
      const updatedUsers = allUsers.map(u => {
      if (u._id === user._id) {
        return {
          ...u,
          geometryEditing: event.target.value.split(",").map((value) => value.trim()),
        };
      }
      return u;
    });
    setAllUsers(updatedUsers);
  };
   

  const handleSubmit = async (user) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${appState.user.token}`,
        },
      };

      await Axios.patch(`/users/${user._id}`, user, config);
       
    } catch (error) {
      console.error(error);
      // Error handling
    }
  };

  return (
    <div className="admin">
      <div className="admin-back">
        <Link to="/" className="admin-back_link">
          <span className="less-than">{"<<"}</span> Back to the main page
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Att-Editing</th>
              <th>Username</th>
              <th>Tel & Dept</th>
              <th>Geo-Editing</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="text"
                    value={user.role}
                    onChange={(event) => handleRoleChange(event, user)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={user.attributeEditing.join(", ")}
                    onChange={(event) => handleAttributeEditingChange(event, user)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={user.username}
                    onChange={(event) => handleUsernameChange(event, user)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={user.unit}
                    onChange={(event) => handleUnitChange(event, user)}
                  />
                </td>
                 <td>
                  <input
                    type="text"
                    value={user.geometryEditing.join(", ")}
                    onChange={(event) => handleGeometryEditingChange(event, user)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSubmit(user)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;