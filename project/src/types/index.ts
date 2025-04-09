export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student extends User {
  rollNumber: string;
  class: string;
  attendance: Record<string, number>;
  subjects: string[];
}

export interface Faculty extends User {
  department: string;
  subjects: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  facultyId: string;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  assignmentId: string;
  submissionDate: string;
  status: 'pending' | 'reviewed';
  grade?: number;
}