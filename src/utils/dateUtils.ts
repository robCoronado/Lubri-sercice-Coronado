import { startOfDay, endOfDay, format, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function localToUTC(date: Date): string {
  // Ensure we're working with a fresh date object
  const localDate = new Date(date.getTime());
  // Convert to UTC, preserving the local time
  const utcDate = zonedTimeToUtc(localDate, LOCAL_TIMEZONE);
  return utcDate.toISOString();
}

export function utcToLocal(isoString: string | Date): Date {
  const dateString = isoString instanceof Date ? isoString.toISOString() : isoString;
  return utcToZonedTime(parseISO(dateString), LOCAL_TIMEZONE);
}

export function getDateRange(date: string | Date) {
  const localDate = typeof date === 'string' ? utcToLocal(date) : date;
  const start = startOfDay(localDate);
  const end = endOfDay(localDate);
  
  return {
    start: localToUTC(start),
    end: localToUTC(end)
  };
}

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
  const localDate = typeof date === 'string' ? utcToLocal(date) : date;
  return format(localDate, formatStr);
}

export function createLocalDate(): Date {
  const now = new Date();
  // Remove milliseconds to ensure consistent timestamps
  now.setMilliseconds(0);
  return now;
}

export function isDateInRange(dateStr: string, start: string, end: string): boolean {
  const date = utcToLocal(dateStr);
  const startDate = utcToLocal(start);
  const endDate = utcToLocal(end);
  return date >= startDate && date <= endDate;
}

export function compareLocalDates(date1: string | Date, date2: string | Date): number {
  const local1 = utcToLocal(date1);
  const local2 = utcToLocal(date2);
  return local1.getTime() - local2.getTime();
}