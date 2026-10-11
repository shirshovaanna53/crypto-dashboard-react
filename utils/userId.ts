const STORAGE_KEY = 'crypto-dashboard-user-id';

// Temporary identity until Cognito. This is NOT authentication.
export function getUserId(): string {
  try {
    //const existing = localStorage.getItem(STORAGE_KEY);
    //if (existing) return existing;

    const id = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b'; //crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage can be blocked (private mode); fall back to a per-session id
    return crypto.randomUUID();
  }
}
