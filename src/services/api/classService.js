import classesData from "@/services/mockData/classes.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async getAll() {
    await delay(250);
    return [...this.classes];
  }

  async getById(id) {
    await delay(200);
    const classItem = this.classes.find(c => c.Id === id);
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  }

  async create(classData) {
    await delay(400);
    const newClass = {
      Id: Math.max(...this.classes.map(c => c.Id)) + 1,
      ...classData
    };
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await delay(400);
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes[index] = { ...this.classes[index], ...classData };
    return { ...this.classes[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes.splice(index, 1);
    return true;
  }
}

export default new ClassService();