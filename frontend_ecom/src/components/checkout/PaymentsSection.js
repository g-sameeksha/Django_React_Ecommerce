import React, { useState } from 'react'
import api from '../../utils/api'
import Spinner from '../ui/Spinner'

const PaymentsSection = () => {
  const [loading ,setLoading] = useState(false)
  const cart_code = localStorage.getItem("cart_code")

  function makepayment(){
    setLoading(true)
     api.post("initiate_paypal_payment/",{cart_code})
     .then(res=>{
      console.log(res.data)
      // window.location.href = res.data.data.link
      setLoading(false)
      if(res.data.approval_url){
          window.location.href = res.data.approval_url

      }
     })
     .catch(err=>{
      console.log(err.message)
      setLoading(false)
     })
  }

  if (loading){
    return <Spinner loading={loading}/>
  }


  return (
    <div className='col-md-4'>
        <div className='card'>
            <div className='card-header'>
                <h5>Payment Options</h5>
            
            </div>
            <div className='card-body'>
                <button className='btn btn-primary w-100 mb-3' id="payment1" onClick={makepayment}><i className='bi bi-paypal'></i>Payment 1</button>
                <button  className='btn btn-primary w-100 mb-3' id="payment1" onClick={makepayment}><i className='bi bi-credit-card'></i> Payment 2</button>

            </div>
            
        </div>
        
    </div>
  )
}

export default PaymentsSection