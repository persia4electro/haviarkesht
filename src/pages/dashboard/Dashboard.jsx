import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getReportFull } from "../../api/dashboard.api";
import { AuthContext } from "../../context/AuthContext";
import "./dashboard.css";

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // دسترسی به تابع خروج
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // درخواست POST به اندپوینت report-full با پارامتر 13
        const data = await getReportFull(13);
        setReport(data);
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

  // تابع فرمت‌دهی اعداد (فارسی و جداکننده هزارگان)
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "۰";
    return Number(num).toLocaleString("fa-IR");
  };

  return (
    <div className="dashboard-layout">
      {/* سایدبار کناری - دقیقاً طبق فایل اصلی شما */}
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
          ) : report ? (
            <>
              {/* بخش نمایش سال زراعی */}
              <div style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                  اطلاعات مربوط به: <strong>{report.crop_year_name || "سال زراعی ۱۳"}</strong>
              </div>

              {/* گرید کارت‌ها - منطبق با تصویر ۲ */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                
                {/* ردیف ۱ */}
                <div className="stat-card" style={{ borderRight: '4px solid #dc3545' }}>
                  <h3>مانده فعلی در حساب پیمانکار</h3>
                  <p className="stat-value" style={{ color: report.current_contractor_remaining_balance < 0 ? '#dc3545' : '#28a745' }}>
                    {formatNumber(report.current_contractor_remaining_balance)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span>
                  </p>
                </div>

                <div className="stat-card">
                  <h3>تعداد قرارداد کشاورزان</h3>
                  <p className="stat-value">{formatNumber(report.farmers_commitment_count)}</p>
                </div>

                <div className="stat-card">
                  <h3>کل تناژ تحویلی کشاورزان</h3>
                  <p className="stat-value">{formatNumber(report.total_delivered_tonnage)} <span style={{fontSize: '0.8rem', color: '#888'}}>تن</span></p>
                </div>

                <div className="stat-card">
                  <h3>جمع بدهی به کشاورزان</h3>
                  <p className="stat-value">{formatNumber(report.total_farmers_debt)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span></p>
                </div>

                {/* ردیف ۲ */}
                <div className="stat-card">
                  <h3>سود پیمانکار از بذر</h3>
                  <p className="stat-value">{formatNumber(report.contractor_seed_profit)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span></p>
                </div>

                <div className="stat-card">
                  <h3>کارمزد پیمانکار</h3>
                  <p className="stat-value">{formatNumber(report.contractor_fee)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span></p>
                </div>

                <div className="stat-card">
                  <h3>مانده تا تسویه کشاورزان</h3>
                  <p className="stat-value">{formatNumber(report.farmers_remaining_settlement)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span></p>
                </div>

                <div className="stat-card" style={{ borderRight: '4px solid #6f42c1' }}>
                  <h3>جمع طلب از کشاورزان</h3>
                  <p className="stat-value" style={{ color: '#6f42c1' }}>
                    {formatNumber(report.total_farmers_receivable)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span>
                  </p>
                </div>

                {/* ردیف ۳ */}
                {/* یک دیو خالی برای حفظ چینش مشابه تصویر اگر نیاز باشد */}
                <div className="stat-card" style={{ visibility: 'hidden' }}></div> 

                <div className="stat-card" style={{ borderRight: '4px solid #007bff' }}>
                  <h3>وضعیت کلی پیمانکار</h3>
                  <p className="stat-value" style={{ direction: 'ltr', color: '#007bff' }}>
                     {formatNumber(report.overall_contractor_status)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span>
                  </p>
                </div>

                <div className="stat-card">
                  <h3>سود پیمانکار از سم</h3>
                  <p className="stat-value">{formatNumber(report.contractor_pesticide_profit)} <span style={{fontSize: '0.8rem', color: '#888'}}>تومان</span></p>
                </div>

              </div>
            </>
          ) : (
             <div className="error-message">داده‌ای یافت نشد.</div>
          )}
        </div>
      </main>
    </div>
  );
}
