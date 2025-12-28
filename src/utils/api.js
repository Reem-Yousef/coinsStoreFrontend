const API_BASE = 'https://coins-store-backend.vercel.app/api';

let accessToken = localStorage.getItem('accessToken');

// ✅ دالة لتجديد الـ Access Token
const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    accessToken = data.accessToken;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (err) {
    localStorage.removeItem('accessToken');
    window.location.href = '/admin/login';
    throw err;
  }
};

// ✅ دالة API موحدة مع Auto-refresh
export const apiCall = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  // لو الـ Token منتهي، جدده وحاول تاني
  if (res.status === 401) {
    const data = await res.json();
    if (data.code === 'TOKEN_EXPIRED') {
      await refreshAccessToken();
      
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
        credentials: 'include'
      });
    }
  }

  return res;
};

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
};