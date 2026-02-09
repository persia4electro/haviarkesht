/// src/api/auth.api.js
import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
  try {
    // استفاده از URLSearchParams برای ایجاد فرمت استاندارد OAuth2
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    // نکته کلیدی برای رفع ارور 422: اضافه کردن grant_type
    formData.append('grant_type', 'password'); 

    const response = await axiosInstance.post("/token", formData, {
      headers: {
        // اطمینان از اینکه هدر دقیقاً همین باشد
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
