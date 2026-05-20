# 🏋️ PilatesControl - Sistema de Gerenciamento de Alunos

Uma aplicação web moderna para fisioterapeutas gerenciarem alunos, evoluções clínicas e controle de mensalidades com integração WhatsApp para cobrança.

## 🎯 Funcionalidades

- ✅ **Gerenciamento de Alunos**: Cadastro, edição e visualização de alunos
- 📋 **Evoluções Clínicas**: Registro e acompanhamento de progresso do paciente
- 💰 **Controle de Mensalidades**: Acompanhamento de pagamentos por aluno
- 🔔 **Cobrança via WhatsApp**: Enviar lembretes de pagamento direto via WhatsApp
- 📊 **Dashboard**: Visualizar estatísticas em tempo real
- 🎨 **Design Responsivo**: Mobile-first, funciona em qualquer dispositivo

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS v4
- **Banco de Dados**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Linter**: ESLint

## 📋 Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

## 🔧 Instalação

### 1. Configurar o Supabase

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Na aba **SQL Editor**, execute o script SQL fornecido em `supabase.sql`
4. Copie suas credenciais:
   - URL do Supabase
   - Chave Anon (Public)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

## 🏗️ Estrutura do Projeto

```
pilatesControll/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientList.tsx
│   │   ├── PatientCard.tsx
│   │   ├── PatientDetails.tsx
│   │   ├── EvolutionForm.tsx
│   │   └── OverduePatients.tsx
│   ├── pages/               # Páginas principais
│   ├── services/            # Integração Supabase
│   │   └── supabase.ts
│   ├── types/               # Interfaces TypeScript
│   │   └── index.ts
│   ├── utils/               # Funções utilitárias
│   │   └── helpers.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── public/                  # Ativos estáticos
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── supabase.sql             # Script SQL do banco
└── README.md                # Este arquivo
```

## 📖 Como Usar

### Adicionar um Novo Aluno

1. Clique em "Novo Aluno" ou na aba "Alunos"
2. Preencha os dados:
   - Nome completo
   - Idade
   - Foco da patologia (ex: Dor nas costas)
   - WhatsApp/Celular
   - Dia de vencimento da mensalidade
3. Clique em "Adicionar Aluno"

### Registrar Evolução Clínica

1. Acesse a aba "Evolução"
2. Selecione um aluno da lista
3. Clique em "Adicionar Evolução"
4. Descreva a evolução do paciente
5. Clique em "Salvar Evolução"

### Gerenciar Pagamentos

- Na aba "Alunos" ou "Início", você verá o status de pagamento de cada aluno
- Use o checkbox **"Já pagou este mês?"** para atualizar o status
- Na tela inicial, há uma seção "⚠️ Cobrança Urgente" mostrando alunos inadimplentes

### Enviar Lembrete via WhatsApp

1. Acesse a aba "Início" para ver os alunos inadimplentes
2. Clique no botão **"🔔 Lembrar"** ao lado do aluno
3. O WhatsApp Web abrirá automaticamente com a mensagem pré-formatada
4. Confirme o envio da mensagem

## 🔐 Segurança em Produção

⚠️ **Importante**: O script SQL inclui políticas RLS permissivas para facilitar o desenvolvimento. Para produção:

1. Implemente autenticação via Supabase Auth
2. Restrinja as políticas RLS apenas a usuários autenticados
3. Use variáveis de ambiente para as chaves Supabase
4. Configure um SSL certificate
5. Implemente rate limiting para requisições

### Exemplo de RLS Segura:

```sql
CREATE POLICY "Usuários podem ler seus próprios dados"
  ON pacientes
  FOR SELECT
  USING (auth.uid() = user_id);
```

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente Supabase não configuradas"

- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
- As variáveis devem ter o prefixo `VITE_` para o Vite acessá-las

### WhatsApp não abre

- Alguns navegadores bloqueiam pop-ups. Verifique as configurações do navegador
- O link só funciona com WhatsApp Web aberto em outro navegador ou aplicativo
- Certifique-se de que o número de telefone está no formato correto (com código do país)

### Dados não aparecem após inserir

- Verifique se a conexão Supabase está correta
- Acesse o Supabase Dashboard para confirmar que os dados foram salvos
- Verifique o console do navegador para mensagens de erro

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do React](https://react.dev)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licença

Este projeto é fornecido como-está para fins educacionais e comerciais.

---

Desenvolvido com ❤️ para fisioterapeutas que amam organização!
