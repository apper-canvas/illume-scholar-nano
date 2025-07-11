import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import GradeTable from "@/components/organisms/GradeTable";
import GradeFormModal from "@/components/organisms/GradeFormModal";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGrade = () => {
    setEditingGrade(null);
    setShowModal(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setShowModal(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId);
        toast.success("Grade deleted successfully");
        loadData();
      } catch (err) {
        toast.error("Failed to delete grade");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingGrade(null);
  };

  const handleGradeSave = async (gradeData) => {
    try {
      if (editingGrade) {
        await gradeService.update(editingGrade.Id, gradeData);
        toast.success("Grade updated successfully");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully");
      }
      setShowModal(false);
      setEditingGrade(null);
      loadData();
    } catch (err) {
      toast.error("Failed to save grade");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <Button onClick={handleAddGrade}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {grades.length === 0 ? (
        <Empty
          title="No grades recorded"
          description="Start by adding grades for your students"
          actionLabel="Add Grade"
          onAction={handleAddGrade}
          icon="BookOpen"
        />
      ) : (
        <GradeTable
          grades={grades}
          students={students}
          onEdit={handleEditGrade}
          onDelete={handleDeleteGrade}
        />
      )}

      {showModal && (
        <GradeFormModal
          grade={editingGrade}
          students={students}
          onClose={handleModalClose}
          onSave={handleGradeSave}
        />
      )}
    </div>
  );
};

export default Grades;