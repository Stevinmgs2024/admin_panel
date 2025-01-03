import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CSpinner, CAlert } from "@coreui/react";
import { fetchUsers, fetchUserRole } from "../../../dataFetcher";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();  // Initialize the navigate hook

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await fetchUsers();
        const fetchedRoles = await Promise.all(
          fetchedUsers.map((user) => fetchUserRole(user.uid))
        );

        setUsers(fetchedUsers || []); // Fallback to empty array if null
        setRoles(fetchedRoles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDescription = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const openEdit = (userId) => {
    console.log(userId);
    navigate(`/users/edit/${userId}`);
  };

  const addUser = () => {
    navigate('/users/add');  // Navigate to the '/add-user' route
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <span>Users List</span>
            <CButton color="primary" onClick={addUser}>  {/* Add User Button */}
              Add User
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
                    <CTableHeaderCell>Sl. No</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                    <CTableHeaderCell>Update</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <React.Fragment key={user.uid}>
                      <CTableRow>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{user.displayName}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{roles[index]}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => toggleDescription(user.uid)}
                          >
                            {expandedUser === user.uid ? "Hide" : "Show"} Password Hash
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton color="info" size="sm" onClick={() => openEdit(user.uid)}>
                            Update
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                      {expandedUser === user.uid && (
                        <CTableRow>
                          <CTableDataCell colSpan="6">
                            <strong>Password Hash:</strong> {user.passwordHash}
                          </CTableDataCell>
                        </CTableRow>
                      )}
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

export default Users;
