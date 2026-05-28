# Planejamento — Sítio Rosa do Vale (Refatoração)

> Documento de trabalho. Atualizar conforme o projeto avança.  
> Deploy: **Vercel** (site estático HTML/CSS/JS)  
> Repo: `https://github.com/diegocsrdias/rosadovale`  
> Commit/push: `diego.cesardias@hotmail.com`

---

## 1. Estado atual do esqueleto

O esqueleto já tem estrutura visual sólida — tipografia, paleta de cores, layout responsivo e componentes. São 9 arquivos:

| Arquivo | Status | Observações |
|---|---|---|
| `index.html` | Esqueleto pronto | Hero, marquee strip, produto destaque, seção sobre — conteúdo a preencher |
| `loja.html` | Esqueleto pronto | Grid de produtos, filtros, chips de categoria — produtos a preencher |
| `produto.html` | Esqueleto pronto | Galeria, info, variantes, comprar — dados de produto a corrigir |
| `carrinho.html` | Esqueleto pronto | Lista de itens, resumo, frete — lógica JS a implementar |
| `checkout.html` | Esqueleto pronto | Endereço, pagamento PIX/cartão, resumo — integração a implementar |
| `conta.html` | Esqueleto pronto | Login / cadastro / pedidos — lógica a implementar |
| `sobre.html` | Esqueleto pronto | Timeline e valores — texto real a substituir |
| `contato.html` | Quase correto | Dados reais já presentes, pequenos ajustes |
| `styles.css` | Pronto | Design system completo |
| `site.js` | Parcial | Age gate, qty stepper, galeria — falta lógica de carrinho real |

---

## 2. Dados reais do site (verificados em sitiorosadovale.com)

### 2.1 Empresa e família

- **Nome:** Sítio Rosa do Vale
- **Família:** Família Krindges
- **Localização:** Linha Boa Vista, município de Poço das Antas — RS
- **Endereço:** Rua 10 de Novembro, Poço das Antas | RS | CEP 95740-000
- **Gestores:** Irani (pai), Miriam (esposa), Maria (mãe de Irani), Dandara (filha do casal)
- **Regime:** Agricultura familiar

### 2.2 Contatos (verificados)

| Canal | Valor |
|---|---|
| Telefone fixo | (51) 3773-1435 |
| WhatsApp | (51) 9586-7921 → `https://wa.me/555195867921` |
| E-mail | sitiorosadovale@gmail.com |
| Instagram | @sitiorosadovale |
| Facebook | /sitiorosadovale |
| TikTok | @sitio.rosa.do.val |

### 2.3 Horário de atendimento (verificado)

- Segunda a Sexta: 9h–12h e 14h–19h
- Sábados e Domingos: **somente com agendamento**

### 2.4 Política de frete (verificada)

- **Grátis** Sul e Sudeste em pedidos acima de **R$ 400**
- **Grátis** Centro-Oeste, Norte e Nordeste em pedidos acima de **R$ 500**

---

## 3. Catálogo de produtos (dados reais)

> Total no site original: **~25 SKUs** (3 páginas na listagem). Os listados abaixo foram confirmados. Os demais precisam ser levantados ao construir `produtos.js`.

### 3.1 Espumantes (750ml)

| Produto | Preço | Uvas / Notas |
|---|---|---|
| Espumante Natural Rosé Brut | R$ 98,00 | Chardonnay, Riesling Itálico e Merlot · salmão · framboesa, morango, amora · 11,5% · 4–6°C |
| Espumante Natural Branco Brut | R$ 98,00 | Chardonnay e Riesling Itálico · amarelo-palha · cítrico, frutado · 11,5% · 4–6°C |
| Espumante Branco Demi Sec | R$ 98,00 | A confirmar |
| Espumante Moscatel Rosé | R$ 91,00 | A confirmar |
| Espumante Natural Brut Tradicional | R$ 183,00 | A confirmar (caixa?) |
| Vinho Espumante Natural Rosé Brut | R$ 58,00 | Formato menor — volume a confirmar |
| Vinho Espumante Natural Branco Brut | R$ 58,00 | Formato menor |
| Vinho Moscatel Espumante Rosé | R$ 58,00 | A confirmar |
| Vinho Moscatel Espumante Branco | R$ 58,00 | A confirmar |
| Vinho Espumante Branco Moscatel | R$ 91,00 | A confirmar |

### 3.2 Vinhos Finos (750ml · R$ 120–150)

