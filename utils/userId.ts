const STORAGE_KEY = 'crypto-dashboard-user-id';

// Temporary identity until Cognito. This is NOT authentication.
export function getUserId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage can be blocked (private mode); fall back to a per-session id
    return crypto.randomUUID();
  }
}
