const STORAGE_KEY = "user";

export function getCurrentUser() {
  const user = localStorage.getItem(STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

export function login(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}