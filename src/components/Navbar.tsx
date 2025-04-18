import { Link, useLocation } from 'react-router-dom';
import { BarChart2, CheckSquare, Home, Book, Bot, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30 md:top-0 md:bottom-auto md:right-auto md:h-screen md:w-64 md:border-t-0 md:border-r shadow-sm">
      <div className="hidden md:flex md:items-center md:h-20 md:px-4">
        <h1 className="text-2xl font-bold text-indigo-600">StudBud</h1>
      </div>

      {user && (
        <div className="hidden md:block px-4 py-4 border-b">
          <div className="font-medium">{user.user_metadata.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )}

      <ul className="flex justify-around md:flex-col md:space-y-2 md:mt-8">
        <NavItem to="/" icon={<Home size={20} />} label="Dashboard" isActive={isActive('/')} />
        <NavItem to="/tasks" icon={<CheckSquare size={20} />} label="Tasks" isActive={isActive('/tasks')} />
        <NavItem to="/subjects" icon={<Book size={20} />} label="Subjects" isActive={isActive('/subjects')} />
        <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" isActive={isActive('/analytics')} />
        <NavItem to="/ai-assistant" icon={<Bot size={20} />} label="AI Assistant" isActive={isActive('/ai-assistant')} />
        <NavItem to="/stress-management" icon={<Heart size={20} />} label="Stress Management" isActive={isActive('/stress-management')} />
        <NavItem to="/profile" icon={<User size={20} />} label="Profile" isActive={isActive('/profile')} />
      </ul>

      {user && (
        <div className="hidden md:block absolute bottom-8 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
          ${isActive 
            ? 'text-indigo-600 bg-indigo-50 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </Link>
    </li>
  );
}