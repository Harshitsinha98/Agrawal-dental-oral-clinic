import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const telHref = (phone?: string | null) => (phone ? `tel:+91${phone.replace(/^0/, "")}` : undefined);

/** "9876543210" → "+91 98765 43210" */
export function formatPhone(phone?: string | null) {
  if (!phone) return "";
  if (phone.length === 10) return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  return phone;
}

export function waHref(number?: string | null, text?: string) {
  if (!number) return undefined;
  const base = `https://wa.me/91${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
