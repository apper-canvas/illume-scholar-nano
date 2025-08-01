import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";
import assignmentService from "@/services/api/assignmentService";
import emailService from "@/services/api/emailService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [emailStats, setEmailStats] = useState({ sent: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData, gradesData, assignmentsData, emailStatsData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        assignmentService.getAll(),
        emailService.getStats()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setAssignments(assignmentsData);
      setEmailStats(emailStatsData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const attendanceRate = todayAttendance.length > 0 
    ? Math.round((todayAttendance.filter(a => a.status === "present").length / todayAttendance.length) * 100)
    : 0;

  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length)
    : 0;

  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) > new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back! Here's what's happening in your classes today.
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          variant="primary"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          variant="success"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="Calendar"
          variant="secondary"
          trend={attendanceRate >= 85 ? "up" : "down"}
          trendValue={`${attendanceRate >= 85 ? "Good" : "Needs Attention"}`}
        />
        <StatCard
          title="Class Average"
          value={`${averageGrade}%`}
          icon="TrendingUp"
          variant="warning"
          trend={averageGrade >= 75 ? "up" : "down"}
          trendValue={`${averageGrade >= 75 ? "Above Target" : "Below Target"}`}
        />
</div>

      {/* Email Notifications Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatCard
          title="Emails Sent Today"
          value={emailStats.sent}
          icon="Mail"
          variant="info"
        />
        <StatCard
          title="Pending Notifications"
          value={emailStats.pending}
          icon="Clock"
          variant="warning"
        />
      </div>

{/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
{students.slice(0, 5).map(student => (
              <div key={student.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {student.first_name[0]}{student.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-gray-600">Grade {student.grade_level}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Enrolled {new Date(student.enrollment_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {assignments.slice(0, 5).map(assignment => (
              <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{assignment.title}</p>
                  <p className="text-xs text-gray-600">{assignment.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <p className="text-xs font-medium text-primary">{assignment.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Parent Communications</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Mail" className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Mail" className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Grade Updates</p>
                  <p className="text-xs text-gray-600">Auto-sent notifications</p>
                </div>
              </div>
              <div className="text-xs text-blue-600 font-medium">
                {emailStats.sent} sent
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Clock" className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Pending Alerts</p>
                  <p className="text-xs text-gray-600">Attendance & assignments</p>
                </div>
              </div>
              <div className="text-xs text-yellow-600 font-medium">
                {emailStats.pending} pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;