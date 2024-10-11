export function getToken() {
    if (process.client) {
      return localStorage.getItem('token');
    } else {
      return null;
    }
  }
  