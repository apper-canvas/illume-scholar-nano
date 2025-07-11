import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import emailService from "@/services/api/emailService";

const GradeTable = ({ grades, students, onEdit, onDelete, onEmailParent }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedGrades = [...grades].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
if (sortConfig.key === "studentName") {
      const aStudent = students.find(s => s.Id === a.student_id);
      const bStudent = students.find(s => s.Id === b.student_id);
      aValue = aStudent ? `${aStudent.first_name} ${aStudent.last_name}` : "";
      bValue = bStudent ? `${bStudent.first_name} ${bStudent.last_name}` : "";
    }
    
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : "Unknown";
  };

const handleEmailParent = async (grade) => {
    try {
      const student = students.find(s => s.Id === grade.student_id);
      if (!student) {
        toast.error("Student not found");
        return;
      }
      
      const emailData = {
        to: student.parent_email,
        subject: `Grade Update for ${student.first_name} ${student.last_name}`,
        body: `Your child ${student.first_name} ${student.last_name} received a grade of ${grade.score}/${grade.max_score} (${Math.round((grade.score / grade.max_score) * 100)}%) on ${grade.assignment_name} in ${grade.subject}.`,
        type: 'grade_update',
        student_id: grade.student_id,
        grade_id: grade.Id
      };
      
      await emailService.sendEmail(emailData);
      toast.success("Email sent to parent successfully");
    } catch (error) {
      toast.error("Failed to send email to parent");
    }
  };

  const getParentEmail = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student?.parent_email || "No parent email";
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? 
      <ApperIcon name="ArrowUp" className="h-4 w-4 text-primary" /> :
      <ApperIcon name="ArrowDown" className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="card p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("studentName")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Student</span>
                  <SortIcon column="studentName" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("subject")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Subject</span>
                  <SortIcon column="subject" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("assignmentName")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Assignment</span>
                  <SortIcon column="assignmentName" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("type")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Type</span>
                  <SortIcon column="type" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Score</span>
                  <SortIcon column="score" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Date</span>
                  <SortIcon column="date" />
                </button>
              </th>
              <th className="text-center p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
{sortedGrades.map((grade) => {
              const percentage = Math.round((grade.score / grade.max_score) * 100);
              return (
                <tr key={grade.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {getStudentName(grade.student_id).split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{getStudentName(grade.student_id)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="primary">{grade.subject}</Badge>
                  </td>
<td className="p-4">
                    <p className="font-medium text-gray-900">{grade.assignment_name}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{grade.type}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {grade.score}/{grade.max_score}
                        </p>
                        <Badge variant={getGradeColor(percentage)}>
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {new Date(grade.date).toLocaleDateString()}
                    </span>
                  </td>
<td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(grade)}>
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
onClick={() => handleEmailParent(grade)}
                        title={`Email parent: ${getParentEmail(grade.student_id)}`}
                      >
                        <ApperIcon name="Mail" className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(grade.Id)}>
                        <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTable;