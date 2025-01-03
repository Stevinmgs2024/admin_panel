import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CAlert,
  CImage,
} from "@coreui/react";
import {
  fetchQuotations,
  updateQuotationStatus,
  uploadQuotationPdf,
  deleteQuotation,
} from "../../config/firebase";

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const data = await fetchQuotations();
        setQuotations(data);
      } catch (err) {
        setError("Failed to load quotations.");
      }
    };
    loadQuotations();
  }, []);

  const filteredQuotations = quotations.filter(
    (q) => q.status === statusFilter
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateQuotationStatus(id, newStatus);
      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile || !selectedQuotation) return;
    try {
      const pdfUrl = URL.createObjectURL(pdfFile);
      await uploadQuotationPdf(selectedQuotation.id, pdfUrl);
      setPdfFile(null);
      setSelectedQuotation(null);
    } catch (err) {
      setError("Failed to upload PDF.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuotation(id);
      setQuotations((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError("Failed to delete quotation.");
    }
  };

  return (
    <div className="p-4">
      <h2>Quotations</h2>
      {error && <CAlert color="danger">{error}</CAlert>}
      <div className="mb-3">
        <CButton
          color={statusFilter === "pending" ? "primary" : "secondary"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </CButton>
        <CButton
          color={statusFilter === "accepted" ? "primary" : "secondary"}
          onClick={() => setStatusFilter("accepted")}
          className="ms-2"
        >
          Accepted
        </CButton>
        <CButton
          color={statusFilter === "rejected" ? "primary" : "secondary"}
          onClick={() => setStatusFilter("rejected")}
          className="ms-2"
        >
          Rejected
        </CButton>
      </div>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Client Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Visits</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredQuotations.map((q) => (
            <CTableRow key={q.id}>
              <CTableDataCell>{q.username}</CTableDataCell>
              <CTableDataCell>{q.clientDetails?.name}</CTableDataCell>
              <CTableDataCell>{q.clientDetails?.email}</CTableDataCell>
              <CTableDataCell>{q.clientDetails?.visits}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="info"
                  onClick={() => setSelectedQuotation(q)}
                >
                  View
                </CButton>
                {statusFilter === "pending" && (
                  <>
                    <CButton
                      color="success"
                      className="ms-2"
                      onClick={() => handleStatusChange(q.id, "accepted")}
                    >
                      Accept
                    </CButton>
                    <CButton
                      color="danger"
                      className="ms-2"
                      onClick={() => handleStatusChange(q.id, "rejected")}
                    >
                      Reject
                    </CButton>
                  </>
                )}
                {statusFilter === "accepted" && (
                  <>
                    <CButton
                      color="warning"
                      className="ms-2"
                      onClick={() => handleStatusChange(q.id, "pending")}
                    >
                      Move to Pending
                    </CButton>
                    <CButton
                      color="primary"
                      className="ms-2"
                      onClick={() => setSelectedQuotation(q)}
                    >
                      Upload PDF
                    </CButton>
                  </>
                )}
                {statusFilter === "rejected" && (
                  <>
                    <CButton
                      color="warning"
                      className="ms-2"
                      onClick={() => handleStatusChange(q.id, "pending")}
                    >
                      Move to Pending
                    </CButton>
                    <CButton
                      color="danger"
                      className="ms-2"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </CButton>
                  </>
                )}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal
        visible={!!selectedQuotation}
        onClose={() => setSelectedQuotation(null)}
      >
        <CModalHeader>Quotation Details</CModalHeader>
        <CModalBody>
          {selectedQuotation && (
            <>
              <CImage
                src={selectedQuotation.clientDetails?.profileImage}
                alt="Profile"
                className="rounded-circle mb-3"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
              <p>
                <strong>Client Name:</strong>{" "}
                {selectedQuotation.clientDetails?.name}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                {selectedQuotation.clientDetails?.contact}
              </p>
              <p>
                <strong>Email:</strong> {selectedQuotation.clientDetails?.email}
              </p>
              <p>
                <strong>Visits:</strong> {selectedQuotation.clientDetails?.visits}
              </p>
              <h6>Products:</h6>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedQuotation.clientDetails?.products?.map(
                    (product, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>{product.price}</CTableDataCell>
                        <CTableDataCell>{product.quantity}</CTableDataCell>
                      </CTableRow>
                    )
                  )}
                </CTableBody>
              </CTable>
              <h6>Uploaded Images:</h6>
              <div>
                {selectedQuotation.uploadedImages?.map((url, idx) => (
                  <CImage
                    key={idx}
                    src={url}
                    alt="Uploaded"
                    className="img-thumbnail me-2"
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
              <p>
                <strong>Status:</strong> {selectedQuotation.status}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSelectedQuotation(null)}>
            Close
          </CButton>
          {statusFilter === "accepted" && (
            <CButton color="primary" onClick={handlePdfUpload}>
              Upload PDF
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Quotations;
