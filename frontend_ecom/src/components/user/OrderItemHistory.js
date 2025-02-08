import React from 'react'
import { BASE_URL } from '../../utils/api'
import { DateFormattor } from '../../utils/DateFormattor'

const OrderItemHistory = ({item}) => {
  return (
    <div className='card-body'>
         <div className='d-flex justify-content-between align-items-center mb-3 border-bottom pb-2'>
                <div className='d-flex align-items-center '>
                    <img
                          src={`${BASE_URL}${item.product.image}`}
                          alt={item.product.name}
                          className="img-fluid rounded"
                          style={{ height: "80px", width: "80px", objectFit: "cover" }}
                        />
                    <div className='ms-3 '>
                        <h6 className='mb-0'> Product name:{item.product.name}</h6>
                        <small>Order ID: {item.order_id}</small><br></br>
                        <small>Order Date:{DateFormattor(item.order_date)}</small> <br></br>
                        <small>Quantity: {item.quantity}</small>
        
                    </div>
                </div>    
                <h6>{`$${item.product.price}`}</h6>
            </div>
    </div>
  )
}

export default OrderItemHistory