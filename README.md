# Casa na Areia Preá — Site Oficial & Sistema de Consulta de Disponibilidade

Aplicação web institucional e sistema de consulta de disponibilidade em tempo real integrado ao calendário iCal do Airbnb para a **Casa na Areia Preá** (Praia do Preá, Cruz, Ceará, Brasil).

- **Site em produção**: [https://casa-na-areia-prea.pv-mattoss.workers.dev/](https://casa-na-areia-prea.pv-mattoss.workers.dev/)
- **Hospedagem**: Cloudflare Workers + Static Assets + Cloudflare KV + Cron Triggers (RFC 5545 iCal parser nativo)

---

## Sumário

1. [Visão Geral e Arquitetura](#1-visão-geral-e-arquitetura)
2. [Dados e Canais Oficiais Verificados](#2-dados-e-canais-oficiais-verificados)
3. [Execução Local (Desenvolvimento)](#3-execução-local-desenvolvimento)
4. [Como Exportar o Calendário iCal no Airbnb](#4-como-exportar-o-calendário-ical-no-airbnb)
5. [Configuração na Cloudflare (KV, Secrets e Cron Triggers)](#5-configuração-na-cloudflare-kv-secrets-e-cron-triggers)
6. [Deploy em Produção na Cloudflare](#6-deploy-em-produção-na-cloudflare)
7. [Verificação da Sincronização e Endpoints de API](#7-verificação-da-sincronização-e-endpoints-de-api)
8. [Testes Automatizados](#8-testes-automatizados)
9. [Informações Pendentes de Preenchimento pelo Proprietário](#9-informações-pendentes-de-preenchimento-pelo-proprietário)

---

## 1. Visão Geral e Arquitetura

A solução adota uma arquitetura unificada na **Cloudflare**, evitando infraestrutura desnecessária e garantindo baixa latência global, segurança das credenciais e custo operacional mínimo (compatível com o plano gratuito da Cloudflare):

- **Frontend (`src/`)**: React 19 + TypeScript + Tailwind CSS v4 + Vite.
  - Layout editorial responsivo, tipografia serifada (*Cormorant Garamond*) combinada com sans-serif contemporânea (*Plus Jakarta Sans*), paleta natural costeira e 27 fotografias reais em alta resolução extraídas do anúncio oficial da propriedade.
  - Galeria categorizada (*Todas*, *A Casa*, *Suítes*, *Rooftop*, *Áreas Sociais*) com Lightbox acessível (navegação por teclado `←`/`→`, fechamento por `Escape`, botão ou clique no fundo).
  - Calendário interativo de disponibilidade que respeita a semântica de **checkout exclusivo** do padrão iCalendar (RFC 5545): o dia de saída (`DTEND`) aparece liberado para o check-in de uma nova reserva (entrada após 14:00, saída até 12:00) e também pode ser selecionado como data de checkout de uma reserva que se inicia em dias anteriores.
- **Backend (`src/worker/`)**: Cloudflare Worker nativo (100% Web Standard APIs, sem dependências de Node.js).
  - Parser RFC 5545 próprio (`src/worker/ical/parser.ts`) compatível com Cloudflare Workers: suporta line unfolding, `DTSTART;VALUE=DATE`, timestamps UTC/TZID, fusão de intervalos contíguos, deduplicação e descarte de eventos `STATUS:CANCELLED`.
  - Sincronização resiliente (`src/worker/ical/sync.ts`) com proteção contra execuções concorrentes (lock com TTL no KV) e preservação automática do último snapshot válido em caso de falha temporária de rede ou erro no feed do Airbnb.
- **Armazenamento (`AVAILABILITY_KV`)**: Cloudflare Workers KV armazena os intervalos normalizados (`startDate` e `endDate`), metadados de sincronização (`lastSyncedAt`, `lastAttemptAt`, `status`) e lock de concorrência.
- **Agendamento (`Cron Triggers`)**: Configurado em `wrangler.toml` (`*/15 * * * *`) para atualizar o calendário automaticamente a cada 15 minutos em background.

---

## 2. Dados e Canais Oficiais Verificados

Todas as informações e fotografias utilizadas no site foram extraídas e verificadas a partir das referências oficiais da propriedade:

- **Capacidade**: 6 suítes climatizadas · 8 camas · 7 banheiros · até 14 hóspedes.
- **Configuração verificada das suítes**:
  - **Suíte 1**: 1 cama king + ar-condicionado.
  - **Suíte 2**: 1 cama queen + 1 cama de solteiro + ar-condicionado.
  - **Suíte 3**: 1 cama queen + 1 cama de solteiro + ar-condicionado.
  - **Suíte 4**: 1 cama queen + ar-condicionado.
  - **Suíte 5**: 1 cama queen + ar-condicionado.
  - **Suíte 6**: 1 cama king + ar-condicionado.
- **Horários e Regras**: Check-in a partir das 14:00 · Checkout até as 12:00 · Aceita animais de estimação.
- **Canais Oficiais**:
  - **WhatsApp Oficial**: [`https://wa.me/5531973385134`](https://wa.me/5531973385134) (`+55 31 97338-5134`)
  - **Airbnb Oficial**: [`https://www.airbnb.com.br/rooms/1360237649157263407`](https://www.airbnb.com.br/rooms/1360237649157263407)
  - **Booking.com Oficial**: [`https://www.booking.com/Share-iEDaqwW`](https://www.booking.com/Share-iEDaqwW)
  - **Instagram Oficial**: [`https://www.instagram.com/casanaareiaprea/`](https://www.instagram.com/casanaareiaprea/) (`@casanaareiaprea`)
  - **Linktree Oficial**: [`https://linktr.ee/casanaareiaprea`](https://linktr.ee/casanaareiaprea)

---

## 3. Execução Local (Desenvolvimento)

### Pré-requisitos
- Node.js 20+ e npm.

### Passo a passo

1. Instale as dependências:
   ```bash
   npm install
   ```

2. (Opcional) Crie o arquivo `.dev.vars` na raiz do projeto a partir do exemplo `.dev.vars.example`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
   Edite `.dev.vars` para informar a URL real do calendário iCal do Airbnb durante o desenvolvimento local:
   ```ini
   AIRBNB_ICAL_URL="https://www.airbnb.com.br/calendar/ical/1360237649157263407.ics?s=SEU_TOKEN_PRIVADO"
   ADMIN_SYNC_TOKEN="seu-token-secreto-de-administracao"
   ```
   > **Nota**: Caso `AIRBNB_ICAL_URL` não seja configurada localmente, a API responde com `status: "unconfigured"` e a interface exibe um aviso transparente orientando a consulta direta sem confirmar falsamente datas como disponíveis.

3. Inicie o servidor de desenvolvimento (Vite com middleware integrado do Worker):
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173`.

4. Para testar localmente utilizando o runtime completo do Cloudflare Wrangler (após o build):
   ```bash
   npm run cf:dev
   ```

---

## 4. Como Exportar o Calendário iCal no Airbnb

Para obter a URL privada do calendário (`AIRBNB_ICAL_URL`) sem depender de scraping ou APIs não documentadas:

1. Acesse sua conta de anfitrião no [Airbnb](https://www.airbnb.com.br/hosting) e abra o anúncio da **Casa na Areia Preá**.
2. Vá até a aba **Calendário** (*Calendar*).
3. No painel lateral direito, clique em **Disponibilidade** (*Availability*).
4. Role até a seção **Conectar calendários** (*Connect calendars*) e selecione **Exportar calendário** (*Export calendar*).
5. Copie a URL fornecida pelo Airbnb (formato `https://www.airbnb.com.br/calendar/ical/1360237649157263407.ics?s=...`).

> **Importante**: Trate essa URL como uma credencial privada. Ela nunca deve ser comitada no Git nem exposta no código frontend.

---

## 5. Configuração na Cloudflare (KV, Secrets e Cron Triggers)

### 5.1. Autenticar no Wrangler
```bash
npx wrangler login
```

### 5.2. Criar o Namespace do Cloudflare KV (`AVAILABILITY_KV`)
Execute os comandos abaixo para criar o namespace de produção e de preview:
```bash
npx wrangler kv namespace create AVAILABILITY_KV
npx wrangler kv namespace create AVAILABILITY_KV --preview
```
O Wrangler exibirá os IDs gerados (`id` e `preview_id`). Descomente o bloco `[[kv_namespaces]]` no arquivo [`wrangler.toml`](./wrangler.toml) e preencha os IDs retornados:
```toml
[[kv_namespaces]]
binding = "AVAILABILITY_KV"
id = "COLE_AQUI_O_ID_DE_PRODUCAO"
preview_id = "COLE_AQUI_O_ID_DE_PREVIEW"
```

### 5.3. Cadastrar as Variáveis Secretas (`AIRBNB_ICAL_URL` e `ADMIN_SYNC_TOKEN`)
Cadastre a URL privada do calendário iCal do Airbnb como secret criptografado na Cloudflare:
```bash
npx wrangler secret put AIRBNB_ICAL_URL
```
Quando solicitado no terminal, cole a URL `.ics` exportada do Airbnb.

Em seguida, cadastre um token forte para proteger o endpoint administrativo de sincronização manual (`POST /api/admin/sync`):
```bash
npx wrangler secret put ADMIN_SYNC_TOKEN
```

### 5.4. Cron Triggers (Sincronização Automática)
O arquivo [`wrangler.toml`](./wrangler.toml) já inclui o agendamento:
```toml
[triggers]
crons = ["*/15 * * * *"]
```
Ao realizar o deploy, a Cloudflare executará automaticamente a função `scheduled` do Worker a cada 15 minutos para buscar o feed iCal, normalizar as reservas e atualizar o Cloudflare KV.
Os intervalos também podem ser ajustados nas variáveis `[vars]` do `wrangler.toml`:
- `SYNC_INTERVAL_MINUTES`: intervalo alvo entre sincronizações (padrão: `"15"`).
- `STALE_THRESHOLD_MINUTES`: tempo máximo até que os dados em cache sejam sinalizados como desatualizados (`isStale: true`, padrão: `"60"`).

---

## 6. Deploy em Produção na Cloudflare

Para compilar o frontend (`dist/`) e publicar o Worker + Assets Estáticos + Cron Trigger na Cloudflare em um único comando:

```bash
npm run cf:deploy
```

---

## 7. Verificação da Sincronização e Endpoints de API

Após o deploy (ou localmente), você pode inspecionar a saúde da sincronização pelos endpoints da API:

### 7.1. `GET /api/health`
Verifica o estado geral do serviço e se os bindings estão ativos:
```bash
curl https://SEU-DOMINIO.workers.dev/api/health
```
Retorna:
```json
{
  "service": "casa-na-areia-prea-api",
  "ok": true,
  "configured": true,
  "kvBound": true,
  "syncStatus": "ok",
  "lastSyncedAt": "2026-10-15T20:00:00.000Z",
  "lastAttemptAt": "2026-10-15T20:00:00.000Z"
}
```
*(Nenhuma URL privada ou credencial é exposta na resposta).*

### 7.2. `GET /api/availability?start=YYYY-MM-DD&end=YYYY-MM-DD`
Consulta pública utilizada pelo calendário do site:
```bash
curl "https://SEU-DOMINIO.workers.dev/api/availability?start=2026-11-01&end=2027-02-01"
```
Retorna apenas intervalos públicos e sanitizados (`startDate`, `endDate`), além de `lastSyncedAt`, `status`, `isStale` e `hasReliableData`. Dados pessoais de hóspedes, `UID`, `SUMMARY` ou `DESCRIPTION` do iCal jamais são expostos.

### 7.3. `POST /api/admin/sync` (Sincronização Manual Protegida)
Para forçar uma sincronização imediata sem aguardar a janela de 15 minutos:
```bash
curl -X POST https://SEU-DOMINIO.workers.dev/api/admin/sync \
  -H "Authorization: Bearer SEU_ADMIN_SYNC_TOKEN"
```

---

## 8. Testes Automatizados

A suíte de testes (`vitest` + `@testing-library/react`) valida o parser iCal RFC 5545, a lógica de datas e checkout exclusivo, o serviço de sincronização e fallback em KV, os endpoints HTTP (incluindo proteção de credenciais e autenticação administrativa) e a interface completa:

```bash
npm test
```

Para validar a tipagem TypeScript e o bundle de produção:
```bash
npm run build
```

---

## 9. Informações Pendentes de Preenchimento pelo Proprietário

Como exigido pelas diretrizes de segurança e veracidade do projeto, nenhuma URL privada foi inventada. Para colocar a sincronização em operação real na Cloudflare, o proprietário deve fornecer/configurar:

1. **`AIRBNB_ICAL_URL` (Obrigatório para sincronização real)**:
   - URL privada `.ics` exportada das configurações de disponibilidade do anúncio no Airbnb (`wrangler secret put AIRBNB_ICAL_URL` em produção ou `.dev.vars` localmente).
2. **`ADMIN_SYNC_TOKEN` (Recomendado para produção)**:
   - Token secreto para autorizar chamadas manuais ao endpoint `POST /api/admin/sync` (`wrangler secret put ADMIN_SYNC_TOKEN`).
3. **IDs do Namespace KV em [`wrangler.toml`](./wrangler.toml)**:
   - Após rodar `npx wrangler kv namespace create AVAILABILITY_KV`, descomentar o bloco `[[kv_namespaces]]` em `wrangler.toml` com o `id` gerado na conta Cloudflare do proprietário.
4. **Domínio Customizado (Opcional)**:
   - Caso deseje apontar um domínio próprio (ex.: `casanaareiaprea.com.br`), basta adicioná-lo em *Workers & Pages > Custom Domains* no painel da Cloudflare e atualizar as tags canônicas em [`index.html`](./index.html).
