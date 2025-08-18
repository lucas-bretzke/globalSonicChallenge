# globalSonicChallenge

## Descrição

O projeto **globalSonicChallenge** é uma aplicação fullstack composta por um cliente web em Vue.js e um servidor Node.js com Express e Prisma. O objetivo é gerenciar dispositivos de forma eficiente, com interface amigável e backend robusto.

## Estrutura do Projeto

```
globalSonicChallenge/
├── client/        # Frontend Vue.js
│   ├── src/
│   │   ├── components/   # Componentes Vue
│   │   ├── routes/       # Rotas do frontend
│   │   ├── services/     # Serviços de API e WebSocket
│   │   ├── views/        # Páginas principais
│   │   └── ...
│   ├── public/           # Arquivos estáticos
│   └── ...
├── server/        # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/  # Lógica dos endpoints
│   │   ├── middlewares/  # Middlewares Express
│   │   ├── repositories/ # Repositórios de dados
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Regras de negócio
│   │   └── ...
│   ├── prisma/           # Migrations e schema do banco
│   └── ...
└── README.md
```

## Tecnologias Utilizadas

- **Frontend:** Vue.js, Vite
- **Backend:** Node.js, Express, Prisma
- **Banco de Dados:** SQLite/PostgreSQL (configurável via Prisma)

## Como Executar

### Pré-requisitos

- Node.js instalado
- Gerenciador de pacotes npm

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/lucas-bretzke/globalSonicChallenge.git
   ```
2. Instale as dependências do frontend e backend:
   ```sh
   cd globalSonicChallenge/client
   npm install
   cd ../server
   npm install
   ```

### Executando o Backend

1. Configure o banco de dados em `server/prisma/schema.prisma` se necessário.
2. Execute as migrations:
   ```sh
   npx prisma migrate dev
   ```
3. Inicie o servidor:
   ```sh
   npm run dev
   ```

### Executando o Frontend

1. No diretório `client`, inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```
2. Acesse `http://localhost:5173` no navegador.

## Funcionalidades

- Cadastro e listagem de dispositivos
- Validação de dados
- Comunicação em tempo real via WebSocket
- Interface responsiva

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que deseja modificar.

## Licença

Este projeto está sob a licença MIT.
