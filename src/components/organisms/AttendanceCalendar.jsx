import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import emailService from "@/services/api/emailService";

const AttendanceCalendar = ({ students, attendance, onMarkAttendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (studentId, date) => {
    return attendance.find(att => 
      att.studentId === studentId && 
      isSameDay(new Date(att.date), date)
    );
  };

  const getAttendanceStats = (date) => {
    const dayAttendance = attendance.filter(att => 
      isSameDay(new Date(att.date), date)
    );
    
    const present = dayAttendance.filter(att => att.status === "present").length;
    const absent = dayAttendance.filter(att => att.status === "absent").length;
    const late = dayAttendance.filter(att => att.status === "late").length;
    
    return { present, absent, late, total: dayAttendance.length };
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

const handleMarkAttendance = async (studentId, status) => {
    onMarkAttendance(studentId, selectedDate, status);
    
    // Send notification email for absences
    if (status === 'absent') {
      try {
        const student = students.find(s => s.Id === studentId);
        if (student) {
          const emailData = {
            to: student.parentEmail,
            subject: `Attendance Alert for ${student.firstName} ${student.lastName}`,
            body: `Your child ${student.firstName} ${student.lastName} was marked absent on ${format(selectedDate, 'MMMM d, yyyy')}.`,
            type: 'attendance_alert',
            studentId: studentId,
            date: selectedDate.toISOString().split('T')[0]
          };
          
          await emailService.sendEmail(emailData);
          toast.info("Absence notification sent to parent");
        }
      } catch (error) {
        console.error("Failed to send attendance notification:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(date => {
                const stats = getAttendanceStats(date);
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentMonth = isSameMonth(date, currentDate);
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={cn(
                      "p-2 text-center text-sm rounded-lg transition-all duration-200 hover:bg-gray-50",
                      isSelected && "bg-primary text-white",
                      isToday(date) && !isSelected && "bg-blue-100 text-blue-700",
                      !isCurrentMonth && "text-gray-400"
                    )}
                  >
                    <div className="font-medium">{format(date, "d")}</div>
                    {stats.total > 0 && (
                      <div className="flex justify-center space-x-1 mt-1">
                        {stats.present > 0 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {stats.absent > 0 && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {stats.late > 0 && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Attendance Panel */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            
            <div className="space-y-3">
              {students.map(student => {
                const studentAttendance = getAttendanceForDate(student.Id, selectedDate);
                
                return (
                  <div key={student.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-600">Grade {student.gradeLevel}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {studentAttendance ? (
                        <Badge variant={studentAttendance.status}>
                          {studentAttendance.status}
                        </Badge>
                      ) : (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAttendance(student.Id, "present")}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <ApperIcon name="Check" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAttendance(student.Id, "absent")}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <ApperIcon name="X" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAttendance(student.Id, "late")}
                            className="text-yellow-600 hover:bg-yellow-50"
                          >
                            <ApperIcon name="Clock" className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;