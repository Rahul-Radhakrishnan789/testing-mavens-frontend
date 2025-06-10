import React, { useState } from 'react';
import { Menu, X, FileText, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, icon, onClick, className = "" }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium ${className}`}
  >
    {icon && <span className="text-current">{icon}</span>}
    <span>{children}</span>
  </a>
);

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (!localStorage.getItem('fwtoken')) {
      alert('Logged out successfully!');
    } else {
      localStorage.removeItem('fwtoken');
       navigate('/login');
    }
    closeMobileMenu();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                NotesApp
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/" icon={<FileText size={18} />}>
                My Notes
              </NavLink>
              <NavLink 
                href="/login" 
                icon={localStorage.getItem('fwtoken') ? <User size={18} /> : <LogIn size={18} />}
                onClick={handleAuthClick}
                className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              >
                {localStorage.getItem('fwtoken') ? 'Logout' : 'Login / Register'}
              </NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-64 opacity-100 visible'
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          <NavLink 
            href="#notes" 
            icon={<FileText size={18} />}
            onClick={closeMobileMenu}
            className="block w-full text-left"
          >
            My Notes
          </NavLink>
          <NavLink 
            href="#auth" 
            icon={localStorage.getItem('fwtoken') ? <User size={18} /> : <LogIn size={18} />}
            onClick={handleAuthClick}
            className="block w-full text-left bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          >
            {localStorage.getItem('fwtoken') ? 'Logout' : 'Login / Register'}
          </NavLink>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;