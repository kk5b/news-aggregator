import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SettingsPage from './pages/SettingsPage';

const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const BookmarksPage = React.lazy(() => import('@/pages/BookmarksPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));

const App = () => (
  <Suspense fallback={<div className="flex w-screen h-screen items-center justify-center"><LoadingSpinner /></div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Suspense>
);

export default App;