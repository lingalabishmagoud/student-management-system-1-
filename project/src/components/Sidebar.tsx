import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const studentLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/assignments', icon: FileText, label: 'Assignments' },
    { to: '/timetable', icon: BookOpen, label: 'Timetable' },
  ];

  const facultyLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/assignments', icon: FileText, label: 'Assignments' },
    { to: '/attendance', icon: Calendar, label: 'Attendance' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const links =
    user?.role === 'student'
      ? studentLinks
      : user?.role === 'faculty'
      ? facultyLinks
      : adminLinks;

  return (
    <aside className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 md:relative inset-y-0 left-0 transform md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-3 px-4">
        <BookOpen className="h-7 w-7" />
        <span className="text-2xl font-bold tracking-wide">SMS</span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
