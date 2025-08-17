# global-sonic-challenge-server

Backend Node.js + TypeScript + PostgreSQL + Prisma + Express + Socket.io

## Scripts

- `npm run dev` — inicia em modo desenvolvimento
- `npm run build` — compila TypeScript
- `npm start` — executa produção

## Estrutura

- Modular: src/controllers, src/services, src/repositories, src/routes
- Prisma ORM para PostgreSQL
- WebSocket com socket.io
- Validações com zod
- Middleware global de erros

## .env exemplo

Veja `.env.example` para configuração:

```
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## Rotas REST

- `POST /api/devices` — cria dispositivo (name, mac únicos, status ATIVO)
- `GET /api/devices` — lista dispositivos
- `PATCH /api/devices/:id/status` — alterna status ATIVO/INATIVO

## WebSocket

- Eventos: `device:created`, `device:status`

## Inicialização

1. Instale dependências: `npm install`
2. Configure `.env`
3. Rode migrations Prisma: `npx prisma migrate dev`
4. Inicie: `npm run dev`
