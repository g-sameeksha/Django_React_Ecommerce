import React, { useState } from "react";
import api from "../../utils/api";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "ELECTRONICS",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("image", formData.image);
  
    api
      .post("/add-product/", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log("✅ Product added:", response.data);
        alert("🎉 Product added successfully!");
      })
      .catch((error) => {
        console.error("⚠️ Error adding product:", error);
        alert("⚠️ Error adding product.");
      });
  };

  return (
    <div className="container mb-5 p-5">
      <div className="card shadow m-5 p-5"> 
        <h2 className="text-center mb-4">🛍️ Add New Product</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="ELECTRONICS">Electronics</option>
              <option value="GROCERIES">Groceries</option>
              <option value="CLOTHINGS">Clothings</option>
              <option value="FURNITURE">Furniture</option>
              <option value="FOOD">Food</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Live Image Preview */}
          {previewImage && (
            <div className="text-center mb-3">
              <img
                src={previewImage}
                alt="Preview"
                className="img-fluid rounded border p-2"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Add Product
          </button> 
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;

