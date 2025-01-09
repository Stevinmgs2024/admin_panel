import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
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
  CWidgetStatsA,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
  CBadge,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import { CChartPie, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions, cilChartPie, cilSpeedometer, cilPeople, cilCart } from '@coreui/icons';
import { fetchPunchRecords, fetchQuotations, getPendingRequests, listAllProducts } from '../../config/firebase';
import { useNavigate } from 'react-router-dom'; 
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [punchRecords, setPunchRecords] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    acceptedQuotations: 0,
    pendingQuotations: 0,
    rejectedQuotations: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });

  const handleViewAllRecords = () => {
    navigate('/punch-details');
  };

  const handleViewAllQuotations = () => {
    navigate('/quotations');
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const punchData = await fetchPunchRecords();
        const quotationData = await fetchQuotations();
        const requestData = await getPendingRequests();
        const productData = await listAllProducts();

        setPunchRecords(punchData);
        setQuotations(quotationData);
        setRequests(requestData);
        setProducts(productData);

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

  const dateCounts = {};
  punchRecords.forEach((rec) => {
    const date = new Date(rec.timestamp).toLocaleDateString();
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  
  const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(b) - new Date(a));
  const sortedPunchCounts = sortedDates.map((date) => dateCounts[date]);
  
  const punchInTrendsData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Punch-Ins',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        data: sortedPunchCounts,
      },
    ],
  };

  const quotationStatusData = {
    labels: ['Accepted', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [stats.acceptedQuotations, stats.pendingQuotations, stats.rejectedQuotations],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#f57c00', '#e53935'],
      },
    ],
  };

  const StatCard = ({ title, value, color, icon, percentage }) => (
    <CWidgetStatsA
      className="mb-4"
      color={color}
      value={
        <>
          {value}{' '}
          <span className="fs-6 fw-normal">
            ({percentage}% <CIcon icon={cilArrowTop} />)
          </span>
        </>
      }
      title={title}
      action={
        <CDropdown alignment="end">
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>Action</CDropdownItem>
            <CDropdownItem>Another action</CDropdownItem>
            <CDropdownItem>Something else here...</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      }
      icon={<CIcon icon={icon} height={52} className="my-4 text-white" />}
    />
  );

  return (
    <CContainer fluid className="px-4">
      {error && <CAlert color="danger">{error}</CAlert>}
      {loading ? (
        <div className="text-center my-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <h1 className="mb-4 mt-3">Dashboard</h1>
          <CNav variant="tabs" role="tablist" className="mb-4">
            <CNavItem>
              <CNavLink
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
              >
                Detailed Reports
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="overview-tab" visible={activeTab === 'overview'}>
              <CRow>
                <CCol sm={6} lg={3}>
                  <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    color="primary"
                    icon={cilPeople}
                    percentage={(stats.totalEmployees / 100 * 100).toFixed(2)}
                  />
                </CCol>
                <CCol sm={6} lg={3}>
                  <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    color="info"
                    icon={cilCart}
                    percentage={(stats.totalProducts / 1000 * 100).toFixed(2)}
                  />
                </CCol>
                <CCol sm={6} lg={3}>
                  <StatCard
                    title="Total Quotations"
                    value={quotations.length}
                    color="warning"
                    icon={cilChartPie}
                    percentage={(quotations.length / 500 * 100).toFixed(2)}
                  />
                </CCol>
                <CCol sm={6} lg={3}>
                  <StatCard
                    title="Total Requests"
                    value={stats.totalRequests}
                    color="danger"
                    icon={cilSpeedometer}
                    percentage={(stats.totalRequests / 200 * 100).toFixed(2)}
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol xs={12} md={6}>
                  <CCard className="mb-4">
                    <CCardHeader>Quotation Status Distribution</CCardHeader>
                    <CCardBody style={{ height: '300px' }}>
                      <CChartPie
                        data={quotationStatusData}
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || '';
                                  const value = context.parsed || 0;
                                  const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                                  const percentage = ((value / total) * 100).toFixed(2);
                                  return `${label}: ${value} (${percentage}%)`;
                                },
                              },
                            },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol xs={12} md={6}>
                  <CCard className="mb-4">
                    <CCardHeader>Punch-In Trends</CCardHeader>
                    <CCardBody style={{ height: '300px' }}>
                      <CChartLine
                        data={punchInTrendsData}
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => `Punch-ins: ${context.parsed.y}`,
                              },
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                drawOnChartArea: false,
                              },
                              ticks: {
                                maxTicksLimit: 7,
                                callback: (value, index) => {
                                  if (index % 2 === 0) return sortedDates[index];
                                  return '';
                                },
                              },
                            },
                            y: {
                              beginAtZero: true,
                              max: Math.max(...sortedPunchCounts) + 5,
                              ticks: {
                                maxTicksLimit: 5,
                                stepSize: Math.ceil(Math.max(...sortedPunchCounts) / 5),
                              },
                            },
                          },
                          elements: {
                            line: {
                              tension: 0.4,
                            },
                            point: {
                              radius: 0,
                              hitRadius: 10,
                              hoverRadius: 4,
                              hoverBorderWidth: 3,
                            },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>

            <CTabPane role="tabpanel" aria-labelledby="details-tab" visible={activeTab === 'details'}>
              <CRow>
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>Employee Punch Records</strong>
                      <small className="ms-2">(Last 5 entries)</small>
                    </CCardHeader>
                    <CCardBody>
                      <CTable hover responsive className="mb-0 border">
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Punch In</CTableHeaderCell>
                            <CTableHeaderCell>Punch Out</CTableHeaderCell>
                            <CTableHeaderCell>Location</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {punchRecords.slice(0, 5).map((record, index) => (
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
                    <CCardFooter className="text-center">
                      <CButton color="primary" size="sm" onClick={handleViewAllRecords}>View All Records</CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>Quotations</strong>
                      <small className="ms-2">(Last 5 entries)</small>
                    </CCardHeader>
                    <CCardBody>
                      <CTable hover responsive className="mb-0 border">
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Client Name</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Visits</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {quotations.slice(0, 5).map((quotation, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{quotation.clientDetails?.name}</CTableDataCell>
                              <CTableDataCell>{quotation.clientDetails?.email}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={quotation.status === 'accepted' ? 'success' : quotation.status === 'pending' ? 'warning' : 'danger'}>
                                  {quotation.status}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>{quotation.clientDetails?.visits}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                    <CCardFooter className="text-center">
                      <CButton color="primary" size="sm" onClick={handleViewAllQuotations}>View All Quotations</CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <strong>Products</strong>
                      <small className="ms-2">(Top 5 by quantity)</small>
                    </CCardHeader>
                    <CCardBody>
                      <CTable hover responsive className="mb-0 border">
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Price</CTableHeaderCell>
                            <CTableHeaderCell>Quantity</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {products
                            .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
                            .slice(0, 5)
                            .map((product, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{product?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                  {product?.price !== undefined ? `$${Number(product.price).toFixed(2)}` : 'N/A'}
                                </CTableDataCell>
                                <CTableDataCell>{product?.quantity || 'N/A'}</CTableDataCell>
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                    <CCardFooter className="text-center">
                      <CButton color="primary" size="sm" onClick={handleViewAllProducts}>View All Products</CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </>
      )}
    </CContainer>
  );
};

export default Dashboard;

