'use client';

import { DeviceList } from '@/components/DeviceList';
import { SidebarNav } from '@/components/SidebarNav';
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
    <div className="flex min-h-screen bg-white">
      <SidebarNav />
      <main className="flex-1 p-8">
        <DeviceList />
      </main>
    </div>
  );
}