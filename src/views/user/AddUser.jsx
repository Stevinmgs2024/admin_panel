import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect
} from '@coreui/react';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const isElectron = !!window.electron;

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    // Check if passwords match
    if (password !== confirmPassword) {
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
    } else if (password.length < 6) {
      setError('Password length should be at least 6');
      toast.error("Password length should be at least 6.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    } else {
      setError('');

      // Show processing toast
      toast.info("Adding User...", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      try {
        if (isElectron) {
          // Use Electron's ipcRenderer to create a user
          await window.electron.invoke('create-user', { name, email, password, role });
        } else {
          // Simulating a successful user creation (web environment)
          toast.success("User added successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Reset form data after success
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user',
          });
        }, 2000); // Delay for 2 seconds before resetting form

      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <>
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add New User</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                {/* Name Field */}
                <CRow className="mb-3">
                  <CCol sm={12}>
                    <CFormLabel htmlFor="name">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      required
                    />
                  </CCol>
                </CRow>

                {/* Email Field */}
                <CRow className="mb-3">
                  <CCol sm={12}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </CCol>
                </CRow>

                {/* Password Field */}
                <CRow className="mb-3">
                  <CCol sm={12}>
                    <CFormLabel htmlFor="password">Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </CCol>
                </CRow>

                {/* Confirm Password Field */}
                <CRow className="mb-3">
                  <CCol sm={12}>
                    <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                    />
                  </CCol>
                </CRow>

                {/* Role Selection Field */}
                <CRow className="mb-3">
                  <CCol sm={12}>
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
                  </CCol>
                </CRow>

                {/* Submit Button */}
                <CButton color="primary" type="submit">
                  Add User
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Image Column */}
        <CCol xs={6} md={6} className="d-flex align-items-center justify-content-center">
          <img
            src="../public/AddUserImg.svg"  // Replace with your image URL
            alt="Add User IMG"
            style={{
              width: '50%',
              height: 'auto',
              borderRadius: '2px',
              display: 'block',
            }}
            className="responsive-img"
          />
        </CCol>
      </CRow>

      {/* Toast container to render toasts */}
      <ToastContainer />
    </>
  );
};

export default AddUser;
