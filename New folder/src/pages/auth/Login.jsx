  /// src/pages/auth/Login.jsx
  import React, { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom"; 

  // 1. اصلاح مسیرها با دو نقطه (../../) برای رسیدن به ریشه src
  import { login } from "../../api/auth.api"; 
  import { AuthContext } from "../../context/AuthContext"; 

  // 2. فراخوانی فایل استایل از پوشه جاری
  import "./login.css"; 

  export default function Login() {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate(); // برای هدایت کاربر بعد از لاگین
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        // ارسال درخواست به API
        const data = await login(username, password);
        
        console.log("پاسخ سرور:", data); // جهت دیباگ

        // طبق openapi.json کلید توکن access_token است
        if (data && data.access_token) {
          // چون API فعلاً آبجکت user را برنمی‌گرداند، یک یوزر پیش‌فرض می‌سازیم
          // اگر در آینده API اصلاح شد، از data.user استفاده کنید
          const userData = data.user || { username: username, role: "admin" };
          
          // ذخیره توکن و یوزر در Context (و لوکال استوریج با کلید incept/application)
          loginUser(userData, data.access_token);
          
          // هدایت خودکار به صفحه اصلی
          navigate("/"); 
        } else {
          setError("پاسخ سرور معتبر نیست (توکن یافت نشد).");
        }

      } catch (err) {
        console.error("Login Error:", err);
        // مدیریت پیام‌های خطا
        if (err.response && err.response.status === 422) {
          setError("فرمت اطلاعات ارسالی صحیح نیست (خطای 422).");
        } else if (err.response && err.response.status === 401) {
          setError("نام کاربری یا رمز عبور اشتباه است.");
        } else {
          setError("خطا در برقراری ارتباط با سرور.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="login-container" dir="rtl">
        {/* اگر کلاس‌های login.css روی این ساختار تنظیم شده‌اند */}
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-title">ورود به سامانه هاویر کشت</h2>

            {error && (
              <div style={{ 
                color: "#721c24", 
                backgroundColor: "#f8d7da", 
                borderColor: "#f5c6cb", 
                padding: "10px", 
                borderRadius: "5px",
                marginBottom: "15px",
                fontSize: "0.9rem"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>نام کاربری</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری خود را وارد کنید"
                  required
                />
              </div>

              <div className="input-group">
                <label>رمز عبور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn" 
                disabled={isLoading}
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
