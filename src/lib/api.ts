import { Device, User } from '@/types/traccar';

const TRACCAR_API_URL = process.env.NEXT_PUBLIC_TRACCAR_API_URL || 'http://localhost:8082/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Envia cookies de sessão cross-origin (essencial para auth pós-login)
  };

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
    credentials: 'include', // Recebe e define cookies de sessão no login
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
  // Não salvamos token mais — usamos cookie de sessão
  return data;
}

export async function logout() {
  await apiFetch('/session', { method: 'DELETE' });
}

export async function getDevices(): Promise<Device[]> {
  return apiFetch('/devices') as Promise<Device[]>;
}

export async function getUsers(): Promise<User[]> {
  return apiFetch('/users') as Promise<User[]>;
}