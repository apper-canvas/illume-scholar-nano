import attendanceData from "@/services/mockData/attendance.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await delay(300);
    return [...this.attendance];
  }

  async getById(id) {
    await delay(200);
    const record = this.attendance.find(a => a.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async create(attendanceData) {
    await delay(400);
    const newRecord = {
      Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
      ...attendanceData
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await delay(400);
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance[index] = { ...this.attendance[index], ...attendanceData };
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance.splice(index, 1);
    return true;
  }
}

export default new AttendanceService();