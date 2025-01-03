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
  getQuotationById,
  updateRequest,
  updateQuotation,
} from "../../config/firebase";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getPendingRequests();
      setRequests(data);
    };
    fetchRequests();
  }, []);

  const handleDescription = async (request) => {
    try {
      const quotation = await getQuotationById(request.qid);
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
    setRequests(data);
  };

  return (
    <div>
      <CCard>
        <CCardHeader>Pending Requests</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>User ID</CTableHeaderCell>
                <CTableHeaderCell>Client Name</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {requests.map((request, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{request.userid}</CTableDataCell>
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
            <h5>Request Text</h5>
            <p>{selectedRequest.request}</p>
            <h5>Client Details</h5>
            <CImage
              src={quotationDetails.clientDetails?.profileImage}
              alt="Profile"
              className="rounded-circle mb-3"
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
            <p>
              <strong>Name:</strong> {quotationDetails.clientDetails?.name}
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
            {/*code to show quotation product details should go here*/}
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
