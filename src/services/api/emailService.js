import studentService from "@/services/api/studentService";
import notificationPreferencesService from "@/services/api/notificationPreferencesService";

class EmailService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async sendEmail(emailData) {
    try {
      const params = {
        records: [{
          Name: emailData.Name || emailData.subject,
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          type: emailData.type,
          grade_id: emailData.gradeId || emailData.grade_id,
          attendance_id: emailData.attendanceId || emailData.attendance_id,
          assignment_id: emailData.assignmentId || emailData.assignment_id,
          timestamp: new Date().toISOString(),
          status: 'sent',
          student_id: parseInt(emailData.studentId || emailData.student_id)
        }]
      };

      const response = await this.apperClient.createRecord("email_log", params);
      
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
        console.error("Error sending email:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getEmailLogs() {
    try {
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "to" } },
          { "field": { "Name": "subject" } },
          { "field": { "Name": "body" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "grade_id" } },
          { "field": { "Name": "attendance_id" } },
          { "field": { "Name": "assignment_id" } },
          { "field": { "Name": "timestamp" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "student_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("email_log", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching email logs:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getStats() {
    try {
      const emailLogs = await this.getEmailLogs();
      const today = new Date().toISOString().split('T')[0];
      const todayEmails = emailLogs.filter(e => e.timestamp && e.timestamp.startsWith(today));
      
      return {
        sent: todayEmails.filter(e => e.status === 'sent').length,
        pending: todayEmails.filter(e => e.status === 'pending').length,
        failed: todayEmails.filter(e => e.status === 'failed').length
      };
    } catch (error) {
      console.error("Error getting email stats:", error);
      return { sent: 0, pending: 0, failed: 0 };
    }
  }

  async triggerGradeNotification(gradeData) {
    try {
      const student = await studentService.getById(gradeData.student_id);
      const preferences = await notificationPreferencesService.getByParentEmail(student?.parent_email);
      
      if (preferences && preferences.grade_updates) {
        const percentage = Math.round((gradeData.score / gradeData.max_score) * 100);
        const emailData = {
          to: student.parent_email,
          subject: `Grade Update for ${student.first_name} ${student.last_name}`,
          body: `Your child ${student.first_name} ${student.last_name} received a grade of ${gradeData.score}/${gradeData.max_score} (${percentage}%) on ${gradeData.assignment_name} in ${gradeData.subject}.`,
          type: 'grade_update',
          student_id: gradeData.student_id,
          grade_id: gradeData.Id
        };
        
        await this.sendEmail(emailData);
      }
    } catch (error) {
      console.error("Failed to trigger grade notification:", error);
    }
  }

  async triggerAttendanceNotification(attendanceData) {
    try {
      const student = await studentService.getById(attendanceData.student_id);
      const preferences = await notificationPreferencesService.getByParentEmail(student?.parent_email);
      
      if (preferences && preferences.attendance_alerts) {
        const emailData = {
          to: student.parent_email,
          subject: `Attendance Alert for ${student.first_name} ${student.last_name}`,
          body: `Your child ${student.first_name} ${student.last_name} was marked ${attendanceData.status} on ${attendanceData.date}.`,
          type: 'attendance_alert',
          student_id: attendanceData.student_id,
          attendance_id: attendanceData.Id
        };
        
        await this.sendEmail(emailData);
      }
    } catch (error) {
      console.error("Failed to trigger attendance notification:", error);
    }
  }

  async triggerAssignmentNotification(assignmentData) {
    try {
      const allStudents = await studentService.getAll();
      const activeStudents = allStudents.filter(s => s.status === 'active');
      
      for (const student of activeStudents) {
        const preferences = await notificationPreferencesService.getByParentEmail(student.parent_email);
        
        if (preferences && preferences.assignment_deadlines) {
          const dueDate = new Date(assignmentData.due_date);
          const emailData = {
            to: student.parent_email,
            subject: `New Assignment: ${assignmentData.title}`,
            body: `Your child ${student.first_name} ${student.last_name} has a new assignment "${assignmentData.title}" in ${assignmentData.subject}. Due date: ${dueDate.toLocaleDateString()}.`,
            type: 'assignment_notification',
            student_id: student.Id,
            assignment_id: assignmentData.Id
          };
          
          await this.sendEmail(emailData);
        }
      }
    } catch (error) {
      console.error("Failed to trigger assignment notification:", error);
    }
  }

  async bulkSendEmail(recipients, subject, body) {
    const results = [];
    for (const recipient of recipients) {
      const emailData = {
        to: recipient.email,
        subject: subject,
        body: body,
        type: 'bulk_email',
        student_id: recipient.id
      };
      
      const result = await this.sendEmail(emailData);
      results.push(result);
    }
    
    return results;
  }
}

export default new EmailService();