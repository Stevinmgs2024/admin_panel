import React, { useEffect, useState } from "react";
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CAlert } from "@coreui/react";
import { fetchProducts } from "../../../dataFetcher";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return <CAlert color="danger">{error}</CAlert>;
  }

  return (
    <div className="p-4">
      <h2>Products</h2>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
            <CTableHeaderCell scope="col">MSRP</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {products.map((product, index) => (
            <CTableRow key={product.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{product.name}</CTableDataCell>
              <CTableDataCell>{product.quantity}</CTableDataCell>
              <CTableDataCell>{product.msrp}</CTableDataCell>
              <CTableDataCell>{product.description}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default Products;
