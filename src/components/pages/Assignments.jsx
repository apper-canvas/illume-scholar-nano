import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import AssignmentFormModal from "@/components/organisms/AssignmentFormModal";
import assignmentService from "@/services/api/assignmentService";
import classService from "@/services/api/classService";
import studentService from "@/services/api/studentService";
import emailService from "@/services/api/emailService";

const Assignments = () => {
const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, classesData, studentsData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load assignments data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        toast.success("Assignment deleted successfully");
        loadData();
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAssignment(null);
  };

const handleAssignmentSave = async (assignmentData) => {
    try {
      let savedAssignment;
      if (editingAssignment) {
        savedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        savedAssignment = await assignmentService.create(assignmentData);
        toast.success("Assignment created successfully");
        
        // Send automatic email notification for new assignments
        try {
          const dueDate = new Date(assignmentData.dueDate);
          const daysDiff = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 7) { // Send notification for assignments due within a week
            const activeStudents = students.filter(s => s.status === 'active');
            
            for (const student of activeStudents) {
              if (student.parentEmail) {
                const emailData = {
                  to: student.parentEmail,
                  subject: `New Assignment: ${assignmentData.title}`,
                  body: `Your child ${student.firstName} ${student.lastName} has a new assignment "${assignmentData.title}" in ${assignmentData.subject}. Due date: ${dueDate.toLocaleDateString()}.`,
                  type: 'assignment_notification',
                  studentId: student.Id,
                  assignmentId: savedAssignment.Id
                };
                
                await emailService.sendEmail(emailData);
              }
            }
            
            toast.info("Assignment notifications sent to parents");
          }
        } catch (emailError) {
          console.error("Failed to send assignment notifications:", emailError);
        }
      }
      
      setShowModal(false);
      setEditingAssignment(null);
      loadData();
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <Button onClick={handleAddAssignment}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Empty
          title="No assignments created"
          description="Start by creating your first assignment"
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
          icon="FileText"
        />
      ) : (
        <AssignmentTable
          assignments={assignments}
          classes={classes}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
        />
      )}

      {showModal && (
        <AssignmentFormModal
          assignment={editingAssignment}
          classes={classes}
          onClose={handleModalClose}
          onSave={handleAssignmentSave}
        />
      )}
    </div>
  );
};

export default Assignments;