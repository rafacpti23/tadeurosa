'use client';

import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/api';
import { User } from '@/types/traccar';
import { UserCard } from './UserCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        toast('Erro ao carregar usuários', { description: errorMessage, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);

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
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      {users.length === 0 && (
        <Alert className="col-span-full mx-auto max-w-md">
          <AlertDescription>Nenhum usuário encontrado.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}