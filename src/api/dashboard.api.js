import axios from './axiosInstance'; // فرض بر این است که این فایل را دارید

// دریافت اطلاعات آماری داشبورد
export const getDashboardStats = async () => {
    // در سیستم واقعی آدرس دقیق را جایگزین کنید، مثلا /dashboard/report
    // فعلا فرض میکنیم آدرس این است:
    const response = await axios.get('/dashboard/report-full'); 
    return response.data;
};

// دریافت اطلاعات کاربر (برای هدر)
export const getUserInfo = async () => {
    const response = await axios.get('/auth/users/me'); // یا آدرس مشابه
    return response.data;
};
