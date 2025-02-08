import React from 'react'
import { useState, useEffect } from 'react'
import api from './api'

function UseCartData() {
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0.00)
  const [loading, setloading] = useState(false)

  const tax = 4.00

  const cart_code = localStorage.getItem("cart_code")


  useEffect(function () {
    setloading(true)

    api.get(`get_cart?cart_code=${cart_code}`)
      .then(res => {
        console.log(res.data)
        setCartItems(res.data.items)
        setCartTotal(res.data.sum_total)
        setloading(false)
      })
      .catch(err => {
        console.log(err.message)
        setloading(false)

      })
  }, [])

  return {
    cartItems, setCartItems,
    cartTotal, setCartTotal,
    loading, tax
  }

}

export default UseCartData