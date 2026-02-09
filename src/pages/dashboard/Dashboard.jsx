import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
// دقت کنید مسیر ایمپورت زیر درست باشد (بسته به ساختار پوشه‌های شما)
import { getDashboardStats, getUserInfo } from "../../api/dashboard.api"; 
import "./dashboard.css";

// --- کامپوننت‌های SVG برای آیکون‌ها ---
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Scale: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><path d="M12 3v18"/><path d="M6 8h12"/><path d="M6 8l-3 8"/><path d="M18 8l3 8"/></svg>,
  File: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>,
  PlusCircle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
  ArrowsUpDownRed: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><path d="M7 17l5 5 5-5"/><path d="M12 3v19"/></svg>,
  ArrowsUpDownPurple: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2"><path d="M7 17l5 5 5-5"/><path d="M12 3v19"/></svg>,
  Plant: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>,
  Spray: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><path d="M3 10h18"/><path d="M5 10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2"/></svg>,
  Chart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  User: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="#673ab7" stroke="none"><circle cx="12" cy="12" r="10" fill="#e1bee7"/><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#673ab7"/><path d="M4 20c0-4 4-5 8-5s8 1 8 5" fill="#673ab7"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
};

// --- کارت آماری ---
const StatCard = ({ title, value, unit, icon, valueColor }) => (
  <div className="stat-card">
    <div className="stat-header">{title}</div>
    <div className="stat-body">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-value" style={{ color: valueColor }}>{Number(value).toLocaleString()}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { logoutUser } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [user, setUser] = useState({ fullname: "کاربر", role_id: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // فعلاً از دیتای ماک استفاده می‌کنیم تا ارور ندهد
        // وقتی بک‌اند آماده شد، خطوط زیر را فعال کنید:
        // const dashboardData = await getDashboardStats();
        // const userData = await getUserInfo();

        const mockDashboardData = {
            current_contractor_remaining_balance: 3827814550,
            farmers_commitment_count: 429,
            total_delivered_tonnage: 16010,
            total_farmers_debt: 44530209685,
            total_farmers_receivable: 1221252734,
            farmers_remaining_settlement: 43308956951,
            contractor_fee: 669737013,
            contractor_seed_profit: 0,
            contractor_pesticide_profit: 0,
            overall_contractor_status: 3827814550,
            crop_year_name: "1404"
        };
        const mockUser = { fullname: "Student 9811412119", username: "edu_9811412119" };

        setData(mockDashboardData);
        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">در حال بارگذاری سامانه...</div>;

  return (
    <div className="app-container">
      {/* سایدبار سمت راست */}
      <aside className="sidebar">
        <div className="sidebar-header">
            <h3>سامانه هاویرکشت</h3>
        </div>
        <nav className="sidebar-nav">
            <div className="nav-item active">
                <Icons.Dashboard /> <span>داشبورد</span>
            </div>
            <div className="nav-item"><span>داده های اولیه</span> <Icons.ChevronDown/></div>
            <div className="nav-item"><span>عملیات پیمانکار</span> <Icons.ChevronDown/></div>
            <div className="nav-item"><span>عملیات کشاورز</span> <Icons.ChevronDown/></div>
            <div className="nav-item"><span>صورتحساب کشاورزان</span></div>
            <div className="nav-item"><span>گزارش گیری</span> <Icons.ChevronDown/></div>
            <div className="nav-item"><span>مدیریت ارسال پیامک</span> <Icons.ChevronDown/></div>
            <div className="nav-item"><span>ثبت بار های آماده حمل</span></div>
            <div className="nav-item"><span>تنظیمات</span> <Icons.ChevronDown/></div>
            
            <div className="nav-item logout-btn" onClick={logoutUser} style={{marginTop: 'auto', color: '#ff8a80'}}>
               <span>خروج از حساب</span>
            </div>
        </nav>
      </aside>

      {/* محتوای اصلی */}
      <main className="main-content">
        {/* هدر بالا */}
        <header className="top-header">
            <div className="header-right">
                <button className="menu-btn"><Icons.Menu /></button>
                <div className="search-box">
                    <input type="text" placeholder="صفحه مورد نظر را جستجو کنید..." />
                    <Icons.Search />
                </div>
            </div>
            <div className="header-left">
                <span className="user-name">{user.fullname || user.username}</span>
                <Icons.User />
            </div>
        </header>

        {/* محتوای داشبورد */}
        <div className="dashboard-scroll">
            <div className="year-badge">سال زراعی: {data.crop_year_name}</div>
            
            <div className="cards-grid">
                {/* ردیف اول */}
                <StatCard 
                    title="مانده فعلی در حساب پیمانکار" 
                    value={data.current_contractor_remaining_balance} 
                    unit="تومان" 
                    valueColor="#2e7d32"
                    icon={<Icons.PlusCircle />} 
                />
                 <StatCard 
                    title="تعداد قرارداد کشاورزان" 
                    value={data.farmers_commitment_count} 
                    unit="" 
                    valueColor="#333"
                    icon={<Icons.File />} 
                />
                 <StatCard 
                    title="کل تناژ تحویلی کشاورزان" 
                    value={data.total_delivered_tonnage} 
                    unit="تن" 
                    valueColor="#333"
                    icon={<Icons.Scale />} 
                />
                 <StatCard 
                    title="جمع بدهی به کشاورزان" 
                    value={data.total_farmers_debt} 
                    unit="تومان" 
                    valueColor="#d32f2f"
                    icon={<Icons.ArrowsUpDownRed />} 
                />

                {/* ردیف دوم */}
                <StatCard 
                    title="سود پیمانکار از بذر" 
                    value={data.contractor_seed_profit} 
                    unit="تومان" 
                    valueColor="#2e7d32"
                    icon={<Icons.Plant />} 
                />
                <StatCard 
                    title="کارمزد پیمانکار (یک درصد)" 
                    value={data.contractor_fee} 
                    unit="تومان" 
                    valueColor="#1565c0"
                    icon={<Icons.PlusCircle />} 
                />
                <StatCard 
                    title="مانده تا تسویه کشاورزان" 
                    value={data.farmers_remaining_settlement} 
                    unit="تومان" 
                    valueColor="#2e7d32"
                    icon={<Icons.PlusCircle />} 
                />
                <StatCard 
                    title="جمع طلب از کشاورزان" 
                    value={data.total_farmers_receivable} 
                    unit="تومان" 
                    valueColor="#7b1fa2"
                    icon={<Icons.ArrowsUpDownPurple />} 
                />

                {/* ردیف سوم */}
                 <StatCard 
                    title="وضعیت کلی پیمانکار" 
                    value={data.overall_contractor_status} 
                    unit="تومان" 
                    valueColor="#1565c0"
                    icon={<Icons.Chart />} 
                />
                <StatCard 
                    title="سود پیمانکار از سم" 
                    value={data.contractor_pesticide_profit} 
                    unit="تومان" 
                    valueColor="#d32f2f"
                    icon={<Icons.Spray />} 
                />
            </div>
            
            <footer className="dashboard-footer">
                طراحی شده توسط شرکت هوشمند پرداز هاویر | © ۲۰۲۵ سامانه هاویر کشت
            </footer>
        </div>
      </main>
    </div>
  );
}
