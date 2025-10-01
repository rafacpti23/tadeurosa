'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDevices, getLatestPosition } from '@/lib/api';
import { Device, Position } from '@/types/traccar';
import { Car, MapPin, Clock, Speedometer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Fix default markers in Leaflet (blue icon)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for online/offline
const onlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const offlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DeviceWithPosition extends Device {
  position: Position | null;
}

export function MapView() {
  const [devicesWithPositions, setDevicesWithPositions] = useState<DeviceWithPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const devices = await getDevices();
      const devicesWithPos: DeviceWithPosition[] = [];

      for (const device of devices) {
        const position = await getLatestPosition(device.id);
        devicesWithPos.push({ ...device, position });
      }

      setDevicesWithPositions(devicesWithPos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mapa';
      setError(errorMessage);
      toast('Erro no mapa', { description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refetch a cada 30s
    return () => clearInterval(interval);
  }, []);

  // Default center: São Paulo, Brasil
  const position = [-23.5505, -46.6333];

  if (loading) {
    return (
      <div className="h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="h-[500px] flex items-center justify-center">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const hasPositions = devicesWithPositions.some(d => d.position !== null);

  return (
    <div className={cn("relative h-[500px] w-full rounded-lg overflow-hidden", !hasPositions && "bg-gray-100")}>
      {hasPositions ? (
        <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {devicesWithPositions.map((device) => {
            if (!device.position) return null;
            const icon = device.status === 'online' ? onlineIcon : offlineIcon;
            const lastUpdate = new Date(device.lastUpdate).toLocaleString('pt-BR');
            const speed = device.position.speed ? `${Math.round(device.position.speed)} km/h` : 'N/A';

            return (
              <Marker key={device.id} position={[device.position.latitude, device.position.longitude]} icon={icon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-blue-600">{device.name}</h3>
                    <p><Car className="inline h-4 w-4 mr-1" /> Status: <span className={device.status === 'online' ? 'text-green-600' : 'text-gray-600'}>{device.status}</span></p>
                    <p><Speedometer className="inline h-4 w-4 mr-1" /> Velocidade: {speed}</p>
                    <p><Clock className="inline h-4 w-4 mr-1" /> Última: {lastUpdate}</p>
                    {device.position.address && <p><MapPin className="inline h-4 w-4 mr-1" /> Endereço: {device.position.address}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>Nenhuma localização disponível. Adicione positions no Traccar.</p>
        </div>
      )}
    </div>
  );
}