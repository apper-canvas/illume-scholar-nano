import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const StudentCard = ({ student, onEdit, onDelete, className }) => {
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
    <div className={cn("card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {student.firstName[0]}{student.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-gray-600">{student.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={getStatusVariant(student.status)}>
                {student.status}
              </Badge>
              <span className="text-sm text-gray-500">Grade {student.gradeLevel}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/students/${student.Id}`}>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Eye" className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(student.Id)}>
            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;