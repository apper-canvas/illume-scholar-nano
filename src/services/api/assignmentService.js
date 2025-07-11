import emailService from "@/services/api/emailService";

class AssignmentService {
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
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "subject" } },
          { "field": { "Name": "class_id" } },
          { "field": { "Name": "due_date" } },
          { "field": { "Name": "points" } },
          { "field": { "Name": "type" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("assignment", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "subject" } },
          { "field": { "Name": "class_id" } },
          { "field": { "Name": "due_date" } },
          { "field": { "Name": "points" } },
          { "field": { "Name": "type" } }
        ]
      };

      const response = await this.apperClient.getRecordById("assignment", id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          description: assignmentData.description,
          subject: assignmentData.subject,
          class_id: assignmentData.class_id,
          due_date: assignmentData.due_date,
          points: assignmentData.points,
          type: assignmentData.type
        }]
      };

      const response = await this.apperClient.createRecord("assignment", params);
      
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
          const newAssignment = successfulRecords[0].data;
          // Trigger email notification for new assignment
          try {
            await emailService.triggerAssignmentNotification(newAssignment);
          } catch (error) {
            console.error("Failed to trigger assignment notification:", error);
          }
          return newAssignment;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          description: assignmentData.description,
          subject: assignmentData.subject,
          class_id: assignmentData.class_id,
          due_date: assignmentData.due_date,
          points: assignmentData.points,
          type: assignmentData.type
        }]
      };

      const response = await this.apperClient.updateRecord("assignment", params);
      
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
          const updatedAssignment = successfulRecords[0].data;
          // Trigger email notification for assignment update
          try {
            await emailService.triggerAssignmentNotification(updatedAssignment);
          } catch (error) {
            console.error("Failed to trigger assignment notification:", error);
          }
          return updatedAssignment;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("assignment", params);
      
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
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new AssignmentService();