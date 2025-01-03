import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CSpinner, CAlert } from "@coreui/react";
import { fetchProducts } from "../../../dataFetcher";

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products.");
      }
    };

    loadProducts();
  }, []);

  const openEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const addProduct = () => {
    navigate('/products/add');
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Products List</span>
            <CButton color="primary" onClick={addProduct}>
              Add Product
            </CButton>
          </CCardHeader>
          <CCardBody>
            {loading && (
              <div className="text-center">
                <CSpinner color="primary" />
                <span className="ms-2">Loading...</span>
              </div>
            )}
            {error && <CAlert color="danger">{error}</CAlert>}
            {!loading && (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>MSRP</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {products.map((product, index) => (
                    <React.Fragment key={product.id}>
                      <CTableRow>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>{product.quantity}</CTableDataCell>
                        <CTableDataCell>{product.msrp}</CTableDataCell>
                        <CTableDataCell>{product.description}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="info" size="sm" onClick={() => openEdit(product.id)}>
                            Update
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default Products;
