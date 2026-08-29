const TOKEN_KEY = "hisab_token";

/**
 * Plain localStorage token storage. No cookies, no refresh flow —
 * the token doesn't expire, so this is all we need.
 */
export const authToken = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
