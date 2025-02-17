import React, { useEffect, useState } from "react";
import CardContainer from "./CardContainer";
import Header from "./Header";
import api from "../../utils/api";
import PlaceholderContainer from "../ui/PlaceholderContainer";
import Error from "../ui/Error";
import { randomValue } from "../../utils/GenerateCartCode";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    if (localStorage.getItem("cart_code") === null) {
      localStorage.setItem("cart_code", randomValue);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("products/")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data); // Initialize with all products
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setError(err.message);
      });
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) // Match category
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {error && <Error error={error} />}
      {loading && <PlaceholderContainer />}
      {!loading && error === "" && <CardContainer products={filteredProducts} />}
    </>
  );
};

export default Homepage;
