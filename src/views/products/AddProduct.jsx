import React, { useState } from "react";
import { CForm, CFormInput, CFormTextarea, CButton, CRow, CCol } from "@coreui/react";
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    msrp: 0,
    description: "",
  });
  const [error, setError] = useState(""); // Used for custom error handling
  const [success, setSuccess] = useState(""); // Used for custom success handling

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electron.invoke('create-product', formData); // Assume this calls the backend to add the product
      // On success
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFormData({ name: "", quantity: 0, msrp: 0, description: "" }); // Reset form data after success
    } catch (err) {
      // On error
      setError("Failed to add product. Please try again.");
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="p-4">
      <h2>Add Product</h2>
      <CForm onSubmit={handleSubmit}>
        {/* Product Name */}
        <CFormInput
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Quantity and MSRP */}
        <CRow>
          <CCol>
            <CFormInput
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol>
            <CFormInput
              label="MSRP"
              type="number"
              name="msrp"
              value={formData.msrp}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        {/* Description */}
        <CFormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <CButton type="submit" color="primary">
          Add Product
        </CButton>
      </CForm>

      {/* Toast container to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
