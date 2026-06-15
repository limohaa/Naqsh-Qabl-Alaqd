// Opt-in localStorage wrapper. Nothing is persisted unless the user explicitly
// enables it. All keys are namespaced. No data ever leaves the device.

const NS = 'naqsh.v6';
const STATE_KEY = `${NS}.session`;
const PREF_KEY = `${NS}.persistEnabled`;

function available(): boolean {
  try {
    const t = `${NS}.__t`;
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

export function isPersistEnabled(): boolean {
  if (!available()) return false;
  return localStorage.getItem(PREF_KEY) === '1';
}

export function setPersistEnabled(enabled: boolean): void {
  if (!available()) return;
  if (enabled) {
    localStorage.setItem(PREF_KEY, '1');
  } else {
    localStorage.removeItem(PREF_KEY);
    localStorage.removeItem(STATE_KEY);
  }
}

export function saveSession(snapshot: unknown): void {
  if (!available() || !isPersistEnabled()) return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota or serialization failure — fail silently; persistence is best-effort.
  }
}

export function loadSession<T>(): T | null {
  if (!available() || !isPersistEnabled()) return null;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (!available()) return;
  localStorage.removeItem(STATE_KEY);
}

export function clearAll(): void {
  if (!available()) return;
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(PREF_KEY);
}
