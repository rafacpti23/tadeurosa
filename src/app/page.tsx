'use client';

import { DeviceList } from '@/components/DeviceList';
import { SidebarNav } from '@/components/SidebarNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MapView } from '@/components/MapView';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-white">
        <SidebarNav />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <h1 className="text-2xl font-bold mb-6 text-blue-600">Dashboard - Localizações em Tempo Real</h1>
          
          {/* Mapa Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Mapa de Veículos</h2>
            <MapView />
          </section>
          
          {/* Lista de Devices */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Lista de Veículos</h2>
            <DeviceList />
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
}