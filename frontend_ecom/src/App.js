import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mainlayout from "./layouts/Mainlayout";
import Homepage from "./components/home/Homepage";
import NotFound from "./components/ui/NotFound";
import ProductPage from "./components/products/ProductPage";
import CartPage from "./components/cart/CartPage";
import api from "./utils/api";
import CheckoutPage from "./components/checkout/CheckoutPage";
import LoginPage from "./components/user/LoginPage";
import RegisterPage from "./components/user/RegisterPage";
import PrivateRoute from "./components/ui/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import UserProfilePage from "./components/user/UserProfilePage";
import PaymentStatusPage from "./components/payment/PaymentStatusPage";
import ResetPasswordPage from "./components/user/ResetPasswordPage";
import VendorDashboard from "./components/vendor/VendorDashboard";
import AddProductForm from "./components/vendor/AddProductForm";
import VendorProducts from "./components/user/VendorProducts";

const App = () => {
  const [numCartItem, setNumCartItem] = useState(0);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(() => {
    if (cart_code) {
      api
        .get(`get_cart_stat?cart_code=${cart_code}`)
        .then((res) => {
          console.log(res.data);
          setNumCartItem(res.data.num_of_items);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainlayout numCartItem={numCartItem} />}>
            <Route index element={<Homepage />} />
            <Route path="products/:slug" element={<ProductPage setNumCartItem={setNumCartItem} />} />
            <Route path="cart" element={<CartPage setNumCartItem={setNumCartItem} />} />
            <Route
              path="checkout"
              element={<PrivateRoute element={<CheckoutPage />} allowedRoles={["customer"]} />}
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="reset_key" element={<ResetPasswordPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="payment-status" element={<PaymentStatusPage setNumCartItem={setNumCartItem} />} />
            <Route path="*" element={<NotFound />} />

            {/* Vendor Routes */}
            <Route
              path="vendor_dashboard"
              element={<PrivateRoute element={<VendorDashboard />} allowedRoles={["vendor"]} />}
            />
            <Route
              path="add_product"
              element={<PrivateRoute element={<AddProductForm />} allowedRoles={["vendor"]} />}
            />
            
         
          </Route>
         
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
