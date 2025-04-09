import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          <Route path="/attendance" element={<div>Attendance Content</div>} />
          <Route path="/assignments" element={<div>Assignments Content</div>} />
          <Route path="/timetable" element={<div>Timetable Content</div>} />
          <Route path="/students" element={<div>Students Content</div>} />
          <Route path="/users" element={<div>Users Content</div>} />
          <Route path="/settings" element={<div>Settings Content</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;