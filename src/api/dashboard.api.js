import axios from './axiosInstance';

export const getReportFull = async (cropYearId) => {
    try {
        // ارسال درخواست POST با پارامتر مورد نیاز
        const response = await axios.post('/report-full', { 
            crop_year_id: cropYearId 
        });
        return response.data;
    } catch (error) {
        console.error("Error in getReportFull:", error);
        throw error;
    }
};
