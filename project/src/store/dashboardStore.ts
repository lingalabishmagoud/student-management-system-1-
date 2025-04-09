import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Assignment, Student, Faculty } from '../types';

interface DashboardState {
  assignments: Assignment[];
  students: Student[];
  faculty: Faculty[];
  attendance: Record<string, Record<string, boolean>>;
  timetable: Record<string, any[]>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
  }>;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  markAttendance: (studentId: string, date: string, present: boolean) => void;
  addNotification: (notification: Omit<DashboardState['notifications'][0], 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      assignments: [],
      students: [],
      faculty: [],
      attendance: {},
      timetable: {},
      notifications: [],

      addAssignment: (assignment) => 
        set((state) => ({
          assignments: [...state.assignments, assignment],
          notifications: [
            ...state.notifications,
            {
              id: crypto.randomUUID(),
              title: 'New Assignment',
              message: `New assignment added: ${assignment.title}`,
              type: 'info',
              read: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateAssignment: (id, updates) =>
        set((state) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.id === id ? { ...assignment, ...updates } : assignment
          ),
        })),

      markAttendance: (studentId, date, present) =>
        set((state) => ({
          attendance: {
            ...state.attendance,
            [studentId]: {
              ...state.attendance[studentId],
              [date]: present,
            },
          },
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);