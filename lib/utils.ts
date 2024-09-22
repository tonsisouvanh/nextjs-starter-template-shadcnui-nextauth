import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalDateTime(
  now: Date = new Date(),
  TimeZone: string = "Asia/Bangkok"
) {
  // Format the time in Laos timezone as ISO 8601 with milliseconds
  const laosTime = formatInTimeZone(now, TimeZone, "yyyy-MM-dd'T'HH:mm:ss.sss");

  return laosTime + "Z"; // Already in the correct format
}
