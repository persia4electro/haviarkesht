import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getReportFull } from "../../api/dashboard.api";
import { AuthContext } from "../../context/AuthContext";
import "../dashboard/dashboard.css";

export default function Dashboard() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // دسترسی به تابع خروج
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // فرض بر این است که این تابع دیتا را برمی‌گرداند
        const data = await getReportFull(13);
        setReport(data || []);
      } catch (err) {
        console.error("خطا در دریافت گزارش:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* سایدبار کناری */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">🌿</div>
          <h1 className="brand-name">هاویر کشت</h1>
        </div>

        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <span className="icon">📊</span>
            <span>داشبورد</span>
          </a>
          <a href="#" className="nav-item">
            <span className="icon">📑</span>
            <span>گزارش‌ها</span>
          </a>
          <a href="#" className="nav-item">
            <span className="icon">👥</span>
            <span>کاربران</span>
          </a>
          <a href="#" className="nav-item">
            <span className="icon">⚙️</span>
            <span>تنظیمات</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>خروج از حساب</span>
            <span className="icon">🚪</span>
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="main-content">
        <header className="top-header">
          <h2 className="page-title">داشبورد مدیریتی</h2>
          <div className="user-profile">
            <span className="user-name">مدیر سیستم</span>
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="content-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>در حال بارگذاری اطلاعات...</p>
            </div>
          ) : (
            <>
              {/* کارت‌های آماری نمونه برای زیبایی */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>تعداد رکوردها</h3>
                  <p className="stat-value">{report.length}</p>
                </div>
                <div className="stat-card green">
                  <h3>سال زراعی</h3>
                  <p className="stat-value">1403-04</p>
                </div>
                <div className="stat-card dark">
                  <h3>وضعیت سیستم</h3>
                  <p className="stat-value">فعال</p>
                </div>
              </div>

              {/* جدول داده‌ها */}
              <section className="table-container fade-in-up">
                <div className="table-header">
                  <h3>گزارش جامع سال محصول 13</h3>
                  <button className="export-btn">خروجی اکسل</button>
                </div>
                
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        {report.length > 0 ? (
                          Object.keys(report[0]).map((key) => <th key={key}>{key}</th>)
                        ) : (
                          <th>داده‌ای موجود نیست</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {report.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
