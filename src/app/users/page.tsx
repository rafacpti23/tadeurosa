'use client';

import { UserList } from '@/components/UserList';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user: authUser, loading } = useAuth(); // 'user' aqui é o estado de auth, não o User do Traccar
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Usuários do Sistema</h1>
        <p className="text-sm">Gerencie usuários (Admin apenas)</p>
      </header>
      <main className="py-8">
        <UserList />
      </main>
    </div>
  );
}