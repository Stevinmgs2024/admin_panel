import React, { useState } from "react";
//import { updateProductInDatabase } from "../ShowProducts/ShowProductsBack";
import "./EditProducts.css";


function EditProduct({ product, onSave, onCancel }) {
  const [name, setName] = useState(product.name);
  const [msrp, setMsrp] = useState(product.msrp);
  const [quantity, setQuantity] = useState(product.quantity);
  const [description, setDescription] = useState(product.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = { ...product, name, msrp, quantity, description };
    onSave(updatedProduct); // Pass updated product back to parent
  };

  return (
    <div className="edit-product-modal">
      <div className="edit-product-form">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>MSRP:</label>
            <input
              type="number"
              value={msrp}
              onChange={(e) => setMsrp(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