| Produto | Preço | Notas |
|---|---|---|
| Vinho Fino Tinto Seco Cabernet Sauvignon | R$ 120,00 | Vermelho rubi · frutas vermelhas maduras, café, especiarias · encorpado · 12% · 16°C |
| Vinho Fino Tinto Seco Tannat | R$ 120,00 | A confirmar |
| Vinho Fino Tinto Seco Merlot | R$ 120,00 | A confirmar |
| Vinho Fino Branco Seco Chardonnay | R$ 120,00 | A confirmar |
| Vinho Fino Branco Seco Moscato de Alexandria | R$ 150,00 | A confirmar |

### 3.3 Vinhos de Mesa

| Produto | Preço | Notas |
|---|---|---|
| Vinho de Mesa Branco Seco Moscato | R$ 75,00 | A confirmar |

### 3.4 Sucos

| Produto | Preço | Notas |
|---|---|---|
| Suco de Uva Tinto – Integral | R$ 35,00 | — |
| Suco de Bergamota | R$ 35,00 | — |

### 3.5 Katats (vinho em lata)

| Produto | Preço | Notas |
|---|---|---|
| Katats – unidade | R$ 19,00 | Vinho branco fino em lata · amarelo-palha · pêssego, mel · refrescante |
| Katats – fardo (12 un.) | R$ 228,00 | Mesmo produto, venda em caixa |

### 3.6 Experiências

| Produto | Preço | Notas |
|---|---|---|
| Ingresso – Samba da Uva | A confirmar | Pisa na uva com roda de samba + passeio de trator até a parreira + degustação + comida típica |

---

## 4. O que está inventado/errado no esqueleto

| Local | Problema | Correção |
|---|---|---|
| `produto.html` | "Pinot Noir · Método Charmat" para o Rosé Brut | Corrigir para: Chardonnay, Riesling Itálico e Merlot · Método Charmat (autoclave) |
| `sobre.html` | Timeline com anos e textos genéricos placeholder | Substituir pela história real da Família Krindges |
| `sobre.html` | Valores placeholder | Substituir por conteúdo real baseado na história |
| `loja.html` | Contagem de produtos no filtro (ex: `<12>`) | Atualizar conforme catálogo real |
| `index.html` | Textos genéricos no hero e nas seções | Substituir por copy real |
| `conta.html` | Dados de pedidos e usuário são mockados | OK por ora — priorizar front, depois integrar |
| `carrinho.html` | Itens mockados hardcoded no HTML | Transformar em dinâmico via JS + localStorage |

---

## 5. Arquitetura técnica (Vercel / site estático)

### 5.1 O que já existe e funciona sem backend

- Age gate (localStorage) ✓
- Qty steppers ✓
- Galeria de produto ✓
- Tabs na página de conta ✓

### 5.2 O que precisa ser implementado

#### Carrinho (localStorage)

```
cart = [{ id, name, price, qty, variant }, ...]
```

- Salvar no `localStorage` a cada mudança
- Ler e renderizar dinamicamente `carrinho.html`
- Atualizar badge de itens no header em todas as páginas
- `loja.html` e `produto.html` → botão "Adicionar ao carrinho" funcional

#### Checkout / Pagamento

O site é estático — não pode processar pagamento server-side. Opções:

| Solução | Prós | Contras |
|---|---|---|
| **Mercado Pago Checkout Pro** | Nativo brasileiro, PIX + boleto + cartão, SDK JS | Precisa de conta MP; redirect para MP |
| **PagSeguro** | Alternativa popular no Brasil | Setup mais complexo |
| **WhatsApp redirect** | Zero integração, funciona já | Não é e-commerce real; manual |
| **Vercel Functions** (serverless) | Mantém no repo, pode fazer server-side | Precisa de lógica Node.js |

**Recomendação:** Mercado Pago Checkout Pro com Vercel Serverless Functions (`/api/create-preference.js`) para criar a preferência de pagamento e redirecionar o usuário.

#### Cálculo de frete

- Integrar API dos Correios via CEP (ViaCEP para busca de endereço)
- Melhor Envio API para cotação de frete (SEDEX, PAC)
- Ou calcular manualmente por região (simples, já que a política de frete grátis é por região)

#### Formulário de contato

- Usar **Formspree** ou **Web3Forms** (funciona com estático no Vercel, sem backend)

#### Conta de usuário / Pedidos

- Para v1: **Sem autenticação real**. Conta.html fica como mockup ou usa Supabase Auth (gratuito, simples de integrar)
- A prioridade é vender. Login pode vir depois.

---

## 6. Estrutura de arquivos sugerida (após refatoração)

