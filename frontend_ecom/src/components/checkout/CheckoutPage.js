import React from 'react'
import OrderSummary from './OrderSummary'
import PaymentsSection from './PaymentsSection'
import UseCartData from '../../utils/UseCartData'

const CheckoutPage = () => {
    const {cartItems,setCartItems,cartTotal,setCartTotal,loading,tax} = UseCartData()

    
    if (cartItems.length <1){
      return <div className="alert alert-primary my-5 text-center" role="alert">
                You haven't added any item to your cart yet
             </div>
  }
 
  return (
    <div className='container my-5 p-3'>
        <div className='row'>
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} />
            <PaymentsSection/>
            
        </div>
    </div>
  )
}

export default CheckoutPage