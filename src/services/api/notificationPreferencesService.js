class NotificationPreferencesService {
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
          { "field": { "Name": "parent_email" } },
          { "field": { "Name": "grade_updates" } },
          { "field": { "Name": "attendance_alerts" } },
          { "field": { "Name": "assignment_deadlines" } },
          { "field": { "Name": "general_announcements" } },
          { "field": { "Name": "email_frequency" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("notification_preference", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notification preferences:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByParentEmail(parentEmail) {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "parent_email" } },
          { "field": { "Name": "grade_updates" } },
          { "field": { "Name": "attendance_alerts" } },
          { "field": { "Name": "assignment_deadlines" } },
          { "field": { "Name": "general_announcements" } },
          { "field": { "Name": "email_frequency" } }
        ],
        "where": [
          {
            "FieldName": "parent_email",
            "Operator": "EqualTo",
            "Values": [parentEmail]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords("notification_preference", params);
      
      if (!response.success) {
        console.error(response.message);
        return this.createDefaultPreferences(parentEmail);
      }
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        return this.createDefaultPreferences(parentEmail);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching preferences by parent email:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return this.createDefaultPreferences(parentEmail);
    }
  }

  async createDefaultPreferences(parentEmail) {
    try {
      const params = {
        records: [{
          Name: `Preferences for ${parentEmail}`,
          parent_email: parentEmail,
          grade_updates: true,
          attendance_alerts: true,
          assignment_deadlines: true,
          general_announcements: true,
          email_frequency: 'immediate'
        }]
      };

      const response = await this.apperClient.createRecord("notification_preference", params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          parent_email: parentEmail,
          grade_updates: true,
          attendance_alerts: true,
          assignment_deadlines: true,
          general_announcements: true,
          email_frequency: 'immediate'
        };
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating default preferences:", error);
      return {
        parent_email: parentEmail,
        grade_updates: true,
        attendance_alerts: true,
        assignment_deadlines: true,
        general_announcements: true,
        email_frequency: 'immediate'
      };
    }
  }

  async update(parentEmail, preferencesData) {
    try {
      const existing = await this.getByParentEmail(parentEmail);
      
      if (existing && existing.Id) {
        // Update existing preferences
        const params = {
          records: [{
            Id: existing.Id,
            Name: `Preferences for ${parentEmail}`,
            parent_email: parentEmail,
            grade_updates: preferencesData.grade_updates,
            attendance_alerts: preferencesData.attendance_alerts,
            assignment_deadlines: preferencesData.assignment_deadlines,
            general_announcements: preferencesData.general_announcements,
            email_frequency: preferencesData.email_frequency
          }]
        };

        const response = await this.apperClient.updateRecord("notification_preference", params);
        
        if (!response.success) {
          console.error(response.message);
          return null;
        }
        
        if (response.results) {
          const successfulRecords = response.results.filter(result => result.success);
          return successfulRecords.length > 0 ? successfulRecords[0].data : null;
        }
      } else {
        // Create new preferences
        return this.createDefaultPreferences(parentEmail);
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating notification preferences:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getAllParentEmails() {
    try {
      const preferences = await this.getAll();
      return preferences.map(p => p.parent_email);
    } catch (error) {
      console.error("Error getting all parent emails:", error);
      return [];
    }
  }
}

export default new NotificationPreferencesService();