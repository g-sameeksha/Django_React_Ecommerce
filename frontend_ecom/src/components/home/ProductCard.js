import React from 'react';
import { Link } from 'react-router-dom';
import {BASE_URL} from '../../utils/api'
const ProductCard = ({ product }) => {
  return (
    <div className="col-md-3 my-4">
      <Link to={`/products/${product.slug}`} className="text-decoration-none text-dark">
        <div className="card p-3 shadow border-0 h-100 product-card">
          <div className="card-img-top text-center">
            <img
              src={`${BASE_URL}${product.image}`}
              alt="Product"
              className="img-fluid rounded"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
          <div className="card-body text-center d-flex flex-column justify-content-between">
            <h5 className="card-title mb-2">{product.name}</h5>
            <h6 className="card-subtitle text-muted">{`$${product.price}`}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
