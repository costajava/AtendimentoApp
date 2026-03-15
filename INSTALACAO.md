# Guia de Instalação - AtendimentoApp

## Passo a Passo para Executar o Projeto

### 1. Verificar Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** versão 18 ou superior
- **npm** versão 9 ou superior

Para verificar as versões instaladas:
```bash
node --version
npm --version
```

### 2. Instalar Angular CLI

```bash
npm install -g @angular/cli@20.1.0
```

Verifique a instalação:
```bash
ng version
```

### 3. Instalar Dependências do Projeto

Navegue até a pasta do projeto:
```bash
cd c:\devnet\ExaAtendimento\AtendimentoApp
```

Instale todas as dependências:
```bash
npm install
```

Este comando irá instalar:
- Angular 20.1.0 e seus módulos
- Angular Material
- Tailwind CSS
- RxJS
- TypeScript
- E todas as outras dependências listadas no `package.json`

### 4. Configurar a URL da API

Edite o arquivo `src/environments/environment.ts` e ajuste a URL da API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'  // Altere para a porta da sua API
};
```

### 5. Executar a Aplicação

Inicie o servidor de desenvolvimento:
```bash
npm start
```

Ou:
```bash
ng serve
```

A aplicação estará disponível em: **http://localhost:4200**

### 6. Verificar a API Backend

Certifique-se de que a API .NET está rodando. Para iniciar a API:

```bash
cd c:\devnet\ExaAtendimento\ExaAtendimento.API
dotnet run
```

### 7. Configurar CORS na API (se necessário)

Se encontrar erros de CORS, adicione a configuração no arquivo `Program.cs` da API:

```csharp
// Adicione antes de builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Adicione após app.UseHttpsRedirection()
app.UseCors("AllowAngular");
```

## Comandos Úteis

### Desenvolvimento
```bash
npm start                 # Inicia o servidor de desenvolvimento
ng serve --open          # Inicia e abre o navegador automaticamente
ng serve --port 4300     # Inicia em uma porta diferente
```

### Build
```bash
npm run build            # Build de produção
ng build --configuration development  # Build de desenvolvimento
```

### Testes
```bash
npm test                 # Executa testes unitários
ng test                  # Executa testes com Karma
```

## Estrutura de Pastas Criadas

Após a instalação, você terá:

```
AtendimentoApp/
├── node_modules/        # Dependências instaladas (criado após npm install)
├── src/
│   ├── app/
│   │   ├── components/  # Todos os componentes CRUD
│   │   ├── models/      # Interfaces TypeScript
│   │   ├── services/    # Serviços HTTP
│   │   └── ...
│   ├── environments/
│   └── ...
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Erro: "Cannot find module '@angular/core'"
**Solução:** Execute `npm install` na pasta do projeto

### Erro: "ng: command not found"
**Solução:** Instale o Angular CLI globalmente: `npm install -g @angular/cli@20.1.0`

### Erro de CORS ao fazer requisições
**Solução:** Configure CORS na API conforme descrito no passo 7

### Porta 4200 já está em uso
**Solução:** Execute `ng serve --port 4300` para usar outra porta

### Erro de SSL/HTTPS
**Solução:** Para desenvolvimento, você pode:
1. Usar HTTP em vez de HTTPS no `environment.ts`
2. Ou aceitar o certificado auto-assinado no navegador

## Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Acesse http://localhost:4200
2. ✅ Navegue pelo menu lateral
3. ✅ Teste os CRUDs de cada módulo
4. ✅ Verifique a integração com a API

## Suporte

Para problemas ou dúvidas:
- Verifique o console do navegador (F12)
- Verifique o terminal onde o `ng serve` está rodando
- Consulte a documentação do Angular: https://angular.io/docs
