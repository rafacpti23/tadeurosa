import { useState, useEffect } from 'react';
import { login, logout } from '@/lib/api';
import { LoginResponse } from '@/types/traccar';

export function useAuth() {
  const [user, setUser] = useState<boolean>(false); // Agora só flag de login (sem token)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há sessão ativa via cookie (faz um request simples para validar)
    async function checkSession() {
      try {
        // Usa um endpoint que requer auth para checar (ex.: /devices, mas sem setar estado)
        await fetch(process.env.NEXT_PUBLIC_TRACCAR_API_URL + '/devices', { credentials: 'include' });
        setUser(true);
      } catch {
        setUser(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setUser(true); // Login sucesso define flag
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const signOut = async () => {
    await logout();
    setUser(false);
  };

  return { user, loading, signIn, signOut };
}