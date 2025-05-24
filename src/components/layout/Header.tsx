
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Search, Bookmark, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">JobMatch Pro</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Search className="h-4 w-4" />
                    <span>Search Jobs</span>
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Bookmark className="h-4 w-4" />
                    <span>Saved Jobs</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
