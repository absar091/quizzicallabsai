/**
 * API Client Utility
 * Handles authenticated API calls with automatic token injection
 */

import { getAuth } from 'firebase/auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function postAI(endpoint: string, data: any) {
  return fetchWithAuth(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
