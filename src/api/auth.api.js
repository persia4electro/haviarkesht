/// src/api/auth.api.js
import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
  try {
  
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
  
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
