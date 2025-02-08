import React from 'react'
import {BASE_URL} from '../../utils/api'

const OrderItem = ({item}) => {
  console.log(item)
  return (
    <div className='d-flex justify-content-between align-items-center mb-3'>
        <div className='d-flex align-items-center'>
            <img
                  src={`${BASE_URL}${item.product.image}`}
                  alt={item.product.name}
                  className="img-fluid rounded"
                  style={{ height: "80px", width: "80px", objectFit: "cover" }}
                />
            <div className='ms-3'>
                <h6 className='mb-0'> Product name: {item.product.name}</h6>
                <small>Quantity: {item.quantity}</small>

            </div>
        </div>    
        <h6>{`$${item.total_price.toFixed(2)}`}</h6>
    </div>
  )
}

export default OrderItem