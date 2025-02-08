import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/api";

const PaymentStatusPage = ({ setNumCartItem }) => {
  const [statusMessage, setStatusMessage] = useState("Verifying Your Payment!");
  const [statusSubMessage, setStatusSubMessage] = useState(
    "Please give us a moment while we verify your payment."
  );

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get("paymentStatus");
    const ref = queryParams.get("ref");

    if (paymentStatus && ref) {
      // Simulate payment verification delay
      setTimeout(() => {
        api
          .post(`paypal_payment_callback/?paymentStatus=${paymentStatus}&ref=${ref}`)
          .then((res) => {
            setStatusMessage(res.data.message);
            setStatusSubMessage(res.data.subMessage); // Match backend key
            if (paymentStatus === "success") {
              setNumCartItem(0);
              localStorage.removeItem("cart_code");
            }
          })
          .catch((err) => {
            console.error(err.message);
            setStatusMessage("Payment Verification Failed!");
            setStatusSubMessage(
              "Something went wrong while verifying your payment. Please try again."
            );
          });
      }, 3000); // 3-second delay
    } else {
      setTimeout(() => {
        setStatusMessage("Invalid Payment Details");
        setStatusSubMessage("No valid payment details were provided.");
      }, 3000); // 3-second delay
    }
  }, [location.search, setNumCartItem]);

  return (
    <div className="container text-center my-5 w-50">
      <div className="card shadow-sm p-4">
        <h2
          className="text-white mb-3 p-2 border"
          style={{
            backgroundColor: "#6050DC",
            color: "white",
            borderRadius: "10px",
          }}
        >
          {statusMessage}
        </h2>
        <p className="text-muted">{statusSubMessage}</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link
            to="/profile"
            className="btn"
            style={{ color: "#6050DC", border: "1px solid #6050DC" }}
          >
            View Order Details
          </Link>
          <Link
            to="/"
            className="btn"
            style={{ backgroundColor: "#6050DC", color: "white" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
