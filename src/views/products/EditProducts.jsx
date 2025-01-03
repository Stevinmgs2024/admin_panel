import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CForm, CFormInput, CFormTextarea, CButton, CSpinner, CAlert } from "@coreui/react";
import { getProductById, updateProduct } from "../../config/firebase"; // Import backend functions

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    msrp: 0,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId); // Call backend function
        setFormData(product);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details.");
        setLoading(false);
      }
    };
    console.log("ijasihdiu");
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(productId, formData); // Call backend function
      navigate("/products");
    } catch (err) {
      setError("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>;
  }

  return (
    <div className="p-4">
      <h2>Edit Product</h2>
      <CForm onSubmit={handleSubmit}>
        <CFormInput
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <CFormInput
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <CFormInput
          label="MSRP"
          type="number"
          name="msrp"
          value={formData.msrp}
          onChange={handleChange}
          required
        />
        <CFormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <CButton type="submit" color="primary">
          Save Changes
        </CButton>
        <CButton color="secondary" onClick={() => navigate("/products")}>
          Back
        </CButton>
      </CForm>
    </div>
  );
};

export default EditProduct;
