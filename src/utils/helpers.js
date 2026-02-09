export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fa-IR");
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
