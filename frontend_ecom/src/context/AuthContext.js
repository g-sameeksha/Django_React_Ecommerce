import { Children, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(false)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user,setUser] = useState("")
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

  const getUserProfile = async () => {
    try {
      const res = await api.get("get_userprofile");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); 
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };



 

  useEffect(function () {
    handleAuth()
    if(isAuthenticated){
      getUserProfile()
    }
  }, [])


  const login = async (username, password, userType) => {
    try {
      const res = await api.post("login/", { username, password, userType });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("usertype", res.data.userType);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      await getUserProfile();
      return res.data.userType; // Return user type for navigation in Loginpage
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  function handleLogout(){
    localStorage.removeItem("access")
    setIsAuthenticated(false)
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
   
    setUser(null)
    
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);


  const authVAlue = {
    isAuthenticated, setIsAuthenticated,getUserProfile,username,user,handleLogout,login
  }


  return <AuthContext.Provider value={authVAlue}>
    {children}
  </AuthContext.Provider>
}

