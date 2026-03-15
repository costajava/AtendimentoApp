# AtendimentoApp - Sistema de Atendimento - FrontEnd

Sistema de gerenciamento de atendimentos de Clientes

## Tecnologias

- Angular 20.1.0 (Standalone Components)
- Angular Material
- Tailwind CSS
- TypeScript
- RxJS

## Pré-requisitos

- Node.js 18+ 
- npm 9+
- Angular CLI 20.1.0

## Instalação

1. Instale o Angular CLI globalmente (se ainda não tiver):
```bash
npm install -g @angular/cli@20.1.0
```

2. Navegue até a pasta do projeto:
```bash
cd AtendimentoApp
```

3. Instale as dependências:
```bash
npm install
```

## Configuração

Ajuste a URL da API no arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001' // Altere para a URL da sua API
};
```

## Desenvolvimento

Execute o servidor de desenvolvimento:
```bash
ng serve
```

Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente quando houver alterações nos arquivos.

## Build

Execute o build de produção:

```bash
npm run build
```

Os arquivos de build serão armazenados no diretório `dist/`.

## Funcionalidades

### Módulos Implementados

Clientes e CAs (Centrais de Atendimntos): Dados importados de outra base, por isso
só tem lista / detalhe

✅ **Dashboard** - Visão geral do sistema
✅ **Assuntos** - CRUD completo
✅ **Atendimentos** - CRUD completo com relacionamentos
✅ **CAs** - Lista / Detalhes
✅ **Clientes** - Lista / Detalhes
✅ **Módulos** - CRUD completo
✅ **Sugestões** - CRUD completo com relacionamento de cliente
✅ **Tipos de Atendimento** - CRUD completo
✅ **Usuários** - CRUD completo com perfis e autenticação

### Recursos

- ✅ Navegação lateral responsiva
- ✅ Formulários reativos com validação
- ✅ Diálogos de confirmação
- ✅ Notificações (Snackbar)
- ✅ Tabelas com Material Design
- ✅ Lazy loading de rotas
- ✅ Componentes standalone
- ✅ Integração completa com API REST


