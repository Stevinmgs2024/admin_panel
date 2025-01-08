import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CSpinner, CAlert } from "@coreui/react";
import { fetchUsers, fetchUserRole } from "../../../dataFetcher";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();  // Initialize the navigate hook

  // Effect to fetch user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await fetchUsers();
        const fetchedRoles = await Promise.all(
          fetchedUsers.map((user) => fetchUserRole(user.uid))
        );

        setUsers(fetchedUsers || []);
        setRoles(fetchedRoles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to navigate to the Punch Details page with email filter
  const openPunchDetails = (employeeEmail) => {
    navigate(`/punch-details?email=${employeeEmail}`);  // Pass email as query param
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Users List</span>
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
                    <CTableHeaderCell>Sl. No</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={user.uid}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{user.displayName}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{roles[index]}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => openPunchDetails(user.email)}  // Pass email to the function
                        >
                          Show Records
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
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

export default Users;
