
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">Schedule Sync</Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-2 py-1 ${isActive('/')}`}
            >
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/meetings" 
              className={`flex items-center space-x-1 px-2 py-1 ${isActive('/meetings')}`}
            >
              <Calendar className="h-5 w-5" />
              <span>Meetings</span>
            </Link>
            
            <Link 
              to="/users" 
              className={`flex items-center space-x-1 px-2 py-1 ${isActive('/users')}`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
