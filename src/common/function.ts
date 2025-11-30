/* eslint-disable @typescript-eslint/no-explicit-any */
export function setSessionWithExpiry(
  key: string,
  value: any,
  ttlSeconds: number
) {
  const now = Date.now();

  const data = {
    value: value,
    expiry: now + ttlSeconds * 1000,
  };

  sessionStorage.setItem(key, JSON.stringify(data));
}
