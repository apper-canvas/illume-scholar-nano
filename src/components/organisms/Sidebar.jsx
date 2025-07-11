import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/students", label: "Students", icon: "Users" },
    { path: "/attendance", label: "Attendance", icon: "Calendar" },
    { path: "/grades", label: "Grades", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "FileText" },
    { path: "/notifications", label: "Email Notifications", icon: "Mail" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Scholar Hub</h1>
            <p className="text-sm text-gray-600">Student Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "sidebar-item",
                isActive && "active"
              )
            }
            onClick={onClose}
          >
            <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-secondary to-purple-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Teacher</p>
            <p className="text-xs text-gray-600">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;