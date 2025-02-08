import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/api'
import { jwtDecode } from 'jwt-decode'
import Spinner from './Spinner'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


const PrivateRoute = ({ children }) => {
    // const [isAuthorized, SetIsAuthorized] = useState(null)
    const location = useLocation()
    const {isAuthenticated} = useContext(AuthContext)

    // useEffect(function () {
    //     auth().catch(() => SetIsAuthorized(false))
    // }, [])

    // async function refreshToken() {
    //     const refreshToken = localStorage.getItem("refresh")

    //     try {
    //         const res = await api.post('/token/refresh/', { refresh: refreshToken });
    //         if (res.status === 200) {
    //             localStorage.setItem("access", res.data.access)
    //             SetIsAuthorized(true)
    //         }
    //         else {
    //             SetIsAuthorized(false)
    //         }

    //     }
    //     catch (error) {
    //         console.log(error)
    //         SetIsAuthorized(false)

    //     }

    // }

    // async function auth() {
    //     const token = localStorage.getItem("access")
    //     if (!token) {
    //         SetIsAuthorized(false)
    //         return;
    //     }
    //     const decoded = jwtDecode(token)
    //     const expiry_date = decoded.exp
    //     const current_date = Date.now() / 1000
    //     if (expiry_date > current_date) {
    //         await refreshToken()
    //     }
    //     else {
    //         SetIsAuthorized(true)
    //     }
    // }

    // if (isAuthorized === null) {
    //     return <Spinner loading={true} />
    // }
    if (isAuthenticated === false){
        return <Spinner loading={true} />

    }


    return (

        // isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />
        isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default PrivateRoute