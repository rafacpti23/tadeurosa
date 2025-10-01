import { useState, useEffect } from 'react';
import { login, logout } from '@/lib/api';
import { LoginResponse } from '@/types/traccar';

export function useAuth() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('traccarToken');
    if (token) {
      // Aqui você pode validar o token se quiser, mas para simplicidade, assume válido
      setUser({ token } as LoginResponse);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}