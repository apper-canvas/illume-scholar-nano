import { useState } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AssignmentTable = ({ assignments, classes, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "homework":
        return "primary";
      case "quiz":
        return "secondary";
      case "test":
        return "warning";
      case "project":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysDiff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "error";
    if (daysDiff <= 3) return "warning";
    return "success";
  };

  const getStatusText = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysDiff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "Overdue";
    if (daysDiff === 0) return "Due Today";
    if (daysDiff === 1) return "Due Tomorrow";
    return `${daysDiff} days left`;
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
                  onClick={() => handleSort("title")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Title</span>
                  <SortIcon column="title" />
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
                  onClick={() => handleSort("type")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Type</span>
                  <SortIcon column="type" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                <button
                  onClick={() => handleSort("dueDate")}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Due Date</span>
                  <SortIcon column="dueDate" />
                </button>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">Points</th>
              <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              <th className="text-center p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssignments.map((assignment) => (
              <tr key={assignment.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="primary">{assignment.subject}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={getTypeColor(assignment.type)}>
                    {assignment.type}
                  </Badge>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(assignment.dueDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-primary">{assignment.points}</span>
                </td>
                <td className="p-4">
                  <Badge variant={getStatusColor(assignment.dueDate)}>
                    {getStatusText(assignment.dueDate)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(assignment)}>
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(assignment.Id)}>
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

export default AssignmentTable;