import emailService from "@/services/api/emailService";

class GradeService {
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
          { "field": { "Name": "subject" } },
          { "field": { "Name": "assignment_name" } },
          { "field": { "Name": "score" } },
          { "field": { "Name": "max_score" } },
          { "field": { "Name": "weight" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "student_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("grade", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { "field": { "Name": "subject" } },
          { "field": { "Name": "assignment_name" } },
          { "field": { "Name": "score" } },
          { "field": { "Name": "max_score" } },
          { "field": { "Name": "weight" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "student_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById("grade", id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.Name || `${gradeData.subject} - ${gradeData.assignment_name}`,
          subject: gradeData.subject,
          assignment_name: gradeData.assignment_name,
          score: gradeData.score,
          max_score: gradeData.max_score,
          weight: gradeData.weight,
          date: gradeData.date,
          type: gradeData.type,
          student_id: parseInt(gradeData.student_id)
        }]
      };

      const response = await this.apperClient.createRecord("grade", params);
      
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
          const newGrade = successfulRecords[0].data;
          // Trigger email notification for new grade
          try {
            await emailService.triggerGradeNotification(newGrade);
          } catch (error) {
            console.error("Failed to trigger grade notification:", error);
          }
          return newGrade;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: gradeData.Name || `${gradeData.subject} - ${gradeData.assignment_name}`,
          subject: gradeData.subject,
          assignment_name: gradeData.assignment_name,
          score: gradeData.score,
          max_score: gradeData.max_score,
          weight: gradeData.weight,
          date: gradeData.date,
          type: gradeData.type,
          student_id: parseInt(gradeData.student_id)
        }]
      };

      const response = await this.apperClient.updateRecord("grade", params);
      
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
          const updatedGrade = successfulRecords[0].data;
          // Trigger email notification for grade update
          try {
            await emailService.triggerGradeNotification(updatedGrade);
          } catch (error) {
            console.error("Failed to trigger grade notification:", error);
          }
          return updatedGrade;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("grade", params);
      
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
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new GradeService();