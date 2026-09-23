// Owner authentication utilities for Rashe Holidays Admin Panel

const AUTH_KEY = "nilgiri_admin_authenticated";
const PASSCODE_KEY = "nilgiri_admin_passcode";
const DEFAULT_PASSCODE = "ootyadmin2026";

export function getStoredPasscode(): string {
  if (typeof window === "undefined") return DEFAULT_PASSCODE;
  return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
}

export function setOwnerPasscode(newPasscode: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PASSCODE_KEY, newPasscode);
}

export function verifyPasscode(inputPasscode: string): boolean {
  const current = getStoredPasscode();
  return inputPasscode.trim() === current.trim();
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true" || localStorage.getItem(AUTH_KEY) === "true";
}

export function setAdminSession(authenticated: boolean, remember: boolean = false): void {
  if (typeof window === "undefined") return;
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, "true");
    if (remember) {
      localStorage.setItem(AUTH_KEY, "true");
    }
  } else {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }
}
