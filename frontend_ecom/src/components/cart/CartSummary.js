import React from "react";
import { Link } from "react-router-dom";

const CartSummary = ({ cartTotal, tax }) => {
  const total = cartTotal + tax;

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h4 className="fw-bold mb-4">Order Summary</h4>
      <div className="d-flex justify-content-between mb-2">
        <span>Subtotal:</span>
        <span className="text-muted">${cartTotal.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <span>Tax:</span>
        <span className="text-muted">${tax.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between fw-bold">
        <span>Total:</span>
        <span className="text-success">${total.toFixed(2)}</span>
      </div>
    <Link to="/checkout" >
      <button className="btn btn-dark w-100 mt-4" >
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default CartSummary;
