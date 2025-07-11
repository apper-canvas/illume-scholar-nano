import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

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
                  onClick={() => handleSort("firstName")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Name</span>
                  <SortIcon column="firstName" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Email</span>
                  <SortIcon column="email" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("gradeLevel")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Grade</span>
                  <SortIcon column="gradeLevel" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              <th className="text-left p-4 font-semibold text-gray-900">Parent</th>
              <th className="text-center p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-gray-900">{student.email}</p>
                </td>
                <td className="p-4">
                  <Badge variant="primary">Grade {student.gradeLevel}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.parentName}</p>
                    <p className="text-xs text-gray-600">{student.parentEmail}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;