import axios from './axiosInstance'; // فرض بر این است که این فایل را دارید

// دریافت اطلاعات آماری داشبورد
export const getDashboardStats = async () => {

    const response = await axios.get('/dashboard/report-full'); 
    return response.data;
};

// دریافت اطلاعات کاربر (برای هدر)
export const getReportFull = async () => {
    const response = await axios.get('/auth/users/me'); // یا آدرس مشابه
    return response.data;
};
