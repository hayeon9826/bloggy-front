export function getLocalStorageValue(receivedKey: string) {
  let storageObj;

  if (typeof window !== "undefined") {
    storageObj = window.localStorage.getItem(receivedKey);
  }

  return storageObj;
}

export function setLocalStorage(key: string, value: string): boolean {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
    return true;
  }
  return false;
}

export function deleteLocalStorage(receivedKey: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(receivedKey);
  }
}
