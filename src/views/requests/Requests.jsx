import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CImage,
} from "@coreui/react";
import {
  getPendingRequests,
  fetchQuotationById,
  updateRequest,
  updateQuotation,
} from "../../config/firebase";

const fetchClientAndUserName = async (qid) => {
  try {
    const quotation = await fetchQuotationById(qid);
    return {
      clientName: quotation.clientDetails?.name || "N/A",
      username: quotation.username || "N/A",
    };
  } catch (error) {
    console.error(`Error fetching client and username for QID: ${qid}`, error);
    return { clientName: "N/A", username: "N/A" };
  }
};

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState(null);

  useEffect(() => {
    const fetchRequestsWithDetails = async () => {
      const data = await getPendingRequests();
      const detailedRequests = await Promise.all(
        data.map(async (request) => {
          const { clientName, username } = await fetchClientAndUserName(request.qid);
          return { ...request, clientName, username };
        })
      );
      setRequests(detailedRequests);
    };

    fetchRequestsWithDetails();
  }, []);

  const handleDescription = async (request) => {
    try {
      const quotation = await fetchQuotationById(request.qid);
      setSelectedRequest(request);
      setQuotationDetails(quotation);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
    }
  };

  const handleAccept = async (request) => {
    try {
      await updateRequest(request.id, { status: "accepted" });
      await updateQuotation(request.qid, { status: "pending" });
      alert("Request accepted successfully!");
      refreshRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (request) => {
    try {
      await updateRequest(request.id, { status: "rejected" });
      alert("Request rejected successfully!");
      refreshRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const refreshRequests = async () => {
    const data = await getPendingRequests();
    const detailedRequests = await Promise.all(
      data.map(async (request) => {
        const { clientName, username } = await fetchClientAndUserName(request.qid);
        return { ...request, clientName, username };
      })
    );
    setRequests(detailedRequests);
  };

  return (
    <div>
      <CCard>
        <CCardHeader>Pending Requests</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>Client Name</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {requests.map((request, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{request.username}</CTableDataCell>
                  <CTableDataCell>{request.clientName}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => handleDescription(request)}>
                      Description
                    </CButton>{" "}
                    <CButton color="success" onClick={() => handleAccept(request)}>
                      Accept
                    </CButton>{" "}
                    <CButton color="danger" onClick={() => handleReject(request)}>
                      Reject
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {selectedRequest && quotationDetails && (
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader>Request Details</CModalHeader>
          <CModalBody>
            <CImage
              src={quotationDetails.clientDetails?.profileImage}
              alt="Profile"
              className="rounded-circle mb-3"
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
            <p>
              <strong>Client Name:</strong> {quotationDetails.clientDetails?.name}
            </p>
            <p>
              <strong>Contact:</strong> {quotationDetails.clientDetails?.contact}
            </p>
            <p>
              <strong>Email:</strong> {quotationDetails.clientDetails?.email}
            </p>
            <p>
              <strong>Visits:</strong> {quotationDetails.clientDetails?.visits}
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
                {quotationDetails.clientDetails?.products?.map((product, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.price}</CTableDataCell>
                    <CTableDataCell>{product.quantity}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default Requests;
