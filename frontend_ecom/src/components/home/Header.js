import React from "react";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="py-5" style={{ backgroundColor: "#6050DC" }}>
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bold">Welcome to your Favourite Shop</h1>
          <p className="lead fw-normal text-white-75 mb-4">
            Discover the latest trends
          </p>

          {/* Search Bar */}
          <div className="d-flex justify-content-center mb-4">
            <input
              type="text"
              className="form-control w-50 rounded-pill px-3 py-2"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <a href="#shop" className="btn btn-light btn-lg rounded-pill px-4 py-2">
            Shop now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
