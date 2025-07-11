import preferencesData from "@/services/mockData/notificationPreferences.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationPreferencesService {
  constructor() {
    this.preferences = [...preferencesData];
  }

  async getAll() {
    await delay(200);
    return [...this.preferences];
  }

  async getByParentEmail(parentEmail) {
    await delay(200);
    let preferences = this.preferences.find(p => p.parentEmail === parentEmail);
    
    if (!preferences) {
      // Create default preferences for new parent
      preferences = {
        Id: Math.max(...this.preferences.map(p => p.Id)) + 1,
        parentEmail,
        gradeUpdates: true,
        attendanceAlerts: true,
        assignmentDeadlines: true,
        generalAnnouncements: true,
        emailFrequency: 'immediate'
      };
      this.preferences.push(preferences);
    }
    
    return { ...preferences };
  }

  async update(parentEmail, preferencesData) {
    await delay(300);
    const index = this.preferences.findIndex(p => p.parentEmail === parentEmail);
    
    if (index === -1) {
      // Create new preferences
      const newPreferences = {
        Id: Math.max(...this.preferences.map(p => p.Id)) + 1,
        parentEmail,
        ...preferencesData
      };
      this.preferences.push(newPreferences);
      return { ...newPreferences };
    } else {
      // Update existing preferences
      this.preferences[index] = { ...this.preferences[index], ...preferencesData };
      return { ...this.preferences[index] };
    }
  }

  async getAllParentEmails() {
    await delay(200);
    return this.preferences.map(p => p.parentEmail);
  }
}

export default new NotificationPreferencesService();