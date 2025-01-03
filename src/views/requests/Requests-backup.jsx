import React, { useEffect, useState } from "react";
import {
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
} from "./RequestsBack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    requestId: null,
  });

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchPendingRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to load requests. Please try again.");
      }
    };

    loadRequests();
  }, []);

  const handleAction = async (action, requestId) => {
    try {
      if (action === "accept") {
        await acceptRequest(requestId);
        setSuccessMessage("Request accepted successfully.");
      } else if (action === "reject") {
        await rejectRequest(requestId);
        setSuccessMessage("Request rejected successfully.");
      }
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      setError("Failed to process the request. Please try again.");
    }
    setConfirmDialog({ open: false, action: null, requestId: null });
  };

  const openConfirmDialog = (action, requestId) => {
    setConfirmDialog({ open: true, action, requestId });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, action: null, requestId: null });
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setError("");
  };

  const handleDialogClose = () => setSelectedRequest(null);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" align="center" style={{ margin: "20px 0" }}>
        Pending Requests
      </Typography>
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client Name</TableCell>
            <TableCell>Request Text</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.clientname}</TableCell>
              <TableCell>
                {req.requestText.length > 50
                  ? `${req.requestText.substring(0, 50)}...`
                  : req.requestText}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedRequest(req)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => openConfirmDialog("accept", req.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openConfirmDialog("reject", req.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRequest && (
        <Dialog open={Boolean(selectedRequest)} onClose={handleDialogClose}>
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              Client Name: {selectedRequest.clientname}
            </Typography>
            <Typography>Request Text: {selectedRequest.requestText}</Typography>
            <Typography>Status: {selectedRequest.status}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {confirmDialog.open && (
        <Dialog open={confirmDialog.open} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {confirmDialog.action} this request?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleAction(confirmDialog.action, confirmDialog.requestId)
              }
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </TableContainer>
  );
};

export default RequestPage;
