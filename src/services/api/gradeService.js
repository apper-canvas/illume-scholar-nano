import gradesData from "@/services/mockData/grades.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await delay(300);
    return [...this.grades];
  }

  async getById(id) {
    await delay(200);
    const grade = this.grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async create(gradeData) {
    await delay(400);
    const newGrade = {
      Id: Math.max(...this.grades.map(g => g.Id)) + 1,
      ...gradeData
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await delay(400);
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades.splice(index, 1);
    return true;
  }
}

export default new GradeService();