export const endpoints = {
  getUser: (id) => `/users/${id}`,
  getReportFull: (crop_year_id) => `/report-full/?crop_year_id=${crop_year_id}`,
};
