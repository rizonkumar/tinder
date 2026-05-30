export const formatLocalDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
};

export const parseTime = (timeStr) => {
  if (!timeStr) return { hour: "08", minute: "00", period: "AM" };
  const parts = timeStr.split(" ");
  if (parts.length < 2) return { hour: "08", minute: "00", period: "AM" };
  const hm = parts[0].split(":");
  return {
    hour: hm[0] || "08",
    minute: hm[1] || "00",
    period: parts[1] || "AM",
  };
};
