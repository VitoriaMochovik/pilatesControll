# 🚀 Guia Completo de Deploy - PilatesControl

## Passo 1: Preparar o Projeto para GitHub

### 1.1 Criar arquivo `.gitignore` (se não existir)
```bash
node_modules/
dist/
.env
.env.local
.DS_Store
```

### 1.2 Inicializar Git (se não estiver inicializado)
```bash
cd /home/vitoria/Downloads/pilatesControll
git init
git add .
git commit -m "Initial commit: PilatesControl aplicação completa"
```

---

## Passo 2: Subir para GitHub

### 2.1 Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `pilatescontroll`
3. Descrição: `Aplicação web para gerenciar alunos de Pilates/Fisioterapia`
4. Escolha: **Public** (para deploy gratuito)
5. Clique em **Create repository**

### 2.2 Conectar ao GitHub (via Terminal)
```bash
cd /home/vitoria/Downloads/pilatesControll

# Adicionar remote
git remote add origin https://github.com/SEU_USERNAME/pilatescontroll.git

# Fazer push
git branch -M main
git push -u origin main
```

> ⚠️ **Substitua `SEU_USERNAME`** por seu nome de usuário do GitHub

---

## Passo 3: Criar Supabase Grátis

### 3.1 Registrar em Supabase
1. Acesse https://supabase.com
2. Clique em **Sign Up**
3. Use GitHub (mais fácil) ou Email
4. Complete o formulário

### 3.2 Criar Novo Projeto
1. Dashboard → **+ New Project**
2. **Nome do Projeto**: `pilatescontroll`
3. **Database Password**: Salve em lugar seguro! ⚠️
4. **Region**: Escolha mais próximo (ex: `us-east-1` ou `sa-paulo`)
5. Clique em **Create new project**
6. Aguarde ~5 minutos enquanto cria o banco

### 3.3 Pegar as Credenciais
1. No dashboard do projeto, clique em **Settings** → **API**
2. Copie:
   - **Project URL** (Project ID)
   - **anon key** (Public Key)
3. Guarde essas credenciais!

### 3.4 Executar o Script SQL
1. No Supabase, clique em **SQL Editor**
2. Clique em **+ New Query**
3. Abra o arquivo `supabase.sql` e copie **TODO o conteúdo**
4. Cole na query do Supabase
5. Clique em **RUN ▶️**
6. Verifique se criou as tabelas (deve aparecer "SUCCESS")

---

## Passo 4: Configurar Variáveis de Ambiente

### 4.1 Criar arquivo `.env.local`
Na raiz do projeto (`/home/vitoria/Downloads/pilatesControll/`), crie:

```bash
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
EOF
```

> **Substitua**:
> - `SEU_PROJECT_ID`: Vem da URL do Supabase
> - `sua_anon_key_aqui`: A chave que você copiou

### 4.2 Verificar se funciona localmente
```bash
npm run dev
# Abra http://localhost:5173
# Tente fazer signup/login para testar
```

---

## Passo 5: Publicar no Vercel (Recomendado - Grátis!)

### 5.1 Conectar GitHub ao Vercel
1. Acesse https://vercel.com
2. Clique em **Sign Up**
3. Use GitHub para registrar
4. Autorize Vercel acessar seus repositórios

### 5.2 Importar Projeto
1. Dashboard Vercel → **Add New** → **Project**
2. Procure por `pilatescontroll`
3. Clique em **Import**

### 5.3 Configurar Variáveis
1. Em **Environment Variables**, adicione:
   - **Nome**: `VITE_SUPABASE_URL`
   - **Valor**: `https://SEU_PROJECT_ID.supabase.co`
   
2. Adicione outra:
   - **Nome**: `VITE_SUPABASE_ANON_KEY`
   - **Valor**: Sua chave anon do Supabase

3. Clique em **Deploy**

### 5.4 Aguardar Deploy
- Vercel vai fazer build automaticamente
- Você receberá uma URL como `https://pilatescontroll.vercel.app`
- Acesse e teste! ✅

---

## Passo 6: Alternativas de Deploy

### Netlify (Também Grátis)
1. Acesse https://netlify.com
2. Clique em **Sign up**
3. Use GitHub
4. Clique em **New site from Git**
5. Selecione `pilatescontroll`
6. Adicione as variáveis de ambiente (mesmo que Vercel)
7. Clique em **Deploy**

### Railway (Grátis com limite)
1. Acesse https://railway.app
2. Clique em **New Project**
3. Selecione **Deploy from GitHub**
4. Escolha `pilatescontroll`
5. Adicione variáveis de ambiente
6. Faça deploy

---

## Passo 7: Checklist Final

- [ ] GitHub criado e código enviado
- [ ] Supabase criado com banco de dados
- [ ] Script SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto publicado (Vercel/Netlify/Railway)
- [ ] Testado login/signup
- [ ] Testado criar aluno
- [ ] Testado enviar WhatsApp

---

## Passo 8: Usar em Produção

### Acessar Sua Aplicação
```
https://seu-app.vercel.app
```

### Fazer Mudanças
Qualquer `git push` para `main` vai automaticamente fazer redeploy!

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
# Aguarde 2-5 minutos e a mudança estará online
```

---

## Troubleshooting

### "Invalid API Key"
- Verifique se as variáveis de ambiente estão corretas
- Copie exatamente da Supabase sem espaços

### "Database Error"
- Verifique se o SQL foi executado no Supabase
- Vá em Tables e confirme que existem: `professors`, `students`, `evolutions`, `absences`

### "Build Failed"
- Verifique: `npm run build` localmente
- Se passou localmente, limpe o cache no Vercel: **Settings → Deployments → Clear Cache**

---

## Suporte

Se tiver dúvidas:
1. Verifique logs: Vercel → Deployments → View Logs
2. Teste localmente: `npm run dev`
3. Verifique Supabase: Dashboard → Logs

**Tudo pronto! Sua aplicação está no ar! 🎉**
