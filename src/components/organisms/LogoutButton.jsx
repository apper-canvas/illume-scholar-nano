import { useContext } from 'react';
import { AuthContext } from '@/App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;