import emailService from "@/services/api/emailService";

class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "notes" } },
          { "field": { "Name": "student_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "notes" } },
          { "field": { "Name": "student_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById("attendance", id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance - ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status,
          notes: attendanceData.notes,
          student_id: parseInt(attendanceData.student_id)
        }]
      };

      const response = await this.apperClient.createRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const newRecord = successfulRecords[0].data;
          // Trigger email notification for absence
          if (attendanceData.status === 'absent') {
            try {
              await emailService.triggerAttendanceNotification(newRecord);
            } catch (error) {
              console.error("Failed to trigger attendance notification:", error);
            }
          }
          return newRecord;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      const oldRecord = await this.getById(id);
      
      const params = {
        records: [{
          Id: id,
          Name: attendanceData.Name || `Attendance - ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status,
          notes: attendanceData.notes,
          student_id: parseInt(attendanceData.student_id)
        }]
      };

      const response = await this.apperClient.updateRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const updatedRecord = successfulRecords[0].data;
          // Trigger email notification if status changed to absent
          if (oldRecord && oldRecord.status !== 'absent' && attendanceData.status === 'absent') {
            try {
              await emailService.triggerAttendanceNotification(updatedRecord);
            } catch (error) {
              console.error("Failed to trigger attendance notification:", error);
            }
          }
          return updatedRecord;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord("attendance", params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new AttendanceService();