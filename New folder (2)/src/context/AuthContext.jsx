/// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // نام کلید اختصاصی شما
  const STORAGE_KEY = "incept/application";

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // بررسی وضعیت لاگین در لحظه لود شدن برنامه
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // بررسی اینکه آیا توکن هنوز معتبر است یا خیر (اختیاری)
        if (parsedData.token) {
          setToken(parsedData.token);
          setUser(parsedData.user);
        }
      } catch (error) {
        console.error("Error parsing stored auth data", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, accessToken) => {
    // 1. آپدیت State
    setToken(accessToken);
    setUser(userData);

    // 2. ذخیره در LocalStorage با کلید مورد نظر شما
    const storageValue = JSON.stringify({
      token: accessToken,
      user: userData,
      loginTime: new Date().toISOString()
    });
    
    localStorage.setItem(STORAGE_KEY, storageValue);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    // ریدایرکت کامل برای پاکسازی وضعیت
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
