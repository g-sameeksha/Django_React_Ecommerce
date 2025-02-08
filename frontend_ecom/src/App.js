import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Mainlayout from './layouts/Mainlayout'
import Homepage from "./components/home/Homepage"
import NotFound from './components/ui/NotFound'
import ProductPage from './components/products/ProductPage'
import CartPage from './components/cart/CartPage'
import api from './utils/api'
import CheckoutPage from './components/checkout/CheckoutPage'
import Loginpage from './components/user/LoginPage'
import RegisterPage from './components/user/RegisterPage'
import PrivateRoute from './components/ui/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import UserProfilePage from './components/user/UserProfilePage'
import PaymentStatusPage from './components/payment/PaymentStatusPage'
import ResetPasswordPage from './components/user/ResetPasswordPage'

const App = () => {
  const [numCartItem, setNumCartItem] = useState(0);
  const cart_code = localStorage.getItem("cart_code")

  useEffect(function () {
    if (cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
        .then(res => {
          console.log(res.data)
          setNumCartItem(res.data.num_of_items)
        })
        .catch(err => {
          console.log(err.message)
        })

    }

  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainlayout numCartItem={numCartItem} />}>
            <Route index element={<Homepage />} />
            <Route path="products/:slug" element={< ProductPage setNumCartItem={setNumCartItem} />} />
            <Route path="cart" element={<CartPage setNumCartItem={setNumCartItem} />} />
            <Route path="checkout" element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            } />
            <Route path="login" element={<Loginpage />} />
            <Route path ="reset_key" element ={<ResetPasswordPage />}/>
            <Route path="register" element={<RegisterPage />} />
            <Route path ="profile" element={<UserProfilePage/>}/>
            <Route path ="payment-status" element={<PaymentStatusPage setNumCartItem={setNumCartItem}/>}/>
            <Route path="*" element={<NotFound />} />


          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App