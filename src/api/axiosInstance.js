/// src/api/axiosInstance.js
import axios from "axios";

// Base URL API
const axiosInstance = axios.create({
  baseURL: "https://edu-api.havirkesht.ir/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor برای تزریق توکن به هدر درخواست‌ها
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. کلید درست را از فایل AuthContext شما برداشتیم
    const storageKey = "incept/application"; 
    
    // 2. دریافت کل دیتای ذخیره شده
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      try {
        // 3. تبدیل رشته جیسون به آبجکت
        const parsedData = JSON.parse(storedData);
        
        // 4. استخراج توکن از داخل آبجکت
        const token = parsedData.token;

        // 5. اگر توکن وجود داشت، به هدر اضافه شود
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing auth data in axios interceptor:", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// مدیریت خطای 401 (اختیاری ولی پیشنهاد می‌شود)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request - Token might be invalid or expired.");
      // اگر خواستید کاربر را خودکار لاگ‌اوت کنید:
      // localStorage.removeItem("incept/application");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
