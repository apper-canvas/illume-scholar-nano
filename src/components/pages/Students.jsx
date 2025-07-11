import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import EmailComposer from "@/components/organisms/EmailComposer";
import StudentTable from "@/components/organisms/StudentTable";
import StudentFormModal from "@/components/organisms/StudentFormModal";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import studentService from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }
    
const filtered = students.filter(student =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully");
        loadStudents();
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleStudentSave = async (studentData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        await studentService.create(studentData);
        toast.success("Student created successfully");
      }
setShowModal(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      toast.error("Failed to save student");
    }
  };
  const handleBulkEmail = () => {
    setShowEmailComposer(true);
  };

  const handleEmailComposerClose = () => {
    setShowEmailComposer(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBulkEmail}>
            <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
            Email Parents
          </Button>
          <Button onClick={handleAddStudent}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search students..."
          className="w-80"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description="Start by adding your first student to get started"
          actionLabel="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
)}

      {showModal && (
        <StudentFormModal
          student={editingStudent}
          onClose={handleModalClose}
          onSave={handleStudentSave}
        />
      )}

      {showEmailComposer && (
        <EmailComposer
recipients={filteredStudents.map(s => ({
            id: s.Id,
            name: `${s.first_name} ${s.last_name}`,
            email: s.parent_email,
            parentName: s.parent_name
          }))}
          onClose={handleEmailComposerClose}
        />
      )}
    </div>
  );
};

export default Students;