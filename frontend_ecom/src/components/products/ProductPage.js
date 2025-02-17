import React, { useEffect, useState } from 'react'
import ProductpagePlaceholder from './ProductpagePlaceholder'
import RelatedProducts from './RelatedProducts'
import { useParams } from 'react-router-dom'
import api, { BASE_URL } from '../../utils/api'
import { toast } from "react-toastify"

const ProductPage = ({ setNumCartItem }) => {
  
    const { slug } = useParams()
    const [product, setProduct] = useState({})
    const [similarProducts, setSimilarProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [inCart, setIncart] = useState(false)
    
    const cart_code = localStorage.getItem("cart_code")
    const userType = localStorage.getItem("userType")

    const newItem = { cart_code: cart_code, product_id: product.id }

    function add_to_cart() {
        api.post("add_cart", newItem)
            .then(res => {
                console.log(res.data)
                setIncart(true)
                setNumCartItem(curr => curr + 1)
                toast.success("Item added to cart successfully")
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    useEffect(() => {
        if (product.id) {
            api.get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
                .then(res => {
                    setIncart(res.data.product_in_cart)
                    console.log(res.data)
                })
                .catch(error => {
                    console.log(error.message)
                    setLoading(false)
                })
        }
    }, [cart_code, product.id])

    useEffect(() => {
        setLoading(true)
        api.get(`product_detail/${slug}`)
            .then(response => {
                console.log(response.data)
                setProduct(response.data)
                setSimilarProducts(response.data.similar_products)
                setLoading(false)
            })
            .catch(error => {
                console.log(error.message)
                setLoading(false)
            })
    }, [slug])

    if (loading) {
        return <ProductpagePlaceholder />
    }

  return (
    <>
      <section className='py-5' style={{ backgroundColor: "#f8f9fa" }}>
        <div className='container px-4 px-lg-5 my-5'>
          <div className='row gx-5 align-items-center mb-5'>
            {/* Product Image */}
            <div className='col-md-6 mb-5'>
              <img
                className='img-fluid rounded'
                src={`${BASE_URL}${product.image}`}
                alt='Product'
                style={{
                  height: '400px',
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Product Details */}
            <div className='col-md-6'>
              <h1 className='display-5 fw-bold mb-4'>{product.name}</h1>
              <p className='lead fw-normal text-muted mb-3'>
                {product.description}
              </p>
              <h2 className='fw-bold text-primary mb-3'>{`$${product.price}`}</h2>

              {/* ✅ Vendor Details Section */}
              {product.vendor_details && (
                <div className='bg-light p-3 rounded mb-4'>
                  <h5 className='fw-bold text-dark mb-2'>Sold by:</h5>
                  <p className='mb-1'><strong>Store:</strong> {product.vendor_details.username || "N/A"}</p>
                  <p className='mb-1'><strong>Location:</strong> {product.vendor_details.address}, {product.vendor_details.city}, {product.vendor_details.state}</p>
                  <p className='mb-1'><strong>Contact:</strong> {product.vendor_details.phone}</p>
                </div>
              )}

              {/* Buttons */}
              <div className='d-flex mb-5'>
                {userType === "customer" &&
                  <button className='btn btn-dark btn-lg rounded-pill px-4 me-4'
                    onClick={add_to_cart}
                    disabled={inCart}
                  >
                    {inCart ? "Product added to cart" : "Add to Cart"}
                  </button>
                }
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProducts products={similarProducts} />
        </div>
      </section>
    </>
  )
}

export default ProductPage
