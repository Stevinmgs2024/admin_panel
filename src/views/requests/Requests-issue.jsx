// too many merge issues
import React, { useState, useEffect } from "react";
import {
<<<<<<< Updated upstream
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
=======
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../../config/firebase";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CToast,
  CToastBody,
  CToastHeader,
  CContainer,
  CAlert,
} from "@coreui/react";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      const quotation = await getQuotationById(request.qid);
      setSelectedRequest(request);
      setQuotationDetails(quotation);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
=======
      if (action === "accept") {
        console.log(requestId);
        await acceptRequest(requestId);
        setSuccessMessage("Request accepted successfully.");
      } else if (action === "reject") {
        await rejectRequest(requestId);
        setSuccessMessage("Request rejected successfully.");
      }
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      setError("Failed to process the request. Please try again.");
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  const handleDialogClose = () => setSelectedRequest(null);

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h4>Pending Requests</h4>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CToast>
              <CToastHeader closeButton>Request Error</CToastHeader>
              <CToastBody>{error}</CToastBody>
            </CToast>
          )}
          {successMessage && (
            <CToast>
              <CToastHeader closeButton>Success</CToastHeader>
              <CToastBody>{successMessage}</CToastBody>
            </CToast>
          )}
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Client Name</CTableHeaderCell>
                <CTableHeaderCell>Request Text</CTableHeaderCell>
>>>>>>> Stashed changes
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
<<<<<<< Updated upstream
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
=======
              {requests.map((req) => (
                <CTableRow key={req.id}>
                  <CTableDataCell>{req.clientname}</CTableDataCell>
                  <CTableDataCell>
                    {req.requestText.length > 50
                      ? `${req.requestText.substring(0, 50)}...`
                      : req.requestText}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      onClick={() => setSelectedRequest(req)}
                    >
                      View
                    </CButton>
                    <CButton
                      color="success"
                      onClick={() => openConfirmDialog("accept", req.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Accept
                    </CButton>
                    <CButton
                      color="danger"
                      onClick={() => openConfirmDialog("reject", req.id)}
                      style={{ marginLeft: "10px" }}
                    >
>>>>>>> Stashed changes
                      Reject
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
<<<<<<< Updated upstream
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
            <h6>Products</h6>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {quotationDetails.products.map((product, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.price}</CTableDataCell>
                    <CTableDataCell>{product.quantity}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <h6>Uploaded Images</h6>
            <div>
              {quotationDetails.uploadedImages?.map((url, index) => (
                <CImage key={index} src={url} alt="Uploaded" className="img-thumbnail me-2" width={100} />
              ))}
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
=======

          {/* View Request Modal */}
          {selectedRequest && (
            <CModal
              visible={Boolean(selectedRequest)}
              onClose={handleDialogClose}
            >
              <CModalHeader closeButton>
                Request Details
              </CModalHeader>
              <CModalBody>
                <p>
                  <strong>Client Name:</strong> {selectedRequest.clientname}
                </p>
                <p>
                  <strong>Request Text:</strong> {selectedRequest.requestText}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRequest.status}
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={handleDialogClose}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
          )}

          {/* Confirm Action Modal */}
          {confirmDialog.open && (
            <CModal visible={confirmDialog.open} onClose={handleCloseDialog}>
              <CModalHeader closeButton>Confirm Action</CModalHeader>
              <CModalBody>
                <p>
                  Are you sure you want to {confirmDialog.action} this request?
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseDialog}>
                  Cancel
                </CButton>
                <CButton
                  color="primary"
                  onClick={() =>
                    handleAction(confirmDialog.action, confirmDialog.requestId)
                  }
                >
                  Confirm
                </CButton>
              </CModalFooter>
            </CModal>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
>>>>>>> Stashed changes
  );
};

export default Requests;
