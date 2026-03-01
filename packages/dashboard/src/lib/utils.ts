import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function getRelativeTime(value?: string | Date | null): string {
  if (!value) return "never";
  const now = Date.now();
  const then = new Date(value).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function calculateDuration(start?: string | null, end?: string | null) {
  if (!start || !end) return "-";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const sec = Math.max(0, Math.floor(ms / 1000));
  return `${sec}s`;
}