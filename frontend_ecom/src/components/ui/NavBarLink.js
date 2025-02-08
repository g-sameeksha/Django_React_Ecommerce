import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const NavBarLink = () => {
  const {setIsAuthenticated, isAuthenticated,username } = useContext(AuthContext)

  
  function handleLogout(){
    localStorage.removeItem("access")

    setIsAuthenticated(false)
    toast.success("logged out!")
  }

  return (
    <>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0" >
        {isAuthenticated ?
          <>
            <li class="nav-item mx-2">
              <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? "nav-link active  fw-semibold " : "nav-link  "}
                end
                style={{ color: "black" }}
              >
                Hi ,{username? username:"hello"}
              </NavLink>
            </li>
            <li class="nav-item mx-2" onClick={handleLogout}>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link "}
                end
                style={{ color: "black" }}
              >
                Logout
              </NavLink>
            </li>
          </> : <>
            <li class="nav-item mx-2">
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link  "}
                end
                style={{ color: "black" }}
              >
                Login
              </NavLink>
            </li>
            <li class="nav-item mx-2">
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold " : "nav-link  "}
                end
                style={{ color: "black" }}
              >
                Register
              </NavLink>
            </li>
          </>}


      </ul>
    </>
  )
}

export default NavBarLink