import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import emailService from "@/services/api/emailService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleMarkAttendance = async (studentId, date, status) => {
    try {
      const attendanceData = {
        studentId,
        date: date.toISOString().split("T")[0],
        status,
        notes: ""
      };
      
      // Check if attendance already exists
      const existing = attendance.find(att => 
        att.studentId === studentId && 
        att.date === attendanceData.date
      );
      
      if (existing) {
        await attendanceService.update(existing.Id, attendanceData);
        toast.success("Attendance updated successfully");
      } else {
        await attendanceService.create(attendanceData);
        toast.success("Attendance marked successfully");
      }
      
      // Send automatic email notification for absences
      if (status === 'absent') {
        try {
          const student = students.find(s => s.Id === studentId);
          if (student && student.parentEmail) {
            const emailData = {
              to: student.parentEmail,
              subject: `Attendance Alert for ${student.firstName} ${student.lastName}`,
              body: `Your child ${student.firstName} ${student.lastName} was marked absent on ${date.toLocaleDateString()}.`,
              type: 'attendance_alert',
              studentId: studentId,
              date: attendanceData.date
            };
            
            await emailService.sendEmail(emailData);
            toast.info("Absence notification sent to parent");
          }
        } catch (emailError) {
          console.error("Failed to send attendance notification:", emailError);
        }
      }
      
      loadData();
    } catch (err) {
      toast.error("Failed to mark attendance");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <div className="text-sm text-gray-600">
          Track daily attendance for all students
        </div>
      </div>

      <AttendanceCalendar
        students={students}
        attendance={attendance}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default Attendance;