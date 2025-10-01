import { Device } from '@/types/traccar';

const TRACCAR_API_URL = process.env.NEXT_PUBLIC_TRACCAR_API_URL || 'http://localhost:8082/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('traccarToken') : null;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Basic ${btoa(`${token}:`)}` }), // Ou use Bearer se preferir
      ...options.headers,
    },
  };

  const response = await fetch(`${TRACCAR_API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${await response.text()}`);
  }
  
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${TRACCAR_API_URL}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Falha no login. Verifique email e senha.');
  }
  
  const data = await response.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('traccarToken', data.token);
  }
  return data;
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('traccarToken');
  }
  await apiFetch('/session', { method: 'DELETE' });
}

export async function getDevices(): Promise<Device[]> {
  return apiFetch('/devices');
}