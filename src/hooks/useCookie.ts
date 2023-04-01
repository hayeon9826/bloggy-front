export function getCookieValue(receivedKey: string) {
  let targetValue: string = "";
  if (typeof document !== "undefined") {
    const cookieObj = document.cookie.split(" ").map((cookieStr) => ({
      key: cookieStr.split("=")[0],
      value: cookieStr.split("=")[1],
    }));

    cookieObj.forEach(({ key, value }) => {
      if (key === receivedKey) {
        targetValue = value;
      }
    });
  }

  return targetValue;
}

export function createCookie(
  key: string,
  value: string,
  expireDate?: Date
): boolean {
  if (typeof document !== "undefined") {
    let cookieString = `${key}=${value}`;
    if (expireDate) {
      cookieString += `; expires=${expireDate.toUTCString()}; secure`;
    }
    document.cookie = cookieString;
    return true;
  }
  return false;
}

export function deleteCookie(
  receivedKey: string,
  path?: string,
  domain?: string
) {
  if (typeof document !== "undefined") {
    document.cookie = `${receivedKey}=${path ? `;path=${path}` : ""}${
      domain ? `;domain=${domain}` : ""
    };expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
}
