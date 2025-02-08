import { Children, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";


export const AuthContext = createContext(false)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username,setUserName] = useState("")

  

  const handleAuth = () => {
    const token = localStorage.getItem("access")
    if (token) {
      const decoded = jwtDecode(token)
      const expiry_date = decoded.exp
      const current_date = Date.now() / 1000
      if (expiry_date >= current_date) {
        setIsAuthenticated(true)
      
      }

    }
  
  }

  function getUserProfile(){
    api.get("get_username")
    .then(res=>{
      setUserName(res.data.username)
    
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

  useEffect(function () {
    handleAuth()
    if(isAuthenticated){
      getUserProfile()
    }
   

  }, [])

  const authVAlue = {
    isAuthenticated, setIsAuthenticated,getUserProfile,username
  }


  return <AuthContext.Provider value={authVAlue}>
    {children}
  </AuthContext.Provider>
}

