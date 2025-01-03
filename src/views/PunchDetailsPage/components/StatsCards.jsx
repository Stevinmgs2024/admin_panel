import React from 'react';
import { CRow, CCol, CCard, CCardBody } from '@coreui/react';
import { 
  cilPeople, 
  cilAvTimer,
  cilWarning,
  cilSpeedometer 
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const StatsCard = ({ title, value, icon, color }) => (
  <CCard className="mb-4">
    <CCardBody className="p-3 d-flex justify-content-between align-items-center">
      <div>
        <div className={`text-medium-emphasis small text-uppercase fw-semibold`}>{title}</div>
        <div className={`fs-4 fw-semibold text-${color}`}>{value}</div>
      </div>
      <CIcon icon={icon} size="xl" className={`text-${color}`} />
    </CCardBody>
  </CCard>
);

const StatsCards = ({ stats }) => {
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={cilPeople}
          color="primary"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsCard
          title="Total Punches"
          value={stats.totalPunches}
          icon={cilSpeedometer}
          color="info"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsCard
          title="On Time"
          value={`${stats.onTime} (${stats.averageTime}%)`}
          icon={cilAvTimer}
          color="success"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsCard
          title="Late Arrivals"
          value={stats.late}
          icon={cilWarning}
          color="danger"
        />
      </CCol>
    </CRow>
  );
};

export default StatsCards;