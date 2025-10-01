export interface LoginResponse {
  token: string;
  language: string;
  admin: boolean;
}

export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: 'online' | 'offline' | 'unknown';
  lastUpdate: string;
  positionId: number;
  groupId?: number;
  attributes: Record<string, any>;
}

export interface Position {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number;
  serverTime: string;
  attributes: Record<string, any>;
}