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
  CFormInput,
  CButton,
} from '@coreui/react';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import { fetchPunchRecords, calculatePunchStatistics } from '../../config/firebase';
import { useLocation } from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css';

const PunchDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPunches: 0,
    onTime: 0,
    late: 0,
    averageWorkHours: 0,
    earlyDepartures: 0,
    missingPunchOut: 0,
  });

  const location = useLocation();

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedRecords = await fetchPunchRecords();
      setRecords(fetchedRecords);
      setFilteredRecords(fetchedRecords);
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
    fetchRecords();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get('email');

    if (emailFromUrl) {
      setFilterEmail(emailFromUrl);
    }
  }, [location]);

  // Filter records based on email and date range
  useEffect(() => {
    let filtered = records;

    if (filterEmail.trim() !== '') {
      filtered = filtered.filter((record) =>
        record.userEmail.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }

    if (filterDateRange.start && filterDateRange.end) {
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    setFilteredRecords(filtered);
  }, [filterEmail, filterDateRange, records]);

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

  const dailyPunchInsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Punch-ins',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return (
    <CRow>
      <CCol md={4}>
        <CRow>
          <CCol xs={12} className="mb-3">
            <CCard>
              <CCardBody>
                <h6>Total Employees</h6>
                <h4>{stats.totalEmployees}</h4>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} className="mb-3">
            <CCard>
              <CCardBody>
                <h6>Total Punches</h6>
                <h4>{stats.totalPunches}</h4>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} className="mb-3">
            <CCard>
              <CCardBody>
                <h6>On Time</h6>
                <h4>{stats.onTime}</h4>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CCard className="mb-4">
          <CCardBody>
            <h5>Attendance Overview</h5>
            <CChartBar data={chartData} labels="Punch Statistics" />
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <h5>Daily Punch-ins</h5>
            <CChartLine data={dailyPunchInsData} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={8}>
        <CCard>
          <CCardHeader>
            <h5>Punch Records</h5>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex flex-wrap gap-3 mb-3">
              <CFormInput
                type="email"
                placeholder="Filter by Employee Email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
              <div className="d-flex gap-2">
                <CFormInput
                  type="date"
                  value={filterDateRange.start}
                  onChange={(e) =>
                    setFilterDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
                <CFormInput
                  type="date"
                  value={filterDateRange.end}
                  onChange={(e) =>
                    setFilterDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
              <CButton
                color="secondary"
                onClick={() => {
                  setFilterEmail('');
                  setFilterDateRange({ start: '', end: '' });
                }}
              >
                Clear Filters
              </CButton>
            </div>
            {loading && <CSpinner />}
            {error && <CAlert color="danger">{error}</CAlert>}
            <CTable hover responsive>
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
                {filteredRecords.map((record, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{record.userEmail}</CTableDataCell>
                    <CTableDataCell>
                      {record.punchInTime
                        ? new Date(record.punchInTime).toLocaleString()
                        : 'N/A'}
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
                    <CTableDataCell>
                      {record.punchInPhoto && (
                        <img
                          src={record.punchInPhoto}
                          alt="Punch In"
                          style={{ width: 50, height: 50 }}
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
  );
};

export default PunchDetailsPage;
