export const formatDate = function getCurrentDateFormatted(
  dateString: string,
): string {
  const parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
