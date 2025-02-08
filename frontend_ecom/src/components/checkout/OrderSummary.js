import React from 'react'
import OrderItem from './OrderItem'

const OrderSummary = ({cartItems,cartTotal,tax}) => {
   
  console.log(cartItems)  
  return (
    <div className="col-md-8">
        <div className={`card mb-4`}>
            <div className='card-header'>
                <h5>Order Summary</h5>
            </div>
            <div className='card-body'>
                <div className='px-3' style={{height:"300px",overflow:"auto"}}>

                    {cartItems.map(cartitem => <OrderItem item={cartitem} key={cartitem.id} />)}
                </div>
                <hr></hr>
                <div className='px-3 d-flex justify-content-between'>
                    <h6>Total amount to be paid :</h6>
                    <h6>{`$${(cartTotal+tax).toFixed(2)}`}</h6>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default OrderSummary