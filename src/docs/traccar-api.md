# Documentação da API do Traccar

Esta é uma referência resumida e expandida da API REST do Traccar (versão 1), uma plataforma open-source para rastreamento GPS. Baseado na documentação oficial: [https://www.traccar.org/api-reference/](https://www.traccar.org/api-reference/). Foco em endpoints para apps de usuário final, como visualização de dispositivos, histórico de rastreamento, relatórios e notificações.

A API usa métodos HTTP (GET, POST, PUT, DELETE), autenticação via sessões (login com token JWT) e formato JSON. Base URL: `https://your-traccar-server/api/`. Para apps de usuário final, priorize autenticação segura, listagem de dispositivos e relatórios filtrados por data/dispositivo.

## Autenticação (Sessions)
Essencial para login/logout no app.

- **POST /api/session**: Login.  
  Body: `{ "email": "user@example.com", "password": "senha" }`.  
  Headers: `Authorization: Basic <base64(email:password)>` ou `Content-Type: application/json`.  
  Response: `{ "token": "jwt-token", "language": "en", "admin": false }`.  
  Interface TS:  
  ```typescript
  interface LoginResponse {
    token: string;
    language: string;
    admin: boolean;
  }
  ```

- **DELETE /api/session**: Logout.  
  Headers: `Cookie: JSESSIONID=token` ou `Authorization: Bearer <token>`.  
  Response: 204 No Content.

Sempre inclua o token em requests subsequentes via `Authorization: Bearer <token>` ou cookie.

## Usuários (Users) – Para gerenciamento de contas
Útil para perfis de usuário no app.

- **GET /api/users**: Lista usuários (admin only). Query: `?limit=10&offset=0`.  
  Response: Array de usuários.

- **POST /api/users**: Cria usuário.  
  Body: `{ "name": "João", "email": "joao@example.com", "password": "senha", "readonly": false, "disabled": false, "expirationTime": "2024-12-31T00:00:00Z", "attributes": {} }`.  
  Response: Usuário criado.

- **PUT /api/users**: Atualiza usuário (batch).  
- **DELETE /api/users**: Remove usuários (batch).  

- **GET /api/users/{id}**: Detalhes de usuário.  
- **PUT /api/users/{id}**: Atualiza usuário específico.  
- **DELETE /api/users/{id}**: Remove usuário.  

Interface TS para User:  
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  readonly: boolean;
  disabled: boolean;
  expirationTime?: string;
  attributes: Record<string, any>;
}
```

## Dispositivos (Devices) – Core para listagem e gerenciamento no app
Para exibir veículos/trackers no dashboard do usuário.

- **GET /api/devices**: Lista dispositivos do usuário. Query: `?all=true` (todos), `?groupId=1` (por grupo), `limit=50`.  
  Response: Array de dispositivos.  
  Interface TS:  
  ```typescript
  interface Device {
    id: number;
    name: string;
    uniqueId: string; // IMEI ou ID único
    status: 'online' | 'offline' | 'unknown';
    lastUpdate: string; // ISO date
    positionId: number;
    groupId?: number;
    attributes: Record<string, any>;
  }
  ```

- **POST /api/devices**: Adiciona dispositivo.  
  Body: `{ "name": "Veículo 1", "uniqueId": "123456789", "groupId": 1, "attributes": { "color": "red" } }`.  
  Response: Dispositivo criado.

- **PUT /api/devices**: Atualiza dispositivos (batch).  
- **DELETE /api/devices**: Remove dispositivos (batch).  

- **GET /api/devices/{id}**: Detalhes de dispositivo.  
- **PUT /api/devices/{id}**: Atualiza (ex.: nome, status).  
- **DELETE /api/devices/{id}**: Remove.  

Para app: Use GET para listar no dashboard e PUT para editar nomes.

## Grupos (Groups) – Para organizar dispositivos
Útil para apps com múltiplos veículos (ex.: frota).

- **GET /api/groups**: Lista grupos.  
- **POST /api/groups**: Cria grupo. Body: `{ "name": "Frota Norte" }`.  
- **PUT /api/groups**: Atualiza.  
- **DELETE /api/groups**: Remove.  
- **GET/PUT/DELETE /api/groups/{id}**: Operações específicas.  

Interface TS:  
```typescript
interface Group {
  id: number;
  name: string;
}
```

## Posições (Positions) – Para mapas e histórico de rastreamento
Core para visualização em tempo real ou histórico no app.

- **GET /api/positions**: Lista posições. Query: `?deviceId=123&from=2023-01-01T00:00:00Z&to=2023-01-02T00:00:00Z&limit=100&protocol=gt06`.  
  Response: Array de posições.  
  Interface TS:  
  ```typescript
  interface Position {
    id: number;
    deviceId: number;
    protocol: string;
    serverTime: string;
    deviceTime: string;
    fixTime: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    course: number;
    address?: string;
    attributes: Record<string, any>; // ex.: { battery: 80, odometer: 1000 }
  }
  ```

- **POST /api/positions**: Envia posição (para simulação ou integração com hardware).  
  Body: `{ "deviceId": 123, "protocol": "gt06", "latitude": -23.5505, "longitude": -46.6333, "speed": 50, "course": 90, "altitude": 100, "attributes": {} }`.  

- **DELETE /api/positions**: Remove posições (batch). Query: `?from=...&to=...`.  
- **GET /api/positions/{id}**: Detalhes.  
- **DELETE /api/positions/{id}**: Remove específica.  

Para app: Integre com mapas (ex.: Leaflet ou Google Maps) usando GET com filtros de data/dispositivo.

## Geofences (Áreas Geográficas) – Para alertas de zonas
Para notificar entrada/saída em áreas definidas.

- **GET /api/geofences**: Lista. Query: `?limit=20`.  
- **POST /api/geofences**: Cria. Body: `{ "name": "Zona Segura", "description": "Área residencial", "area": "CIRCLE(40.7128 -74.0060 1000)" }` (círculo) ou `POLYGON((lat1 lng1, lat2 lng2))`.  
- **PUT /api/geofences**: Atualiza.  
- **DELETE /api/geofences**: Remove.  
- **GET/PUT/DELETE /api/geofences/{id}**: Específicas.  

Interface TS:  
```typescript
interface Geofence {
  id: number;
  name: string;
  description: string;
  area: string; // WKT format
}
```

## Notificações (Notifications) – Para alertas no app
Para push notifications ou toasts sobre eventos.

- **GET /api/notifications**: Lista notificações do usuário.  
- **POST /api/notifications**: Cria. Body: `{ "type": "geofenceEnter", "geofenceId": 1, "deviceId": 123, "allDevices": false, "notificators": { "web": true, "mail": true } }`. Tipos: `geofenceEnter`, `geofenceExit`, `deviceOnline`, `overspeed`, etc.  
- **GET/PUT/DELETE /api/notifications/{id}**: Gerencia.  

Interface TS:  
```typescript
interface Notification {
  id: number;
  type: string;
  geofenceId?: number;
  deviceId?: number;
  allDevices: boolean;
  notificators: Record<string, boolean>; // ex.: { web: true, mail: false }
}
```

## Relatórios (Reports) – Para dashboards e histórico
GET-only, ideais para telas de relatórios no app. Todos suportam query: `deviceId`, `groupId`, `from`, `to`, `format=json`.

- **GET /api/reports/route**: Rotas/trajetos. Response: Array de posições com speed/course.  
- **GET /api/reports/events**: Eventos (paradas, acelerações). Query: `?type=stop,overspeed`.  
- **GET /api/reports/trips**: Viagens (início/fim, duração, distância).  
- **GET /api/reports/stops**: Paradas (duração, endereço).  
- **GET /api/reports/summary**: Resumo (distância total, tempo motorizado). Query: `?groupBy=day`.  
- **GET /api/reports/export**: Exporta relatório (query como acima, response: arquivo CSV/Excel se format=excel).  

Interface TS exemplo para Trip:  
```typescript
interface Trip {
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
}
```

Para app: Use Recharts (já no seu package.json) para gráficos de relatórios.

## Comandos (Commands) – Para controle remoto
Para enviar ações aos dispositivos (ex.: buzzer, posição).

- **GET /api/commands**: Lista pendentes. Query: `?deviceId=123`.  
- **POST /api/commands**: Envia. Body: `{ "deviceId": 123, "type": "positionRequest", "attributes": {} }`. Tipos: `positionRequest`, `setTimezone`, `rebootDevice`, etc.  
- **GET/PUT/DELETE /api/commands/{id}**: Gerencia.  

Interface TS:  
```typescript
interface Command {
  id: number;
  deviceId: number;
  type: string;
  attributes: Record<string, any>;
}
```

## Eventos (Events) – Para timeline de incidentes
Útil para feed de eventos no app.

- **GET /api/events**: Lista eventos. Query: `?deviceId=123&from=...&to=...&type=geofenceEnter`. Tipos: `deviceOnline`, `geofenceEnter`, `overspeed`, `motionAlarm`.  
  Response: Array de eventos.  
  Interface TS:  
  ```typescript
  interface Event {
    id: number;
    type: string;
    deviceId: number;
    positionId: number;
    serverTime: string;
    geofenceId?: number;
    attributes: Record<string, any>; // ex.: { speed: 120 }
  }
  ```

## Outros Endpoints Úteis para App de Usuário Final
- **GET /api/permissions**: Permissões (dispositivo/geofence por usuário).  
- **POST /api/permissions**: Adiciona permissão. Body: `{ "userId": 1, "deviceId": 123 }`.  
- **GET /api/attributes**: Atributos do servidor/usuário.  
- **PUT /api/attributes**: Atualiza atributos.  
- **GET /api/server**: Configurações do servidor (ex.: timezone).  
- **GET /api/statistics**: Estatísticas (dispositivos online, mensagens totais). Query: `?from=...&to=...`.  
- **GET /api/calendars**: Calendários para horários de trabalho.  
- **POST /api/calendars**: Cria calendário. Body: `{ "name": "Horário Comercial" }`.  
- **WebSockets para Real-Time**: Conecte em `/api/socket` após login para atualizações de posições/eventos em tempo real. Exemplo: `new WebSocket('wss://server/api/socket?token=your-token');`.

## Dicas de Integração para App Next.js
- **Headers Padrão**: `Content-Type: application/json`, `Authorization: Bearer <token>`.  
- **Erros**: HTTP 200 OK, 401 Unauthorized (re-login), 404 Not Found, 500 Internal. Body: `{ "message": "Erro descritivo" }`.  
- **Paginação**: `?limit=100&offset=0`.  
- **Filtros Comuns**: Datas em ISO (ex.: `from=2023-01-01T00:00:00.000Z`), `deviceId` ou `groupId`.  
- **Exemplo de Fetch em TS**:  
  ```typescript
  async function fetchDevices(token: string): Promise<Device[]> {
    const res = await fetch('/api/devices', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Falha ao carregar dispositivos');
    return res.json();
  }
  ```
- **Bibliotecas**: Use `fetch` nativo. Para mapas, integre com `react-leaflet`. Para toasts, use Sonner (já no projeto). Defina mais interfaces em `src/types/traccar.ts` se precisar.  
- **Segurança**: Armazene tokens em localStorage ou cookies seguros. Para server-side, use Route Handlers no Next.js.

Para mais detalhes ou exemplos avançados, consulte a doc oficial. Atualize este arquivo conforme evoluir o app!