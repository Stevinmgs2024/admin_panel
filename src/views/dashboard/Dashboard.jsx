import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CAlert,
  CSpinner,
} from '@coreui/react';
import { CChartPie, CChartLine } from '@coreui/react-chartjs';
import { fetchPunchRecords, fetchQuotations, getPendingRequests, listAllProducts } from '../../config/firebase';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [punchRecords, setPunchRecords] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    acceptedQuotations: 0,
    pendingQuotations: 0,
    rejectedQuotations: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data from Firestore
        const punchData = await fetchPunchRecords();
        const quotationData = await fetchQuotations();
        const requestData = await getPendingRequests();
        const productData = await listAllProducts();

        setPunchRecords(punchData);
        setQuotations(quotationData);
        setRequests(requestData);
        setProducts(productData);

        // Calculate stats
        const totalEmployees = new Set(punchData.map((record) => record.userId)).size;
        const totalProducts = productData.length;
        const acceptedQuotations = quotationData.filter((q) => q.status === 'accepted').length;
        const pendingQuotations = quotationData.filter((q) => q.status === 'pending').length;
        const rejectedQuotations = quotationData.filter((q) => q.status === 'rejected').length;
        const totalRequests = requestData.length;
        const pendingRequests = requestData.filter((req) => req.status === 'pending').length;

        setStats({
          totalEmployees,
          totalProducts,
          acceptedQuotations,
          pendingQuotations,
          rejectedQuotations,
          totalRequests,
          pendingRequests,
        });
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center">
          <CSpinner />
        </div>
      ) : (
        <>
          {/* Info Cards */}
          <CRow>
            <CCol xs={12} md={3}>
              <CCard className="mb-4">
                <CCardBody>
                  <h5>Total Employees</h5>
                  <p>{stats.totalEmployees}</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={3}>
              <CCard className="mb-4">
                <CCardBody>
                  <h5>Total Products</h5>
                  <p>{stats.totalProducts}</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={3}>
              <CCard className="mb-4">
                <CCardBody>
                  <h5>Total Quotations</h5>
                  <p>{quotations.length}</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={3}>
              <CCard className="mb-4">
                <CCardBody>
                  <h5>Total Requests</h5>
                  <p>{stats.totalRequests}</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Graphs */}
          <CRow>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardHeader>Quotation Status Distribution</CCardHeader>
                <CCardBody>
                  <CChartPie
                    data={{
                      labels: ['Accepted', 'Pending', 'Rejected'],
                      datasets: [
                        {
                          data: [
                            stats.acceptedQuotations,
                            stats.pendingQuotations,
                            stats.rejectedQuotations,
                          ],
                          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardHeader>Punch-In Trends</CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: punchRecords.map((rec) =>
                        new Date(rec.timestamp).toLocaleDateString()
                      ),
                      datasets: [
                        {
                          label: 'Punch-Ins',
                          backgroundColor: 'rgba(75,192,192,0.4)',
                          borderColor: 'rgba(75,192,192,1)',
                          data: punchRecords.map((rec) => rec.timestamp),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Detailed Tables */}
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Employee Punch Records</CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Punch In</CTableHeaderCell>
                        <CTableHeaderCell>Punch Out</CTableHeaderCell>
                        <CTableHeaderCell>Location</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {punchRecords.map((record, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{record.userEmail}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(record.punchInTime).toLocaleString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            {record.punchOutTime
                              ? new Date(record.punchOutTime).toLocaleString()
                              : 'Not punched out'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {record.location
                              ? `${record.location.latitude.toFixed(4)}°N, ${record.location.longitude.toFixed(4)}°E`
                              : 'N/A'}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Quotations</CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Client Name</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Visits</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {quotations.map((quotation, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{quotation.clientDetails?.name}</CTableDataCell>
                          <CTableDataCell>{quotation.clientDetails?.email}</CTableDataCell>
                          <CTableDataCell>{quotation.status}</CTableDataCell>
                          <CTableDataCell>{quotation.clientDetails?.visits}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Products (Scrollable)</CCardHeader>
                <CCardBody style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                  {products.map((product, index) => (
                    <div key={index}>
                      <strong>{product.name}</strong> - Price: {product.price}, Quantity: {product.quantity}
                    </div>
                  ))}
                </CCardBody>
              </CCard>
              {/* To remove products list, delete this entire section */}
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
};

export default Dashboard;
