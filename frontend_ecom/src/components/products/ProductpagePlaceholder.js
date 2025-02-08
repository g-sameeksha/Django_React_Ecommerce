import React from 'react'

const ProductpagePlaceholder = () => {
  return (
    <>
         
    <section className='py-5 ms-'  style={{ backgroundColor: "#f8f9fa" }}>
       
    <div className='container px-4 px-lg-5 my-5 '>
      <div className='row gx-4 gx-lg-5 align-items-center '>
        {/* Product Image */}
        <div className='col-md-6  placeholder-glow'>
          <img
            className='img-fluid rounded mb-5 mb-md-0 placeholder w-100'
            src=''
            alt='Product'
          />
        </div>

        {/* Product Details */}
        <div className='col-md-6 placeholder-glow'>
          <h1 className='display-5 fw-bold placeholder w-75'></h1>
          <p className='lead fw-normal text-muted mb-4 placeholder w-75'>      </p>
          <h2 className='fw-bold  placeholder w-75'></h2>

          {/* Buttons */}
          <div className='d-flex placeholder-glow'>
            <button className='btn btn-dark btn-lg rounded-pill px-4 me-3 placeholder w-75'>
          
            </button>
            <button className='btn btn-outline-dark btn-lg rounded-pill px-4 placeholder w-75'>
          
            </button>
          </div>
         
        </div>
      </div>
      </div>
  </section>
  </>
  )
}

export default ProductpagePlaceholder