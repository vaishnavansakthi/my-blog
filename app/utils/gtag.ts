/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/gtag.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_ID = "G-H952GR6KXJ";

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && GA_ID && typeof window.gtag === "function") {
    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }
};

// Track specific events
export const event = ({ action, category, label, value }: any) => {
  if (typeof window !== "undefined" && GA_ID && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
