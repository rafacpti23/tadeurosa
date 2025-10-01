# Documentação da API do Traccar

Esta é uma referência resumida da API REST do Traccar (versão 1), uma plataforma open-source para rastreamento GPS. Baseado na documentação oficial: [https://www.traccar.org/api-reference/](https://www.traccar.org/api-reference/).

A API usa métodos HTTP (GET, POST, PUT, DELETE), autenticação via sessões (login com token JWT) e formato JSON. Base URL: `https://your-traccar-server/api/`.

## Autenticação
- **POST /api/session**: Login (body: `{email: string, password: string}`). Retorna token de sessão. Header: `Authorization: Basic <base64(email:password)>`.
- **DELETE /api/session**: Logout.

Sempre autentique antes de usar outros endpoints.

## Usuários (Users)
- **GET /api/users**: Lista usuários (admin only).
- **POST /api/users**: Cria usuário (body: `{name, email, password, ...}`).
- **PUT /api/users**: Atualiza usuário.
- **DELETE /api/users**: Remove usuário.
- **GET/PUT/DELETE /api/users/{id}**: Operações em usuário específico.

## Dispositivos (Devices)
- **GET /api/devices**: Lista dispositivos.
- **POST /api/devices**: Adiciona dispositivo (body: `{name, uniqueId, ...}` – uniqueId é IMEI ou similar).
- **PUT /api/devices**: Atualiza dispositivo.
- **DELETE /api/devices**: Remove dispositivo.
- **GET/PUT/DELETE /api/devices/{id}**: Operações específicas.

## Posições (Positions) – Core para Rastreamento
- **GET /api/positions**: Lista posições (query: `?deviceId=123&from=2023-01-01T00:00:00Z&to=2023-01-02T00:00:00Z&limit=100`).
- **POST /api/positions**: Envia nova posição (body: `{deviceId, latitude, longitude, time, speed, ...}`).
- **DELETE /api/positions**: Remove posições.
- **GET /api/positions/{id}**: Detalhes de posição.

Suporta filtros por data, dispositivo e paginação.

## Geofences (Áreas Geográficas)
- **GET /api/geofences**: Lista geofences.
- **POST /api/geofences**: Cria geofence (body: `{name, description, area: "CIRCLE(lat lng radius)" ou POLYGON}`).
- **PUT/DELETE /api/geofences**: Atualiza/remove.
- **GET/PUT/DELETE /api/geofences/{id}**: Operações específicas.

## Notificações (Notifications)
- **GET /api/notifications**: Lista notificações.
- **POST /api/notifications**: Cria notificação (body: `{type: 'geofenceEnter', ...}` – ex.: email ou push).
- **GET/PUT/DELETE /api/notifications/{id}**: Gerencia individuais.

## Relatórios (Reports) – GET-only com filtros
- **/api/reports/route**: Rotas (trajetos).
- **/api/reports/events**: Eventos (paradas, acelerações).
- **/api/reports/trips**: Viagens.
- **/api/reports/stops**: Paradas.
- **/api/reports/summary**: Resumo geral.
Query params: `deviceId`, `from`, `to`, `groupBy` (ex.: dia).

## Comandos (Commands)
- **GET /api/commands**: Lista comandos pendentes.
- **POST /api/commands**: Envia comando (body: `{deviceId, type: 'positionRequest', ...}` – ex.: solicitar GPS).
- **GET/PUT/DELETE /api/commands/{id}**: Gerencia comandos.

## Outros Endpoints Úteis
- **/api/permissions**: Gerencia permissões (usuário-dispositivo/geofence).
- **/api/attributes**: Atributos personalizados (body: chave-valor).
- **/api/server**: Configurações do servidor (admin).
- **/api/statistics**: Estatísticas (dispositivos online, mensagens).
- **/api/events**: Eventos de rastreamento (ex.: overspeed).

## Dicas de Integração
- **Headers**: `Content-Type: application/json`. Use token de sessão em `Cookie` ou `Authorization`.
- **Erros**: HTTP codes (200 OK, 401 Unauthorized, 404 Not Found). Body de erro: `{message: string}`.
- **Paginação**: Use `?limit=100&offset=0`.
- **WebSockets**: Para real-time, use `/api/socket` após autenticação.
- **Exemplo de Chamada (fetch em JS)**:
  ```javascript
  const response = await fetch('/api/positions?deviceId=123', {
    headers: { 'Authorization': 'Bearer your-token' }
  });
  const data = await response.json();
  ```
- **Bibliotecas**: Use `fetch` nativo ou Axios. Para TypeScript, defina interfaces para responses (ex.: Position { deviceId: number, latitude: number, ... }).

Para mais detalhes, consulte a doc oficial. Atualize este arquivo conforme necessário!