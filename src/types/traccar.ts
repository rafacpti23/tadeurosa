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

export interface User {
  id: number;
  attributes: Record<string, any>;
  name: string;
  cpf?: string;
  telegram?: string | null;
  login?: string;
  email: string;
  phone?: string;
  readonly: boolean;
  administrator: boolean;
  map?: string;
  latitude: number;
  longitude: number;
  zoom: number;
  twelveHourFormat: boolean;
  coordinateFormat?: string;
  disabled: boolean;
  expirationTime: string | null;
  deviceLimit: number;
  userLimit: number;
  deviceReadonly: boolean;
  token: string | null;
  limitCommands: boolean;
  poiLayer?: string;
  password: string | null;
}