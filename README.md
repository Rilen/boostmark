<div align="center">

# ⚡ BoostMark
### Sell-Out Intelligence Dashboard

**Análise de performance comercial em tempo real para redes de varejo e farmácias**

[![Deploy](https://img.shields.io/badge/Firebase-Live-orange?logo=firebase&logoColor=white)](https://boost--mark.web.app)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org)

---

🌐 **[Acesse o Dashboard ao Vivo →](https://boost--mark.web.app)**

</div>

---

## 📌 Sobre o Projeto

O **BoostMark** é uma plataforma de análise sell-out para equipes de trade marketing, gerentes comerciais e analistas de dados. A ferramenta transforma relatórios brutos de PDV (Excel/CSV) em insights acionáveis — sem necessidade de configuração manual.

| Problema | Solução BoostMark |
|---|---|
| Relatórios de PDV complexos e mesclados | Parser inteligente com detecção automática de layout |
| ABC calculado manualmente | Classificação dinâmica via acumulado de faturamento (Pareto) |
| Alertas de ruptura detectados tarde | Motor de alertas em tempo real com prioridade por severidade |
| Sem contexto temporal | Comparativo automático com período anterior (Δ nos KPIs) |
| Gestão por loja difícil | Estoque por PDV com contagem de rupturas e encalhes por região |

---

## ✨ Funcionalidades (v1.1)

### 📊 KPIs com Comparativo Temporal (Δ)
| KPI | Descrição |
|---|---|
| **Faturamento** | Receita total + variação % vs. período anterior |
| **Curva ABC** | Classificação dinâmica pelos 80/15/5% do faturamento acumulado |
| **Efeito Volume** | Δ unidades vendidas vs. baseline |
| **Efeito Mix** | Δ participação percentual na cesta de compras |
| **Giro de Estoque** | Vendas ÷ Estoque Médio + Δ absoluto vs. baseline |
| **Alertas Ativos** | Contagem de ocorrências críticas por tipo |

### 🚨 Alertas Automáticos
| Tipo | Critério | Ação Sugerida |
|---|---|---|
| 🔴 **Ruptura** | Venda alta + estoque < 15% do médio | Reposição urgente |
| 🟡 **Encalhe** | Venda baixa + estoque > 3,5× o médio | Promoção / redistribuição |
| 🔵 **Baixa Performance** | Giro < 50% da média (Curva A ou B) | Revisão de preço / exposição |

### 📈 Visualizações

| Gráfico | Descrição |
|---|---|
| **Tendência de Vendas** | Série histórica de faturamento (barras) × unidades (linha) |
| **Saúde de Estoque por PDV** | Rupturas e encalhes agrupados por loja/região |
| **Ranking ABC** | Top 15 produtos por faturamento, coloridos por curva |
| **Distribuição ABC** | Doughnut com proporção de itens A/B/C |
| **Efeito Volume** | Linha de tendência de variação de unidades por produto |
| **Efeito Mix** | Barras de ganho/perda de participação (verde/vermelho) |
| **Heatmap de Giro** | Matriz Produto × Região com escala térmica |

### 🔍 Filtros Avançados
- **Período** — Recorte temporal; ativa comparativo automático com o período anterior
- **Região / Loja** — Isolamento de análise por unidade
- **Fabricante / Fornecedor** — Filtro para revisões comerciais (JBP)
- **Busca por Produto** — Pesquisa instantânea por nome ou código

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── AlertsPanel/     # Painel de alertas filtrados por tipo e severidade
│   ├── Charts/          # ABCDoughnut, ABCRevenueBar, VolumeEffectLine,
│   │                    # MixEffectBar, StockTurnoverHeatmap,
│   │                    # TrendAnalysisChart, RegionalStockBar
│   ├── FileUpload/      # Drag-and-drop + parser de XLSX e CSV
│   ├── Filters/         # Período · Região · Fabricante · Produto
│   └── KPICards/        # 6 cards com deltas temporais
├── types/
│   └── index.ts         # Product, ProductABC, TrendPoint, StockByRegion,
│                        # KPISummary (com Δ), FilterState, ParsedData
├── utils/
│   ├── analytics.ts     # computeABC, computeKPIs, computeTrend,
│   │                    # computeStockByRegion, generateAlerts
│   └── fileParser.ts    # Parser XLSX (LayoutPadrao automático) e CSV
├── data/
│   └── logomarca.png    # Logomarca exibida no Empty State
├── firebase.ts          # Inicialização Firebase + Analytics
└── App.tsx              # Estado global, filtros, baseline dinâmico
```

### Fluxo de Dados

```
Arquivo XLSX / CSV
      │
      ▼ fileParser.ts
  LayoutPadrao? ──── sim ──► extrai empresa, lojas, período, fabricante
      │ não
      ▼ mapGenericRow()
Product[] + periods[] + regions[] + categories[]
      │
      ▼ analytics.ts
  computeABC()           → curva A/B/C por acumulado Pareto
  computeKPIs()          → totais + Δ vs. baseline
  computeTrend()         → série temporal por período
  computeStockByRegion() → rupturas/encalhes por loja
  generateAlerts()       → alertas priorizados
      │
      ▼ UI Components
KPICards · Charts · AlertsPanel · Filters
```

---

## 🚀 Setup Local

```bash
# Clone
git clone https://github.com/seu-usuario/boostmark.git
cd boostmark

# Dependências
npm install

# Dev server
npm run dev
# → http://localhost:5173
```

---

## 🔥 Deploy Firebase

```bash
npm run build
firebase deploy --only hosting
# → https://boost--mark.web.app
```

---

## 🧪 Formato de Dados

### XLSX — Detecção Automática (LayoutPadrao)

Relatórios **"Mais Vendidos Por Quantidade"** exportados do sistema PDV são detectados automaticamente. Nenhum ajuste é necessário.

| Linha | Conteúdo |
|---|---|
| 0 | Nome da empresa + timestamp |
| 2 | Período (`Período de DD/MM/AAAA à DD/MM/AAAA`) |
| 3 | Lojas (`Referente As Lojas: 1, 2, 3...`) |
| 4 | Cabeçalho das colunas |
| 5+ | Dados dos produtos |

Colunas mapeadas: Produto · Descrição · Valor Total · Qtd. Vendida · Custo · Est. Atual · Un./dia · Dias de Estoque · Fabricante.

### CSV — Mapeamento Flexível

Baixe o **Template CSV** no dashboard. Cabeçalho mínimo:

```csv
name,region,category,revenue,unitsSold,stock,avgStock,price,period
Dipirona 500mg,Loja 1,Neo Química,980.00,70,42,55,14.00,Fev/26
```

---

## 📦 Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI components |
| TypeScript | 5 | Tipagem estrita |
| Vite | 7 | Build + dev server |
| Chart.js + react-chartjs-2 | 4 / 5 | Todos os gráficos |
| xlsx | 0.18 | Parse de Excel |
| papaparse | 5 | Parse de CSV |
| lucide-react | latest | Ícones |
| Firebase | 11 | Hosting + Analytics |

---

## 📄 Licença

Projeto privado — **Porto Farma / BoostMark** © 2026. Todos os direitos reservados.

---

<div align="center">
Desenvolvido com ⚡ para análises de sell-out mais inteligentes
</div>
