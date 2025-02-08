import React, { useContext, useState } from 'react'
import api from '../../utils/api'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Error from '../ui/Error'
import { AuthContext } from '../../context/AuthContext'
import { useCol } from 'react-bootstrap/esm/Col'

const Loginpage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const userinfo = {
    username, password
  }

  const {setIsAuthenticated, getUserProfile} = useContext(AuthContext)




  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    api.post("token/", userinfo)
      .then(res => {
        console.log(res.data)
        localStorage.setItem("access", res.data.access)
        localStorage.setItem("refresh", res.data.refresh)
        setUserName("")
        setPassword("")

        setLoading(false)
        setError("")
        setIsAuthenticated(true)
        getUserProfile()
        const frompath = location?.state?.from.pathname || "/";
        navigate(frompath, { replace: true })
      })
      .catch(err => {
        console.log(err.message)
        setError(err.message)
        setLoading(false)

      })
  }

  return (
    <div className='login-container m-5 '>
      <div className='login-card shadow p-5'>
        {error && <Error error={error} />}
        <h2 className='login-title'>Welcome Back</h2>
        <p className='login-subtitle'>please login to your account</p>
        <form className='form' onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='username' className='form-label'>User name:</label>
            <input type="username"
              className='form-control'
              id="email"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='Enter your username...' required>

            </input>

          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>Password:</label>
            <input type="password"
              className='form-control'
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password...' required>
            </input>

          </div>
          <button type='submit' className='btn btn-primary w-100' disabled={loading}>login</button>
        </form>
        <div className='login-footer mt-3'>
          <p><a href='/reset_key'>forgot password?</a></p>
          <p>Don't have an account ? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Loginpage