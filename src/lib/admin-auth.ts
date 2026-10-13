// Owner authentication utilities for Rashe Holidays Admin Panel (Google OAuth)

/** The single email address authorized to access the Owner Portal */
export const AUTHORIZED_ADMIN_EMAIL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_EMAIL) ||
  "rasheholiday@gmail.com"
)
  .toLowerCase()
  .trim();

/** Checks if a given email is the authorized owner email */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL;
}
