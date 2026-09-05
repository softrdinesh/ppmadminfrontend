
import toast from "react-hot-toast";

const TOKEN_KEY = "pp_token";
const USER_KEY = "pp_user";

const SESSION_EXPIRY_MINUTES = 30; // 30 minutes

export interface StoredUser {
  UserID: number;
  Name: string;
  Email: string;
  OrganizationName: string;
  ProfilePicture: string;
  [key: string]: any;
}

// Cookie helper functions
const setCookie = (name: string, value: string, minutes: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + minutes * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  localStorage.clear()
};

export const saveSession = (token: string, user: StoredUser) => {
  setCookie(TOKEN_KEY, token, SESSION_EXPIRY_MINUTES);
  //setCookie(USER_KEY, JSON.stringify(user), SESSION_EXPIRY_MINUTES);

  // Also store in localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Store session start time in localStorage for additional expiry check
  localStorage.setItem("pp_session_start", Date.now().toString());
};

export const getToken = (): string | null => {

  const sessionStart = localStorage.getItem("pp_session_start");
  if (sessionStart) {
    const elapsedMinutes = (Date.now() - parseInt(sessionStart)) / (60 * 1000);
    if (elapsedMinutes >= SESSION_EXPIRY_MINUTES) {
      // Session expired - clear everything
      clearSession();

      // Show a single popup and redirect to login
      toast.error("Your session has expired. Please login to continue.", {
        id: "session-expired-toast",
      });
      window.location.href = "/login";

      return null;
    }
  }

  return getCookie(TOKEN_KEY);
};

export const getUser = (): StoredUser | null => {
  const raw = getCookie(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  removeCookie(TOKEN_KEY);
  removeCookie(USER_KEY);
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("pp_session_start");
};

// Decodes a JWT payload client-side (no signature check) just to read `exp`
export const decodeToken = (token: string): { exp?: number; [key: string]: any } | null => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const getTokenExpiryMs = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return null;
  return decoded.exp * 1000; // JWT exp is in seconds
};

export const isTokenExpired = (token: string): boolean => {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return true;
  return Date.now() >= expiryMs;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

export const logout = (navigate: (path: string) => void, message?: string) => {
  clearSession();
  if (message) {
    toast.error(message);
  }
  navigate("/login");
};