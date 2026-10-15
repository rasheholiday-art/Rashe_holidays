/**
 * Rashe Holidays Email Design System & Color Tokens
 *
 * Designed to mirror the website's luxury Nilgiris aesthetic:
 * - Obsidian Ink (Charcoal headers and primary branding)
 * - Radiant Golden Amber (Accents, highlights, badges)
 * - Warm Ivory Canvas (Clean, comfortable reading background)
 *
 * To adjust the email color palette in the future (e.g. if the website theme updates),
 * simply update the HEX tokens in EMAIL_THEME below.
 */

export const EMAIL_THEME = {
  // Brand colors
  primary: "#121517",         // Deep Obsidian Charcoal
  primaryLight: "#1b1f24",    // Secondary Dark
  primaryBorder: "#2a2f35",   // Dark border
  gold: "#d99b26",            // Radiant Amber Gold
  goldDark: "#b87e14",        // Deep Gold for text readability
  goldSoft: "#fdf8ee",        // Soft champagne / ivory gold background
  goldBorder: "#ecd5a0",      // Gentle gold border
  goldMuted: "rgba(217, 155, 38, 0.15)", // Glow tint

  // Canvas & Surfaces
  canvas: "#f7f6f2",          // Warm off-white page background
  card: "#ffffff",            // Pure white card container
  border: "#e7e5df",          // Light card border
  borderLight: "#f0eee9",     // Subdued separator

  // Typography
  textPrimary: "#14181b",     // Near-black charcoal body text
  textSecondary: "#4b5563",   // Slate-600 subtext
  textMuted: "#6b7280",       // Slate-500 captions and labels
  textLight: "#ffffff",       // Pure white for dark backgrounds

  // Status & Actions
  success: "#16a34a",         // Emerald green for status pills
  successSoft: "#f0fdf4",     // Pale green badge background
  successBorder: "#bbf7d0",   // Pale green border
  whatsapp: "#25D366",        // Official WhatsApp Green
  whatsappDark: "#1ea952",    // Hover/dark WhatsApp
  info: "#0284c7",            // Sky blue for link accents
  infoSoft: "#f0f9ff",
  infoBorder: "#bae6fd",

  // Fonts
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

export const EMAIL_COMPANY = {
  name: "Rashe Holidays",
  tagline: "Premium Travels & Transportation · Ooty",
  phone: "+91 97869 63659",
  cleanPhone: "919786963659",
  email: "rasheholiday@gmail.com",
  contactEmail: "hello@rasheholidays.in",
  address: "Backside to eye foundation Southwick Ooty. 643001 Tamil Nādu India",
  siteUrl: "https://rasheholidays.com",
  adminUrl: "https://rasheholidays.com/admin",
};
