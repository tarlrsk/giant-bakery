export const formatDate = function getCurrentDateFormatted(
  dateString: string,
): string {
  if (!dateString) return "-";
  const parsedDate = new Date(dateString);

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};
