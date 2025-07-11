import assignmentsData from "@/services/mockData/assignments.json";
import emailService from "@/services/api/emailService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.assignments];
  }

  async getById(id) {
    await delay(200);
    const assignment = this.assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

async create(assignmentData) {
    await delay(400);
    const newAssignment = {
      Id: Math.max(...this.assignments.map(a => a.Id)) + 1,
      ...assignmentData
    };
    this.assignments.push(newAssignment);
    
    // Trigger email notification for new assignment
    try {
      await emailService.triggerAssignmentNotification(newAssignment);
    } catch (error) {
      console.error("Failed to trigger assignment notification:", error);
    }
    
    return { ...newAssignment };
  }

async update(id, assignmentData) {
    await delay(400);
    const index = this.assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index] = { ...this.assignments[index], ...assignmentData };
    
    // Trigger email notification for assignment update
    try {
      await emailService.triggerAssignmentNotification(this.assignments[index]);
    } catch (error) {
      console.error("Failed to trigger assignment notification:", error);
    }
    
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    this.assignments.splice(index, 1);
    return true;
  }
}

export default new AssignmentService();