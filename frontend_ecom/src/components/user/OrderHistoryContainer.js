import React from 'react'
import OrderItemHistory from './OrderItemHistory'

const OrderHistoryContainer = ({orderItems}) => {

  if(orderItems==null || orderItems.length <1){
    return <div className='row my-5'>
    <div className='col-md-12'>
        <div className='card'>
            <div className='card-header' style={{backgroundColor:"#6050DC",color:'white'}}>
                <h5>Order History</h5>
            </div>
            <p className='my-5 mx-auto'>No order History</p>
           
        </div>
            
    </div>
</div>
  }


  return (
    <div className='row my-5 pb-5'>
        <div className='col-md-12'>
            <div className='card'>
                <div className='card-header' style={{backgroundColor:"#6050DC",color:'white'}}>
                    <h5>Order History</h5>
                </div>
                <div>
                {orderItems.map(orderitem => (
                     <OrderItemHistory key={orderitem.id} item={orderitem} />
                 ))}
                </div>

               
            </div>
                
        </div>
    </div>
  )
}

export default OrderHistoryContainer