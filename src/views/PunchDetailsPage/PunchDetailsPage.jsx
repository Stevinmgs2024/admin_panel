import React, { useState, useEffect } from 'react';
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
import { CChartBar } from '@coreui/react-chartjs';
import { fetchPunchRecords, calculatePunchStatistics } from '../../config/firebase';
import { CIcon } from '@coreui/icons-react';
import {
  cilGroup,
  cilClock,
  cilCheckCircle,
  cilWarning,
  cilAvTimer,
  cilChevronDoubleDown,
} from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';

const PunchDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPunches: 0,
    onTime: 0,
    late: 0,
    averageWorkHours: 0,
    earlyDepartures: 0,
    missingPunchOut: 0,
  });

  // Fetch records and calculate statistics
  const fetchRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const fetchedRecords = await fetchPunchRecords();
      setRecords(fetchedRecords);

      const calculatedStats = calculatePunchStatistics(fetchedRecords);
      setStats(calculatedStats);
    } catch (err) {
      setError('Failed to fetch punch records: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(); // Fetch records on component mount
  }, []);

  // Render icons for stat cards
  const getIcon = (name) => {
    switch (name) {
      case 'Total Employees':
        return <CIcon icon={cilGroup} size="lg" className="text-primary" />;
      case 'Total Punches':
        return <CIcon icon={cilClock} size="lg" className="text-secondary" />;
      case 'On-Time':
        return <CIcon icon={cilCheckCircle} size="lg" className="text-success" />;
      case 'Late':
        return <CIcon icon={cilWarning} size="lg" className="text-danger" />;
      case 'Avg. Work Hours':
        return <CIcon icon={cilAvTimer} size="lg" className="text-info" />;
      case 'Early Departures':
        return <CIcon icon={cilChevronDoubleDown} size="lg" className="text-warning" />;
      default:
        return null;
    }
  };

  // Cards to display key statistics
  const statCards = [
    { title: 'Total Employees', value: stats.totalEmployees },
    { title: 'Total Punches', value: stats.totalPunches },
    { title: 'On-Time', value: stats.onTime },
    { title: 'Late', value: stats.late },
    { title: 'Avg. Work Hours', value: stats.averageWorkHours },
    { title: 'Early Departures', value: stats.earlyDepartures },
  ];

  // Data for the attendance overview chart
  const chartData = {
    labels: ['On Time', 'Late', 'Early Departures', 'Missing Punch Out'],
    datasets: [
      {
        label: 'Punch Statistics',
        backgroundColor: ['#4caf50', '#f44336', '#ffc107', '#03a9f4'],
        data: [stats.onTime, stats.late, stats.earlyDepartures, stats.missingPunchOut],
      },
    ],
  };

  return (
    <CRow className="g-4">
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <h4>Punch Details Dashboard</h4>
          </CCardHeader>
          <CCardBody>
            {loading && <CSpinner size="sm" />}
            {error && <CAlert color="danger">{error}</CAlert>}

            <CRow className="mb-4">
              <CCol xs={12}>
                <CRow className="mb-3">
                  {statCards.map((stat, index) => (
                    <CCol xs="12" sm="6" md="4" key={index}>
                      <CCard className="h-100">
                        <CCardBody className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-secondary">{stat.title}</h6>
                            <h4 className="font-weight-bold">{stat.value}</h4>
                          </div>
                          <div className="icon-wrapper">{getIcon(stat.title)}</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>

                <CCard>
                  <CCardBody>
                    <h5>Attendance Overview</h5>
                    <CChartBar data={chartData} labels="Punch Statistics" />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol xs={12}>
                <CCard>
                  <CCardBody>
                    <h5>Punch Records</h5>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Employee Email</CTableHeaderCell>
                          <CTableHeaderCell>Punch In</CTableHeaderCell>
                          <CTableHeaderCell>Punch Out</CTableHeaderCell>
                          <CTableHeaderCell>Location</CTableHeaderCell>
                          <CTableHeaderCell>Photo</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {records.map((record, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{record.userEmail}</CTableDataCell>
                            <CTableDataCell>{new Date(record.punchInTime).toLocaleString()}</CTableDataCell>
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
                            <CTableDataCell>
                              {record.photoUrl && (
                                <img
                                  src={record.photoUrl}
                                  alt="Punch-in photo"
                                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                                />
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PunchDetailsPage;
