const TOKEN_KEY = 'logistics_token';
const USER_KEY = 'logistics_user';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || raw === 'undefined' || raw === 'null') return null;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(USER_KEY); // cleanup bad persisted value
      return null;
    }
  },

  setUser: (user: unknown) => {
    if (user == null) {
      localStorage.removeItem(USER_KEY);
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: () => localStorage.removeItem(USER_KEY),
};