'use client';

import { Device } from '@/types/traccar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const statusColor = device.status === 'online' ? 'bg-green-500' : 'bg-gray-500';
  const lastUpdate = new Date(device.lastUpdate).toLocaleString('pt-BR');

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-600">{device.name}</CardTitle>
        <Badge className={`${statusColor} text-white`}>{device.status.toUpperCase()}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-pink-500" />
          <CardDescription>ID: {device.uniqueId}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-pink-500" />
          <CardDescription>Última atualização: {lastUpdate}</CardDescription>
        </div>
        {device.status === 'online' && (
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-500" />
            <CardDescription>Online</CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  );
}