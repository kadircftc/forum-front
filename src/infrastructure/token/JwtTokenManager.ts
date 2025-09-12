class LocalStorage {
  getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }
}

const LOCAL_STORAGE = {
  JWT: 'jwtToken',
  REFRESH: 'refreshToken',
};

export class JwtTokenManager {
  private localStorage = new LocalStorage();

  getToken = (): string | null => {
    return this.localStorage.getItem(LOCAL_STORAGE.JWT);
  };

  saveToken = (token: string): void => {
    this.localStorage.setItem(LOCAL_STORAGE.JWT, token);
  };

  destroyToken = (): void => {
    this.localStorage.removeItem(LOCAL_STORAGE.JWT);
  };

  getRefreshToken = (): string | null => {
    return this.localStorage.getItem(LOCAL_STORAGE.REFRESH);
  };

  saveRefreshToken = (token: string): void => {
    this.localStorage.setItem(LOCAL_STORAGE.REFRESH, token);
  };

  destroyRefreshToken = (): void => {
    this.localStorage.removeItem(LOCAL_STORAGE.REFRESH);
  };

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      console.error('Error decoding token', e);
      return true;
    }
  }
} 