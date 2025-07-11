import emailLogsData from "@/services/mockData/emailLogs.json";
import studentService from "@/services/api/studentService";
import notificationPreferencesService from "@/services/api/notificationPreferencesService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EmailService {
  constructor() {
    this.emailLogs = [...emailLogsData];
  }

  async sendEmail(emailData) {
    await delay(500);
    
    const newEmail = {
      Id: Math.max(...this.emailLogs.map(e => e.Id)) + 1,
      ...emailData,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    this.emailLogs.push(newEmail);
    return { ...newEmail };
  }

  async getEmailLogs() {
    await delay(200);
    return [...this.emailLogs];
  }

  async getStats() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const todayEmails = this.emailLogs.filter(e => e.timestamp.startsWith(today));
    
    return {
      sent: todayEmails.filter(e => e.status === 'sent').length,
      pending: todayEmails.filter(e => e.status === 'pending').length,
      failed: todayEmails.filter(e => e.status === 'failed').length
    };
  }

  async triggerGradeNotification(gradeData) {
    try {
      const student = await studentService.getById(gradeData.studentId);
      const preferences = await notificationPreferencesService.getByParentEmail(student.parentEmail);
      
      if (preferences.gradeUpdates) {
        const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
        const emailData = {
          to: student.parentEmail,
          subject: `Grade Update for ${student.firstName} ${student.lastName}`,
          body: `Your child ${student.firstName} ${student.lastName} received a grade of ${gradeData.score}/${gradeData.maxScore} (${percentage}%) on ${gradeData.assignmentName} in ${gradeData.subject}.`,
          type: 'grade_update',
          studentId: gradeData.studentId,
          gradeId: gradeData.Id
        };
        
        await this.sendEmail(emailData);
      }
    } catch (error) {
      console.error("Failed to trigger grade notification:", error);
    }
  }

  async triggerAttendanceNotification(attendanceData) {
    try {
      const student = await studentService.getById(attendanceData.studentId);
      const preferences = await notificationPreferencesService.getByParentEmail(student.parentEmail);
      
      if (preferences.attendanceAlerts) {
        const emailData = {
          to: student.parentEmail,
          subject: `Attendance Alert for ${student.firstName} ${student.lastName}`,
          body: `Your child ${student.firstName} ${student.lastName} was marked ${attendanceData.status} on ${attendanceData.date}.`,
          type: 'attendance_alert',
          studentId: attendanceData.studentId,
          attendanceId: attendanceData.Id
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
        const preferences = await notificationPreferencesService.getByParentEmail(student.parentEmail);
        
        if (preferences.assignmentDeadlines) {
          const dueDate = new Date(assignmentData.dueDate);
          const emailData = {
            to: student.parentEmail,
            subject: `New Assignment: ${assignmentData.title}`,
            body: `Your child ${student.firstName} ${student.lastName} has a new assignment "${assignmentData.title}" in ${assignmentData.subject}. Due date: ${dueDate.toLocaleDateString()}.`,
            type: 'assignment_notification',
            studentId: student.Id,
            assignmentId: assignmentData.Id
          };
          
          await this.sendEmail(emailData);
        }
      }
    } catch (error) {
      console.error("Failed to trigger assignment notification:", error);
    }
  }

  async bulkSendEmail(recipients, subject, body) {
    await delay(800);
    
    const results = [];
    for (const recipient of recipients) {
      const emailData = {
        to: recipient.email,
        subject: subject,
        body: body,
        type: 'bulk_email',
        studentId: recipient.id
      };
      
      const result = await this.sendEmail(emailData);
      results.push(result);
    }
    
    return results;
  }
}

export default new EmailService();