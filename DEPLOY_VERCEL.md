# 🚀 Deploy do Frontend na Vercel

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta na Vercel (gratuita)
- ✅ Backend funcionando em `https://api.alldev.pt`

---

## 🎯 Passo a Passo

### 1️⃣ **Commit e Push para o GitHub**

```bash
cd alldev-frontend

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: preparado para deploy na Vercel"

# Push (se ainda não tiver repositório, cria um no GitHub primeiro)
git push origin main
```

---

### 2️⃣ **Deploy na Vercel**

#### **Opção A: Via Dashboard (Recomendado - Mais Fácil)**

1. Acessa: https://vercel.com/new
2. Importa o repositório do GitHub
3. Configura:

   - **Framework Preset**: Vite
   - **Root Directory**: `alldev-frontend` (se estiver num monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Variáveis de Ambiente**:

   - Clica em "Environment Variables"
   - Adiciona:
     ```
     VITE_API_URL = https://api.alldev.pt/api
     ```

5. Clica em **Deploy** 🚀

---

#### **Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd alldev-frontend
vercel

# Seguir as instruções:
# - Set up and deploy? Yes
# - Which scope? (escolher tua conta)
# - Link to existing project? No
# - Project name? alldev-frontend
# - Directory? ./
# - Override settings? No

# Adicionar variável de ambiente
vercel env add VITE_API_URL
# Valor: https://api.alldev.pt/api
# Environment: Production

# Deploy para produção
vercel --prod
```

---

### 3️⃣ **Configurar Domínio Custom (Opcional)**

1. Na Dashboard da Vercel, vai para o projeto
2. **Settings** → **Domains**
3. Adiciona: `alldev.pt` e `www.alldev.pt`
4. Segue as instruções para configurar DNS na dominios.pt:
   ```
   Type: CNAME
   Name: @ (ou www)
   Value: cname.vercel-dns.com
   ```

---

### 4️⃣ **Atualizar CORS no Backend**

No VPS, edita o `.env`:

```bash
nano /opt/alldev-backend/current/.env
```

Muda:

```env
FRONTEND_URL=https://alldev.pt
```

Reinicia a API:

```bash
docker compose -f docker-compose.production.yml restart api
```

---

## ✅ Verificação

1. **Frontend funcionando**: https://alldev-frontend.vercel.app (ou teu domínio)
2. **API respondendo**: https://api.alldev.pt/api/health
3. **CORS configurado**: Login/registro devem funcionar

---

## 🔄 Deploy Automático

A Vercel faz **deploy automático** quando dás push no GitHub! 🎉

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático em 30 segundos! ⚡
```

---

## 🛠️ Comandos Úteis

```bash
# Ver logs
vercel logs

# Rollback para versão anterior
vercel rollback

# Limpar cache
vercel rm alldev-frontend --yes

# Listar deployments
vercel ls
```

---

## 📊 URLs

- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs
- **Status**: https://vercel-status.com

---

## 🎯 Dicas

✅ **DOs:**

- Sempre usar `https://api.alldev.pt` em produção
- Configurar variáveis de ambiente na Vercel
- Testar localmente antes de fazer push
- Usar Preview Deployments para testar branches

❌ **DON'Ts:**

- Não commitar `.env` files
- Não usar `localhost` em produção
- Não fazer deploy direto sem testar

---

## 🆘 Troubleshooting

### Erro de CORS

```bash
# Backend: adicionar domínio Vercel ao CORS
FRONTEND_URL=https://alldev-frontend.vercel.app,https://alldev.pt
```

### Build failed

```bash
# Verificar logs na Vercel Dashboard
# Testar build localmente:
npm run build
```

### API não responde

```bash
# Verificar se backend está UP:
curl https://api.alldev.pt/api/health
```

---

**🎉 Pronto! Frontend no ar em 3 minutos!** 🚀
