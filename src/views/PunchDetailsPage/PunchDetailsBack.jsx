import { db } from '../../config/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const PunchDetailsBack = {
  async getRecords({ startDate, endDate }) {
    try {
      const employeesRef = collection(db, 'employees');
      const employeeSnapshots = await getDocs(employeesRef);
      let records = [];

      for (const employeeDoc of employeeSnapshots.docs) {
        const employeeId = employeeDoc.id;
        const punchInsRef = collection(employeeDoc.ref, 'punch_ins');
        const punchSnapshots = await getDocs(punchInsRef);

        punchSnapshots.forEach((punchDoc) => {
          const punchData = punchDoc.data();
          const timestamp = punchData.timestamp?.toDate();

          if ((!startDate || timestamp >= startDate) && 
              (!endDate || timestamp <= endDate)) {
            records.push({
              employeeId,
              photoUrl: punchData.photo_url || '',
              location: punchData.location || null,
              punchInTime: punchData.punch_in_time || '',
              punchOutTime: punchData.punch_out_time || '',
              timestamp,
              userEmail: punchData.user_email || '',
            });
          }
        });
      }

      return records;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  },

  calculateStatistics(records) {
    const stats = {
      totalEmployees: new Set(records.map(r => r.employeeId)).size,
      totalPunches: records.length,
      onTime: 0,
      late: 0,
      earlyDepartures: 0,
      missingPunchOut: 0,
      averageWorkHours: 0
    };

    // Consider 9 AM as start time and 5 PM as end time
    const workStartHour = 9;
    let totalWorkHours = 0;
    let validWorkHourRecords = 0;

    records.forEach(record => {
      const punchInDate = new Date(record.punchInTime);
      
      // Check if late (after 9:15 AM)
      if (punchInDate.getHours() > workStartHour || 
          (punchInDate.getHours() === workStartHour && punchInDate.getMinutes() > 15)) {
        stats.late++;
      } else {
        stats.onTime++;
      }

      // Check punch out status
      if (!record.punchOutTime) {
        stats.missingPunchOut++;
      } else {
        const punchOutDate = new Date(record.punchOutTime);
        const workHours = (punchOutDate - punchInDate) / (1000 * 60 * 60);
        
        if (workHours < 8) {
          stats.earlyDepartures++;
        }

        totalWorkHours += workHours;
        validWorkHourRecords++;
      }
    });

    stats.averageWorkHours = validWorkHourRecords ? 
      (totalWorkHours / validWorkHourRecords).toFixed(2) : 0;

    return stats;
  }
};

export default PunchDetailsBack;