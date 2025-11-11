export function formatDateTime(isoDateString?: string | null): string {
  if (!isoDateString) return ""; // handle null, undefined, empty

  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return ""; // handle invalid date

  // Format options for date
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };

  // Format options for time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-GB", timeOptions).format(date);

  return `${formattedDate} | ${formattedTime}`;
}
