# AtendimentoApp

Sistema de gerenciamento de atendimentos desenvolvido em Angular 20.1.0.

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
npm start
```

Ou:

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

✅ **Dashboard** - Visão geral do sistema
✅ **Assuntos** - CRUD completo
✅ **Atendimentos** - CRUD completo com relacionamentos
✅ **CAs** - CRUD completo com datas e status
✅ **Clientes** - CRUD completo com status ativo/inativo
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

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── assunto/
│   │   │   ├── assunto-list/
│   │   │   └── assunto-form/
│   │   ├── atendimento/
│   │   │   ├── atendimento-list/
│   │   │   └── atendimento-form/
│   │   ├── ca/
│   │   ├── cliente/
│   │   ├── dashboard/
│   │   ├── modulo/
│   │   ├── sugestao/
│   │   ├── tipo-atendimento/
│   │   ├── usuario/
│   │   └── shared/
│   │       └── confirm-dialog/
│   ├── models/
│   │   ├── assunto.model.ts
│   │   ├── atendimento.model.ts
│   │   ├── ca.model.ts
│   │   ├── cliente.model.ts
│   │   ├── modulo.model.ts
│   │   ├── page-request.model.ts
│   │   ├── sugestao.model.ts
│   │   ├── tipo-atendimento.model.ts
│   │   └── usuario.model.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── assunto.service.ts
│   │   ├── atendimento.service.ts
│   │   ├── ca.service.ts
│   │   ├── cliente.service.ts
│   │   ├── modulo.service.ts
│   │   ├── sugestao.service.ts
│   │   ├── tipo-atendimento.service.ts
│   │   └── usuario.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss
```

## Rotas da Aplicação

- `/` - Redireciona para Dashboard
- `/dashboard` - Página inicial
- `/assuntos` - Lista de assuntos
- `/assuntos/novo` - Novo assunto
- `/assuntos/:id` - Editar assunto
- `/atendimentos` - Lista de atendimentos
- `/atendimentos/novo` - Novo atendimento
- `/atendimentos/:id` - Editar atendimento
- `/cas` - Lista de CAs
- `/clientes` - Lista de clientes
- `/modulos` - Lista de módulos
- `/sugestoes` - Lista de sugestões
- `/tipos-atendimento` - Lista de tipos de atendimento
- `/usuarios` - Lista de usuários

## Integração com API

Todos os serviços estendem `ApiService` que fornece métodos HTTP padronizados:

- `get<T>(endpoint, params?)` - GET request
- `post<T>(endpoint, body)` - POST request
- `put<T>(endpoint, body)` - PUT request
- `delete<T>(endpoint)` - DELETE request

## Troubleshooting

### Erro de CORS
Configure CORS na API .NET para aceitar requisições do Angular:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowAngular");
```

### Erro de SSL
Para desenvolvimento, você pode desabilitar a verificação SSL ou usar HTTP.

## Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação nas listas
- [ ] Implementar filtros avançados
- [ ] Adicionar gráficos no dashboard
- [ ] Implementar exportação de dados (Excel/PDF)
- [ ] Adicionar testes unitários
- [ ] Implementar PWA
