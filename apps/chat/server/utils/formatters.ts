export function formatEpoch(timestamp: Date): {
  formatted: string;
  timestamp: number;
  opts?: Intl.DateTimeFormatOptions;
} {
  if (!timestamp || isNaN(timestamp.getTime())) {
    return { formatted: "", timestamp: 0 };
  }

  const today = new Date();
  const month = today.getMonth();
  const fullYear = today.getFullYear();
  const tsMonth = timestamp.getMonth();
  const isSameYear = fullYear === timestamp.getFullYear();

  const mongoFormatRegex =
    /^([A-Za-z]{3}\s+[A-Za-z]{3}\s+\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+(\d{4})$/;

  const opts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  if (!isSameYear) {
    opts.day = "numeric";
    opts.month = "short";
    opts.year = "numeric";
  } else if (tsMonth !== month) {
    opts.day = "numeric";
    opts.month = "short";
  } else {
    opts.weekday = "short";
  }

  let formatted = timestamp.toLocaleString("en-IN", opts);

  if (mongoFormatRegex.test(formatted)) {
    const match = formatted.match(mongoFormatRegex);
    if (match) {
      const datePart = match[1]; // e.g., "Sun Mar 9"
      const timePart = match[2]; // e.g., "23:31:04"
      const yearPart = match[3]; // e.g., "2025"
      const formattedTime = timePart.split(":").slice(0, 2).join(":"); // e.g., "23:31"
      const dateWithoutWeekday = datePart.replace(/^[A-Za-z]{3}\s+/, ""); // e.g., "Mar 9"

      formatted = !isSameYear
        ? `${dateWithoutWeekday} ${yearPart}, ${formattedTime}`
        : tsMonth !== month
        ? `${datePart}, ${formattedTime}`
        : `${datePart.split(" ")[0]}, ${formattedTime}`;
    }
  }

  return {
    formatted,
    timestamp: timestamp.getTime(),
    opts,
  };
}
