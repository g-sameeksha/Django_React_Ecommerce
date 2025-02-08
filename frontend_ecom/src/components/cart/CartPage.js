import React from "react";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import Spinner from "../ui/Spinner";
import UseCartData from "../../utils/UseCartData";

const CartPage = ({setNumCartItem}) => {

    const {cartItems,setCartItems,cartTotal,setCartTotal,loading,tax} = UseCartData()


   
    if (loading){
      return <Spinner loading={loading}/>
    }

   
    if (cartItems.length <1){
        return <div className="alert alert-primary my-5 text-center" role="alert">
                  You haven't added any item to your cart yet
               </div>
    }
   

    return (
      <div className="container my-5">
      <div className="row g-4">
        {/* Cart Items Section */}
        <div className="col-md-7 bg-white rounded shadow-sm p-4">
          <h3 className="fw-bold mb-4">Your Cart</h3>
            {cartItems.map((item) => (
              <CartItems
                key={item.id}
                item={item}
                cartItems={cartItems}
                setCartItems={setCartItems}
                setCartTotal={setCartTotal}
                setNumCartItem={setNumCartItem}
              />
            ))}
          
        </div>

        {/* Cart Summary Section */}
        <div className="col-md-5 m-auto">
          <CartSummary cartTotal={cartTotal} tax={tax}  />
        </div>
      </div>
    </div>
  );
};
  
  export default CartPage;
  