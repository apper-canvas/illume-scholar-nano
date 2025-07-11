class StudentService {
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
          { "field": { "Name": "first_name" } },
          { "field": { "Name": "last_name" } },
          { "field": { "Name": "email" } },
          { "field": { "Name": "phone" } },
          { "field": { "Name": "grade_level" } },
          { "field": { "Name": "class_id" } },
          { "field": { "Name": "parent_name" } },
          { "field": { "Name": "parent_email" } },
          { "field": { "Name": "parent_phone" } },
          { "field": { "Name": "enrollment_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "photo_url" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("student", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
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
          { "field": { "Name": "first_name" } },
          { "field": { "Name": "last_name" } },
          { "field": { "Name": "email" } },
          { "field": { "Name": "phone" } },
          { "field": { "Name": "grade_level" } },
          { "field": { "Name": "class_id" } },
          { "field": { "Name": "parent_name" } },
          { "field": { "Name": "parent_email" } },
          { "field": { "Name": "parent_phone" } },
          { "field": { "Name": "enrollment_date" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "photo_url" } }
        ]
      };

      const response = await this.apperClient.getRecordById("student", id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          phone: studentData.phone,
          grade_level: studentData.grade_level,
          class_id: studentData.class_id,
          parent_name: studentData.parent_name,
          parent_email: studentData.parent_email,
          parent_phone: studentData.parent_phone,
          enrollment_date: studentData.enrollment_date,
          status: studentData.status,
          photo_url: studentData.photo_url || ""
        }]
      };

      const response = await this.apperClient.createRecord("student", params);
      
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
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          phone: studentData.phone,
          grade_level: studentData.grade_level,
          class_id: studentData.class_id,
          parent_name: studentData.parent_name,
          parent_email: studentData.parent_email,
          parent_phone: studentData.parent_phone,
          enrollment_date: studentData.enrollment_date,
          status: studentData.status,
          photo_url: studentData.photo_url
        }]
      };

      const response = await this.apperClient.updateRecord("student", params);
      
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
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("student", params);
      
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
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getParentEmail(studentId) {
    try {
      const student = await this.getById(studentId);
      return student?.parent_email || null;
    } catch (error) {
      console.error("Error getting parent email:", error);
      return null;
    }
  }
}

export default new StudentService();