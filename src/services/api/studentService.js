import studentsData from "@/services/mockData/students.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.students];
  }

  async getById(id) {
    await delay(200);
    const student = this.students.find(s => s.Id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await delay(400);
const newStudent = {
      Id: Math.max(...this.students.map(s => s.Id)) + 1,
      ...studentData,
      photoUrl: studentData.photoUrl || ""
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await delay(400);
    const index = this.students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.students.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
return true;
  }

  async getParentEmail(studentId) {
    await delay(200);
    const student = this.students.find(s => s.Id === studentId);
    if (!student) {
      throw new Error("Student not found");
    }
    return student.parentEmail;
  }
}

export default new StudentService();