```
/
├── index.html
├── loja.html
├── produto.html          ← template (conteúdo injetado via JS)
├── carrinho.html
├── checkout.html
├── conta.html
├── sobre.html
├── contato.html
├── styles.css
├── site.js               ← comportamentos globais
├── cart.js               ← NEW: lógica de carrinho (localStorage)
├── produtos.js           ← NEW: catálogo de produtos como array JS
├── loja.js               ← NEW: renderização dinâmica da loja + filtros
└── /api
    └── create-preference.js  ← NEW: Vercel Serverless (Mercado Pago)
```

---

## 7. Plano de execução em etapas

### Fase 1 — Conteúdo real (pode fazer agora, sem backend)

- [ ] **1.1** Criar `produtos.js` com catálogo completo (todos os ~25 produtos com dados reais)
- [ ] **1.2** Corrigir `produto.html` — dados reais do Espumante Natural Rosé Brut
- [ ] **1.3** Preencher `sobre.html` — história real da Família Krindges
- [ ] **1.4** Preencher `index.html` — hero, textos, produtos em destaque (dinâmico via JS)
- [ ] **1.5** Preencher `contato.html` — verificar todos os dados, horários, mapa (Google Maps embed)

### Fase 2 — Carrinho funcional

- [ ] **2.1** Criar `cart.js` — estrutura de dados, add/remove/update, persistência em localStorage
- [ ] **2.2** Atualizar `site.js` — badge do header atualiza com base no cart
- [ ] **2.3** `produto.html` — botão "Adicionar ao carrinho" chama `cart.js`
- [ ] **2.4** `loja.html` — cards de produto com botão add to cart
- [ ] **2.5** `carrinho.html` — renderizar itens dinamicamente, calcular totais, remover itens

### Fase 3 — Loja dinâmica

- [ ] **3.1** Criar `loja.js` — renderizar `loja.html` a partir do catálogo `produtos.js`
- [ ] **3.2** Filtros por categoria (Espumantes / Vinhos / Sucos / Katats) funcionais
- [ ] **3.3** `produto.html` — carregar dados do produto via query string `?id=espumante-rose-brut`

### Fase 4 — Checkout e pagamento

- [ ] **4.1** Integrar ViaCEP — busca de endereço por CEP no checkout
- [ ] **4.2** Calcular frete por região (regra simples baseada na política atual)
- [ ] **4.3** Criar `/api/create-preference.js` — Vercel Function para Mercado Pago
- [ ] **4.4** `checkout.html` — fluxo real: dados > frete > pagamento > confirmação

### Fase 5 — Ajustes finais e SEO

- [ ] **5.1** Favicon e meta tags em todas as páginas
- [ ] **5.2** Open Graph para redes sociais
- [ ] **5.3** `sitemap.xml` e `robots.txt`
- [ ] **5.4** Performance: lazy loading de imagens, minificação
- [ ] **5.5** Configurar `vercel.json` com redirects e headers de segurança
- [ ] **5.6** Testar age gate, carrinho, checkout end-to-end

### Fase 6 — Imagens (quando prontas)

- [ ] **6.1** Substituir placeholders SVG por fotos reais dos produtos
- [ ] **6.2** Fotos para hero, about, galeria editorial
- [ ] **6.3** Otimizar para web (WebP, tamanhos responsivos)

---

## 8. Dependências externas (todas gratuitas para começar)

| Serviço | Para quê | Tier gratuito |
|---|---|---|
| Vercel | Hosting + Serverless Functions | Generoso, suficiente |
| Mercado Pago | Pagamentos (PIX, cartão, boleto) | Taxa por transação, sem mensalidade |
| ViaCEP | Busca endereço por CEP | Gratuito, sem chave |
| Formspree / Web3Forms | Formulário de contato | Gratuito até ~50 envios/mês |
| Google Maps Embed | Mapa na página de contato | Gratuito sem chave (embed simples) |

---

## 9. Observações de conteúdo para confirmar com Diego

- [ ] Qual produto deve ser o destaque principal da home?
- [ ] Tem foto da fachada/sítio para usar como hero?
- [ ] O "Samba da Uva" vai ter página própria ou só seção?
- [ ] Os vinhos no formato menor (R$ 58) — qual volume? (375ml? 500ml?)
- [ ] Qual o gateway de pagamento de preferência? (Mercado Pago, PagSeguro, etc.)
- [ ] A conta de usuário/login é prioridade? Ou foca em vender primeiro?
- [ ] Descrições completas de todos os produtos (especialmente os que estão "a confirmar")

---

*Última atualização: Mai 2026*
