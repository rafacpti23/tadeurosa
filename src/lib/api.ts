import { Device } from '@/types/traccar';

const TRACCAR_API_URL = process.env.NEXT_PUBLIC_TRACCAR_API_URL || 'http://localhost:8082/api';

function createBasicAuth(emailOrToken: string, passwordOrEmpty: string = '') {
  return `Basic ${btoa(`${emailOrToken}:${passwordOrEmpty}`)}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('traccarToken') : null;
  
  // Type headers as Record for safe indexing and spreading
  const headers: Record<string, string> = {
    ... (options.headers as Record<string, string> || {}),
    ...(token && { Authorization: createBasicAuth(token) }), // Basic Auth com token: (senha vazia)
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Só adiciona Content-Type se houver body (evita 415 em GETs)
  if (config.body && !headers['Content-Type']) {
    config.headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(`${TRACCAR_API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorBody = await response.text();
      errorMessage += ` - ${errorBody}`;
    } catch {
      // Ignora se não puder ler body
    }
    throw new Error(errorMessage);
  }
  
  // Traccar às vezes retorna sem body (ex.: 204), então checa se tem content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null; // Para responses vazias
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);

  const response = await fetch(`${TRACCAR_API_URL}/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
  
  if (!response.ok) {
    let errorMessage = 'Falha no login. Verifique email e senha.';
    if (response.status === 401) {
      errorMessage = 'Credenciais inválidas. Tente novamente.';
    } else if (response.status === 415) {
      errorMessage = 'Erro de formato na requisição. Verifique a configuração do servidor.';
    }
    try {
      const errorBody = await response.text();
      errorMessage += ` (${errorBody})`;
    } catch {
      // Ignora
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  if (typeof window !== 'undefined' && data.token) {
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
  return apiFetch('/devices') as Promise<Device[]>;
}