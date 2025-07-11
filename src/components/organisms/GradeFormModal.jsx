import { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const GradeFormModal = ({ grade, students, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    studentId: grade?.studentId || "",
    subject: grade?.subject || "",
    assignmentName: grade?.assignmentName || "",
    score: grade?.score || "",
    maxScore: grade?.maxScore || "",
    weight: grade?.weight || 1,
    type: grade?.type || "homework",
    date: grade?.date || new Date().toISOString().split("T")[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      studentId: parseInt(formData.studentId),
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore),
      weight: parseFloat(formData.weight)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-premium-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {grade ? "Edit Grade" : "Add New Grade"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">Student</Label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="PE">Physical Education</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="assignmentName">Assignment Name</Label>
            <Input
              id="assignmentName"
              name="assignmentName"
              value={formData.assignmentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                name="score"
                type="number"
                step="0.1"
                value={formData.score}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="maxScore">Max Score</Label>
              <Input
                id="maxScore"
                name="maxScore"
                type="number"
                step="0.1"
                value={formData.maxScore}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {grade ? "Update Grade" : "Add Grade"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeFormModal;