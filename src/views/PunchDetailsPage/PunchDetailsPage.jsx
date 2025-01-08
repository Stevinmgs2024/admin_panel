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
import { CChartBar } from '@coreui/react-chartjs';
import { fetchPunchRecords, calculatePunchStatistics } from '../../config/firebase';
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

  // Apply filters to records
  useEffect(() => {
    let filtered = records;

    // Filter by email
    if (filterEmail.trim() !== '') {
      filtered = filtered.filter((record) =>
        record.userEmail.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }

    // Filter by date range
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
            <div className="d-flex justify-content-between align-items-center">
              <h4>Punch Details Dashboard</h4>
              <div className="d-flex flex-wrap gap-3 mt-3">
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
            </div>
          </CCardHeader>
          <CCardBody>
            {loading && (
              <div className="text-center">
                <CSpinner size="sm" />
              </div>
            )}
            {error && <CAlert color="danger">{error}</CAlert>}

            {/* Statistics Cards */}
            <CRow className="mb-3">
              <CCol xs="12" sm="6" md="4">
                <CCard>
                  <CCardBody>
                    <h6>Total Employees</h6>
                    <h4>{stats.totalEmployees}</h4>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs="12" sm="6" md="4">
                <CCard>
                  <CCardBody>
                    <h6>Total Punches</h6>
                    <h4>{stats.totalPunches}</h4>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs="12" sm="6" md="4">
                <CCard>
                  <CCardBody>
                    <h6>On Time</h6>
                    <h4>{stats.onTime}</h4>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Attendance Overview Chart */}
            <CCard className="mb-4">
              <CCardBody>
                <h5>Attendance Overview</h5>
                <CChartBar data={chartData} labels="Punch Statistics" />
              </CCardBody>
            </CCard>

            {/* Punch Records Table */}
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
                      {record.photoUrl && (
                        <img
                          src={record.photoUrl}
                          alt="Punch-in photo"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
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
