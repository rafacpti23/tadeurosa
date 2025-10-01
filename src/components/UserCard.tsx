'use client';

import { User } from '@/types/traccar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Shield, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const isAdmin = user.administrator;
  const statusColor = user.disabled ? 'bg-gray-500' : isAdmin ? 'bg-blue-600' : 'bg-green-500';
  const statusText = user.disabled ? 'Desabilitado' : isAdmin ? 'Admin' : 'Ativo';

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-600 flex items-center space-x-2">
          <UserIcon className="h-5 w-5" />
          {user.name || user.email}
        </CardTitle>
        <Badge className={`${statusColor} text-white`}>{statusText}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-pink-500" />
          <CardDescription>{user.email}</CardDescription>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-pink-500" />
            <CardDescription>{user.phone}</CardDescription>
          </div>
        )}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <CardDescription>Administrador</CardDescription>
          </div>
        )}
        {user.expirationTime && (
          <div className="flex items-center space-x-2">
            <CardDescription>Expira: {new Date(user.expirationTime).toLocaleDateString('pt-BR')}</CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  );
}