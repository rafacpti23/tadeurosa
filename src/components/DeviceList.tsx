'use client';

import { useState, useEffect } from 'react';
import { getDevices } from '@/lib/api';
import { Device } from '@/types/traccar';
import { DeviceCard } from './DeviceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        toast('Erro ao carregar veículos', { description: errorMessage, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full max-w-sm mx-auto" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mx-auto max-w-md">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
      {devices.length === 0 && (
        <Alert className="col-span-full mx-auto max-w-md">
          <AlertDescription>Nenhum veículo encontrado. Adicione um no Traccar.</AlertDescription>
        </Alert>
      )}
      <Button onClick={signOut} variant="outline" className="col-span-full max-w-md mx-auto mt-4">
        Sair
      </Button>
    </div>
  );
}