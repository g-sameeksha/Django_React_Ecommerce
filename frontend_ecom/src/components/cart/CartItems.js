import React, { useState } from "react";
import { toast } from "react-toastify";
import api,{BASE_URL} from '../../utils/api'
const CartItems = ({ item, setCartTotal, cartItems, setNumCartItem, setCartItems }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const updateCartItem = () => {
    setLoading(true);
    api
      .patch(`update_item_quantity`, { quantity, item_id: item.id })
      .then((res) => {
        const updatedItem = res.data.data;
        const updatedCart = cartItems.map((cartItem) =>
          cartItem.id === item.id ? updatedItem : cartItem
        );
        setCartTotal(updatedCart.reduce((acc, curr) => acc + curr.total_price, 0));
        setNumCartItem(updatedCart.reduce((acc, curr) => acc + curr.quantity, 0));
        setLoading(false);
        toast.success("Cart item updated successfully");
      })
      .catch((err) => {
        console.error(err.message);
        setLoading(false);
      });
  };

  const deleteCartItem = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      api
        .post("delete_cartitem", { cartitem_id: item.id })
        .then(() => {
          const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
          setCartItems(updatedCart);
          setCartTotal(updatedCart.reduce((acc, curr) => acc + curr.total_price, 0));
          setNumCartItem(updatedCart.reduce((acc, curr) => acc + curr.quantity, 0));
          toast.success(`"${item.product.name}" removed from cart`);
        })
        .catch((err) => console.error(err.message));
    }
  };

  return (
    <div className="row align-items-center mb-4 border-bottom pb-3">
      <div className="col-4 text-center">
        <img
          src={`${BASE_URL}${item.product.image}`}
          alt={item.product.name}
          className="img-fluid rounded"
          style={{ height: "80px", objectFit: "cover" }}
        />
      </div>
      <div className="col-6">
        <h6 className="text-truncate">{item.product.name}</h6>
        <p className="text-muted">${item.product.price}</p>
      </div>
      <div className="col-3 text-end d-flex align-item-center mt-2" >
        <input
          type="number"
          min="1"
          className="form-control text-center"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="col-6  col-sm-4 mt-2">
        <button
          className="btn btn-info btn-sm w-100"
          onClick={updateCartItem}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
      <div className="col-6 col-sm-4  mt-2">
        <button className="btn btn-danger btn-sm w-100" onClick={deleteCartItem}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItems;
