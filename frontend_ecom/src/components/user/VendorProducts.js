import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '../../utils/api' // Import your API helper

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('get_vendor_products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vendor products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading vendor products...</div>;
  }

  return (
    <div className="container mt-4 pb-5">
      <h2 className="mb-4">Your Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card">
                <img src={`${BASE_URL}${product.image}`} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <h6 className="text-primary">${product.price}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
