import React from 'react'
import ProductCard from '../home/ProductCard'

const RelatedProducts = ({products}) => {
  return (
    <>
      <hr></hr>
     <section className='py-3 bg-light'>
        <div className='container px-4 mt-3 pg-lg-3'>
            <h2 className=' row m-3 mb-4'>Related Products</h2>
            <div className='row gx-4 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center'>
                {
                    products.map(product=><ProductCard key ={product.id} product={product}/>)
            }
            </div>
        </div>
     </section>

     </>
  )

}

export default RelatedProducts