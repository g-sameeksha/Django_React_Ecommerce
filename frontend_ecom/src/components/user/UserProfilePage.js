import React, { useEffect, useState } from 'react'
import UserInfo from './UserInfo'
import OrderHistoryContainer from './OrderHistoryContainer'
import api from '../../utils/api'
import Spinner from '../ui/Spinner'

const UserProfilePage = () => {
    const [user,setUser] = useState({})
    const [loading,setLoading] = useState(false)
    const [orderItems ,setOrderItems] = useState([])

    useEffect(function(){
        setLoading(true)
        api.get("get_userprofile")
        .then(res=>{
            console.log(res.data)
            setUser(res.data)
            setLoading(false)
            setOrderItems(res.data.items)
            console.log(res.data.items)


        })
        .catch(err=>{
            console.log(err.message)
            setLoading(false)

        })

    },[])



    if (loading){
        return <Spinner loading={loading}/>
    }
  return (
    <div className='conatiner my-5'>
        <UserInfo user={user}/>
        <OrderHistoryContainer orderItems={orderItems}/>
    </div>

  )
}

export default UserProfilePage