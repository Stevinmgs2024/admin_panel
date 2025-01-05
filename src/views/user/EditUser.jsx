import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CForm, CFormInput, CFormLabel, CFormSelect, CButton, CSpinner, CAlert } from '@coreui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {
  const { userId } = useParams();  // Get the userId from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(true);  // Initially loading data
  const [error, setError] = useState('');

  // Fetch existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await window.electron.invoke('get-user', userId);
        console.log(user);
        setFormData(user);
        setLoading(false);  // Data loaded
      } catch (err) {
        setError('Failed to load user details.');
        setLoading(false);  // Stop loading on error
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { displayName, email, password, confirmPassword, role } = formData;
    console.log("R:", role);

    // Basic validation
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (password && password.length < 6) {
      setError('Password length should be at least 6.');
      toast.error("Password length should be at least 6.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setError('');
    setLoading(true);

    // Only pass password if it's set (to avoid updating with an empty password if not required)
    const dataToSubmit = {
      uid: userId,
      displayName,
      email,
      role,
      password: password || undefined,  // Only include password if it's not empty
    };

    try {
      console.log("Submitting:", dataToSubmit);
      await window.electron.invoke('update-user', dataToSubmit);  // Assuming updateUser is the function for updating user data
      toast.success("User updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to users page after success
      setTimeout(() => {
        navigate('/users');  // Redirect to the users list page
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Failed to update user. Please try again.');
      toast.error("Failed to update user. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  return (
    <div className="p-4">
      <h2>Edit User</h2>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CForm onSubmit={handleSubmit}>
        <CFormLabel htmlFor="name">Name</CFormLabel>
        <CFormInput
          type="text"
          id="name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          required
        />

        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <CFormLabel htmlFor="password">Password</CFormLabel>
        <CFormInput
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
        <CFormInput
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <CFormLabel htmlFor="role">Role</CFormLabel>
        <CFormSelect
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="quotation-team">Quotation Team</option>
          <option value="admin">Admin</option>
        </CFormSelect>

        <CButton type="submit" color="primary" className="mt-3">
          Save Changes
        </CButton>
        <CButton
          color="secondary"
          className="mt-3 ms-2"
          onClick={() => navigate('/users')}
        >
          Back to Users
        </CButton>
      </CForm>
    </div>
  );
};

export default EditUser;
