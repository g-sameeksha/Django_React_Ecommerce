import React from 'react'
import ProductCard from './ProductCard'

const CardContainer = ({products}) => {
  return (
    <section className='py-5' id ="shop">
        <h4 style ={{textAlign:"center"}}>Our Products</h4>
        <div className='container px-4 px-lg-5 mt-5'>
            <div className='row justify-content-center'>
             {
              products.map(product=>
                <ProductCard product={product} key ={product.id}/>
              )
            }

            </div>
        </div>
    </section>
  )
}

export default CardContainer