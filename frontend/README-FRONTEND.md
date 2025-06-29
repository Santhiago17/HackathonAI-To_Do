# Frontend - HackathonAI Todo Application

## Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **TailwindCSS** - Framework de CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones

## Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Arquitetura

### Estrutura de Pastas

- `src/components/` - Componentes reutilizáveis
- `src/pages/` - Páginas da aplicação
- `src/services/` - Serviços de API
- `src/types/` - Definições de tipos TypeScript
- `src/lib/` - Utilitários e schemas
- `src/router/` - Configuração de rotas

### Comunicação com Backend

O frontend se comunica com o backend através de:
- **Desenvolvimento**: Proxy do Vite (`/api` -> `http://localhost:8080`)
- **Produção**: URL configurada na variável `VITE_BASE_URL`

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa linting
