import React from 'react'
import ProductCard from './ProductCard'

const CardContainer = ({products}) => {
  return (
    <section className='py-4' id ="shop">
        <h4 style ={{textAlign:"center"}}>Our Products</h4>
        <div className='container px-4 px-lg-5 mt- mb-5'>
            <div className='row justify-content-center'>
            
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard product={product} />

                    ))
                  ) : (
                    <h4 className="text-center alert alert-danger m-4">No products found</h4>
                  )}
            </div>
        </div>
    </section>
  )
}

export default CardContainer