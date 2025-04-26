import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import validator from 'validator';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (payload: { email: string; password: string }) => Promise<void>;
  registerUser: (payload: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginUser: async ({ email, password }) => {
        if (!validator.isEmail(email)) throw new Error('Invalid email format');

        set({ isLoading: true, error: null });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          set({ isLoading: false, error: error.message });
          return;
        }

        const { user } = data;
        set({ isLoading: false, isAuthenticated: true, user: user as any });
        toast.success('Logged in successfully');
      },

      registerUser: async ({ name, email, password, role }) => {
        if (!validator.isEmail(email)) throw new Error('Invalid email format');
        if (password.length < 8) throw new Error('Password must be at least 8 characters');
        if (!validator.isAlpha(name.replace(/\s/g, ''))) throw new Error('Name can only contain letters');

        set({ isLoading: true, error: null });

        // Step 1: Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          set({ isLoading: false, error: error.message });
          return;
        }

        const user = data.user;
        if (!user) {
          set({ isLoading: false, error: 'Signup failed. Please try again.' });
          toast.error('Signup failed. Please try again.');
          return;
        }

        // Step 2: Insert user into the `users` table with matching auth.uid()
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: user.id,
            name,
            email,
            role,
            emailVerified: false,
          },
        ]);

        if (dbError) {
          toast.error(dbError.message);
          set({ isLoading: false, error: dbError.message });
          return;
        }

        toast.success('Verification email sent! Please check your inbox.');
        set({ isLoading: false });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
