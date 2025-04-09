import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import toast from 'react-hot-toast';
import validator from 'validator';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: (User & { password: string })[];
  verificationTokens: Record<string, { token: string; email: string }>;
  resetTokens: Record<string, { token: string; email: string; expires: number }>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
}

const initialUsers = [
  { id: '1', name: 'John Student', email: 'student@example.com', password: 'password', role: 'student', emailVerified: true },
  { id: '2', name: 'Jane Faculty', email: 'faculty@example.com', password: 'password', role: 'faculty', emailVerified: true },
  { id: '3', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin', emailVerified: true },
];

const generateToken = () => crypto.randomUUID();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: initialUsers,
      verificationTokens: {},
      resetTokens: {},

      login: async (email: string, password: string) => {
        if (!validator.isEmail(email)) {
          throw new Error('Invalid email format');
        }

        const user = get().users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      signup: async (name: string, email: string, password: string, role: string) => {
        // Validation
        if (!validator.isEmail(email)) {
          throw new Error('Invalid email format');
        }

        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }

        if (!validator.isAlpha(name.replace(/\s/g, ''))) {
          throw new Error('Name can only contain letters');
        }

        const users = get().users;
        if (users.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }

        // Create verification token
        const verificationToken = generateToken();
        const newUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          role,
          emailVerified: false,
        };

        set(state => ({
          users: [...state.users, newUser],
          verificationTokens: {
            ...state.verificationTokens,
            [verificationToken]: { token: verificationToken, email }
          }
        }));

        // Simulate sending verification email
        console.log(`Verification link: /verify-email?token=${verificationToken}`);
        toast.success('Verification email sent! Please check your inbox.');
      },

      requestPasswordReset: async (email: string) => {
        const user = get().users.find(u => u.email === email);
        if (!user) {
          // For security, don't reveal if email exists
          toast.success('If an account exists, you will receive a reset email');
          return;
        }

        const resetToken = generateToken();
        const expires = Date.now() + 3600000; // 1 hour

        set(state => ({
          resetTokens: {
            ...state.resetTokens,
            [resetToken]: { token: resetToken, email, expires }
          }
        }));

        // Simulate sending reset email
        console.log(`Password reset link: /reset-password?token=${resetToken}`);
        toast.success('Password reset email sent! Please check your inbox.');
      },

      resetPassword: async (token: string, newPassword: string) => {
        const resetData = get().resetTokens[token];
        if (!resetData || Date.now() > resetData.expires) {
          throw new Error('Invalid or expired reset token');
        }

        set(state => ({
          users: state.users.map(user =>
            user.email === resetData.email
              ? { ...user, password: newPassword }
              : user
          ),
          resetTokens: Object.fromEntries(
            Object.entries(state.resetTokens).filter(([k]) => k !== token)
          )
        }));

        toast.success('Password reset successful! Please login with your new password.');
      },

      verifyEmail: async (token: string) => {
        const verificationData = get().verificationTokens[token];
        if (!verificationData) {
          throw new Error('Invalid verification token');
        }

        set(state => ({
          users: state.users.map(user =>
            user.email === verificationData.email
              ? { ...user, emailVerified: true }
              : user
          ),
          verificationTokens: Object.fromEntries(
            Object.entries(state.verificationTokens).filter(([k]) => k !== token)
          )
        }));

        toast.success('Email verified successfully! You can now login.');
      },

      updateProfile: async (userId: string, updates: Partial<User>) => {
        set(state => ({
          users: state.users.map(user =>
            user.id === userId
              ? { ...user, ...updates }
              : user
          )
        }));

        toast.success('Profile updated successfully!');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);