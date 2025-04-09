import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '../store/dashboardStore';
import { useAuthStore } from '../store/authStore';

const DashboardStats: React.FC = () => {
  const { user } = useAuthStore();
  const { assignments, attendance } = useDashboardStore();

  const getAttendanceStats = () => {
    if (user?.role === 'student') {
      const studentAttendance = attendance[user.id] || {};
      const total = Object.keys(studentAttendance).length;
      const present = Object.values(studentAttendance).filter(Boolean).length;
      return {
        total,
        present,
        percentage: total ? Math.round((present / total) * 100) : 0,
      };
    }
    return null;
  };

  const getAssignmentStats = () => {
    if (user?.role === 'student') {
      const completed = assignments.filter((a) =>
        a.submissions.some((s) => s.studentId === user.id)
      ).length;
      return {
        total: assignments.length,
        completed,
        pending: assignments.length - completed,
      };
    }
    return null;
  };

  const attendanceStats = getAttendanceStats();
  const assignmentStats = getAssignmentStats();

  const chartData = [
    {
      name: 'Attendance',
      Present: attendanceStats?.present || 0,
      Total: attendanceStats?.total || 0,
    },
    {
      name: 'Assignments',
      Completed: assignmentStats?.completed || 0,
      Total: assignmentStats?.total || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Present Days</p>
            <p className="text-2xl font-bold text-blue-600">
              {attendanceStats?.present || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-2xl font-bold text-gray-700">
              {attendanceStats?.total || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentage</p>
            <p className="text-2xl font-bold text-green-600">
              {attendanceStats?.percentage || 0}%
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Present" fill="#3B82F6" />
              <Bar dataKey="Total" fill="#9CA3AF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Assignment Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {assignmentStats?.completed || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-orange-600">
              {assignmentStats?.pending || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-700">
              {assignmentStats?.total || 0}
            </p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Completed" fill="#10B981" />
              <Bar dataKey="Total" fill="#9CA3AF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;