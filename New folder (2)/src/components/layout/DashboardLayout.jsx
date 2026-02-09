import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar>
        <div className="logo">هاویر کشت</div>
        <nav>
          <a className="active">داشبورد</a>
          <a>گزارش‌ها</a>
          <a>کاربران</a>
        </nav>
      </Sidebar>
      <main className="main-content">
        <Header title="داشبورد" />
        {children}
      </main>
    </div>
  );
}
