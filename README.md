<div align="center">

# ⚡ BoostMark
### Sell-Out Intelligence Dashboard

**Análise de performance comercial em tempo real para redes de varejo e farmácias**

[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange?logo=firebase&logoColor=white)](https://boost--mark.web.app)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org)

---

🌐 **[Acesse o Dashboard ao Vivo →](https://boost--mark.web.app)**

</div>

---

## 📌 Sobre o Projeto

O **BoostMark** é uma plataforma SaaS de análise sell-out desenvolvida para equipes de trade marketing, gerentes comerciais e analistas de dados. A ferramenta transforma relatórios brutos de PDV (Excel/CSV) em insights acionáveis — sem necessidade de configuração manual.

### Por que o BoostMark?

| Problema | Solução BoostMark |
|---|---|
| Relatórios de PDV com centenas de linhas e colunas mescladas | **Parser inteligente** detecta e extrai automaticamente |
| ABC calculado manualmente em planilhas | **Classificação automática** via acumulado de faturamento |
| Alertas de ruptura detectados tarde demais | **Motor de alertas em tempo real** com prioridade por severidade |
| Análise de volumetria e mix manual | **Efeito Volume e Efeito Mix** calculados e visualizados |

---

## ✨ Funcionalidades

### 📊 KPIs em Tempo Real
- **Faturamento Total** — Receita agregada do período filtrado
- **Curva ABC** — Classificação automática por acumulado de Pareto (A=80%, B=15%, C=5%)
- **Efeito Volume** — Variação em unidades vendidas vs. período anterior
- **Efeito Mix** — Variação percentual na participação de cada item na cesta
- **Giro de Estoque** — Vendas / Estoque Médio (velocidade de saída)
- **Alertas Ativos** — Contagem de ocorrências com indicador de urgência

### 🚨 Sistema de Alertas
| Tipo | Critério | Severidade |
|---|---|---|
| **Ruptura** | Vendas acima do percentil 60 + Estoque < 15% do médio | 🔴 Alta |
| **Encalhe** | Vendas abaixo do percentil 30 + Estoque > 3.5x o médio | 🟡 Média |
| **Baixa Performance** | Giro < 50% da média + Curva A ou B | 🔵 Baixa |

### 📈 Visualizações
- **Doughnut ABC** — Proporção de itens A/B/C com contagem
- **Bar Chart Ranking** — Top 15 produtos por faturamento coloridos por curva
- **Line Chart Volume** — Tendência de variação de unidades por produto
- **Bar Chart Mix** — Ganhos e perdas de participação na cesta (verde/vermelho)
- **Heatmap Giro** — Matriz Produto × Região com escala de cor térmica

### 📂 Import de Dados
- **Formato XLSX** — Detecção automática do layout de relatórios (ex: PDV de farmácias)
- **Formato CSV** — Padrão com mapeamento flexível de colunas
- **Modo Demo** — Dataset sintético com anomalias injetadas para demonstração
- **Template CSV** — Download de modelo preenchível

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── AlertsPanel/     # Painel de alertas com filtros por tipo
│   ├── Charts/          # Todos os gráficos (Chart.js + react-chartjs-2)
│   ├── FileUpload/      # Drag-and-drop com estados de loading/sucesso/erro
│   ├── Filters/         # Seletores de Período e Região
│   └── KPICards/        # Cards KPI com glassmorphism
├── data/
│   └── mockData.ts      # Dataset sintético com anomalias para demo
├── types/
│   └── index.ts         # Interfaces TypeScript (Product, ParsedData, Alert…)
├── utils/
│   ├── analytics.ts     # Motor de KPIs: ABC, Volume, Mix, Turnover, Alertas
│   └── fileParser.ts    # Parser XLSX/CSV com detecção de LayoutPadrao
├── firebase.ts          # Inicialização Firebase + Analytics
├── App.tsx              # Layout principal + gerenciamento de estado
└── index.css            # Design system: dark theme, glassmorphism, animações
```

### Fluxo de Dados

```
Arquivo XLSX/CSV
      │
      ▼
fileParser.ts
  ├── detectLayoutPadrao() → extrai empresa, período, lojas
  ├── parseLayoutPadraoRows() → mapeia colunas fixas do relatório
  └── mapGenericRow() → fallback com mapeamento por nome de coluna
      │
      ▼
Product[] → App State
      │
      ▼
analytics.ts
  ├── computeABC()           → classifica A/B/C
  ├── computeVolumeEffect()  → Δ unidades vs. baseline
  ├── computeMixEffect()     → Δ participação vs. baseline
  ├── computeAvgTurnover()   → giro médio
  └── generateAlerts()       → detecta ruptura/encalhe/baixa performance
      │
      ▼
UI Components (Charts, KPICards, AlertsPanel)
```

---

## 🚀 Getting Started

### Pré-requisitos
- Node.js ≥ 18
- npm ≥ 9
- Firebase CLI (`npm install -g firebase-tools`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/boostmark.git
cd boostmark

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

---

## 🔥 Deploy no Firebase

```bash
# Login (primeira vez)
firebase login

# Deploy
firebase deploy --only hosting
```

URL de produção: **https://boost--mark.web.app**

---

## 🧪 Formato do Arquivo de Importação

### LayoutPadrao XLSX (Detecção Automática)

O sistema detecta automaticamente relatórios no formato **"Mais Vendidos Por Quantidade"** exportados de sistemas de PDV. Estrutura esperada:

```
Linha 0: Nome da empresa + timestamp
Linha 1: Título do relatório
Linha 2: Período (ex: "Período de 04/03/2026 à 07/03/2026")
Linha 3: Lojas (ex: "Referente As Lojas: 1, 2, 3, 4, 5")
Linha 4: Cabeçalhos das colunas
Linha 5+: Dados dos produtos
```

### CSV Personalizável

Baixe o **Template CSV** no dashboard e preencha com seus dados:

```csv
name,region,category,revenue,unitsSold,stock,avgStock,price,period
Produto X,Centro-Oeste,Higiene,15000,300,120,150,50.00,Jan/26
```

---

## 📦 Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI components |
| TypeScript | 5 | Type safety estrito |
| Vite | 7 | Build tool + dev server |
| Chart.js | 4 | Visualizações |
| react-chartjs-2 | 5 | Wrapper React para Chart.js |
| xlsx | 0.18 | Parse de arquivos Excel |
| papaparse | 5 | Parse de arquivos CSV |
| lucide-react | — | Ícones |
| Firebase | 11 | Hosting + Analytics |

---

## 📄 Licença

Projeto privado — **Porto Farma / BoostMark** © 2026. Todos os direitos reservados.

---

<div align="center">

Desenvolvido com ⚡ e muito ☕ para análises de sell-out mais inteligentes

</div>
