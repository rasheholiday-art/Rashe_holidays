// Owner authentication utilities for Rashe Holidays Admin Panel (Google OAuth)

/** The primary email address authorized to access the Owner Portal */
export const AUTHORIZED_ADMIN_EMAIL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_EMAIL) ||
  "rasheholiday@gmail.com"
)
  .toLowerCase()
  .trim();

/** Allowed email variations to avoid lockout due to subtle singular/plural spelling */
export const AUTHORIZED_ADMIN_EMAILS = [
  AUTHORIZED_ADMIN_EMAIL,
  "rasheholiday@gmail.com",
  "rasheholidays@gmail.com",
  "resheholiday@gmail.com",
  "resheholidays@gmail.com",
];

/** Checks if a given email is an authorized owner email */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

