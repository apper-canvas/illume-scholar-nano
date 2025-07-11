import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, title = "Dashboard" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search students..."
            className="hidden md:block w-80"
          />
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;