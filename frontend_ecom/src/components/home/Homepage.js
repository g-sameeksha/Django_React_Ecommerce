import React, { useEffect, useState } from 'react'
import CardContainer from './CardContainer'
import Header from './Header'
import api from '../../utils/api'
import PlaceholderContainer from '../ui/PlaceholderContainer'
import Error from '../ui/Error'
import { randomValue } from '../../utils/GenerateCartCode'

const Homepage = () => {
    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
   

    useEffect(function(){
      if (localStorage.getItem("cart_code") === null){
        localStorage.setItem("cart_code",randomValue)
      }

    },[])


    useEffect(function(){
        setLoading(true)
        api.get("products/")
        .then(res=> {
            console.log(res.data)
            setProducts(res.data)
            setLoading(false)
            setError("")

        })
        .catch(err=>{
            console.log(err.message)
            setLoading(false)
            setError(err.message)

        })
    },[])
    


  return (
    <>
    <Header />
    {error && <Error error ={error}/>}
    {loading && <PlaceholderContainer/>}
    {loading || error!=="" || <CardContainer products={products}/>}
    
    
    </>
  )
}

export default Homepage