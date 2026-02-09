/// src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// ایمپورت‌ها را چک کنید که مسیرشان درست باشد
import ProtectedRoute from "./ProtectedRoute"; 
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";

export default function AppRouter() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* مسیر محافظت شده داشبورد */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ریدایرکت مسیر ریشه به داشبورد (اگر توکن باشد) یا لاگین */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* مدیریت مسیرهای اشتباه */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}
