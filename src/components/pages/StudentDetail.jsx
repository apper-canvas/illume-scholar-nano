import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentData, gradesData, attendanceData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudent(studentData);
      setGrades(gradesData.filter(g => g.studentId === parseInt(id)));
      setAttendance(attendanceData.filter(a => a.studentId === parseInt(id)));
    } catch (err) {
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudentData} />;
  if (!student) return <Error message="Student not found" />;

  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length)
    : 0;

  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
    : 0;

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/students">
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
        </div>
        <Button variant="outline">
          <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
          Edit Student
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {student.firstName} {student.lastName}
              </h2>
              <Badge variant={getStatusVariant(student.status)} className="mb-4">
                {student.status}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="GraduationCap" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Grade {student.gradeLevel}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Parent/Guardian</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="User" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{student.parentName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{student.parentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{student.parentPhone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Enrollment</h3>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-accent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-2xl font-bold gradient-text">{averageGrade}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="card-accent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold gradient-text">{attendanceRate}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-secondary to-purple-600 rounded-lg">
                  <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="card-accent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Grades</p>
                  <p className="text-2xl font-bold gradient-text">{grades.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-accent to-yellow-600 rounded-lg">
                  <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Grades */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-3">
              {grades.slice(0, 5).map(grade => (
                <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{grade.assignmentName}</p>
                    <p className="text-sm text-gray-600">{grade.subject} • {grade.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round((grade.score / grade.maxScore) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
            <div className="space-y-3">
              {attendance.slice(0, 5).map(att => (
                <div key={att.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(att.date).toLocaleDateString()}
                    </p>
                    {att.notes && (
                      <p className="text-sm text-gray-600">{att.notes}</p>
                    )}
                  </div>
                  <Badge variant={att.status}>
                    {att.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;