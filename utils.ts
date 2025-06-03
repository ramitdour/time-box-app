import { ScheduleHour } from './types';

/**
 * Formats a 24-hour number into a 12-hour AM/PM string or 24-hour string.
 * @param hour24 The hour in 24-hour format (0-23).
 * @param format The desired time format ('12h' or '24h').
 * @returns The formatted string (e.g., "12 AM", "9 AM", "12 PM", "5 PM" or "00", "09", "12", "17").
 */
export function formatHourForDisplay(hour24: number, format: '12h' | '24h'): string {
  if (format === '24h') {
    return String(hour24).padStart(2, '0');
  }
  // 12h format
  if (hour24 === 0) return '12 AM';
  if (hour24 === 12) return '12 PM';
  if (hour24 < 12) return `${hour24} AM`;
  return `${hour24 - 12} PM`;
}

/**
 * Generates an array of ScheduleHour objects for a given time range.
 * @param startHour The starting hour in 24-hour format (inclusive).
 * @param endHour The ending hour in 24-hour format (inclusive).
 * @param timeFormat The desired time format for display strings ('12h' or '24h').
 * @returns An array of ScheduleHour objects.
 */
export function generateScheduleHours(startHour: number, endHour: number, timeFormat: '12h' | '24h'): ScheduleHour[] {
  const hours: ScheduleHour[] = [];
  for (let i = startHour; i <= endHour; i++) {
    hours.push({
      display: formatHourForDisplay(i, timeFormat),
      key: `h${i}`, // Unique key based on 24-hour format
    });
  }
  return hours;
}