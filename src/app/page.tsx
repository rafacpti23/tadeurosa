'use client';

import { DeviceList } from '@/components/DeviceList';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Tadeu Raster</h1>
        <p className="text-sm">Seus veículos em tempo real</p>
      </header>
      <main className="py-8">
        <DeviceList />
      </main>
    </div>
  );
}