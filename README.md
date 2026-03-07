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
| ABC calculado manualmente em planilhas | **Classificação dinâmica** via acumulado de faturamento real |
| Alertas de ruptura detectados tarde demais | **Motor de alertas em tempo real** com prioridade por severidade |
| Análise de volumetria e mix manual | **Efeito Volume e Efeito Mix** calculados e visualizados |
| Falta de contexto histórico | **Tendência de Vendas** com histórico integrado no dashboard |

---

## ✨ Funcionalidades

### 📊 KPIs com Comparativo (Δ)
- **Faturamento Total** — Receita agregada com variação percentual (Δ%) vs. período anterior
- **Curva ABC Dinâmica** — Classificação automática baseada no acumulado de Pareto (A=80%)
- **Efeito Volume** — Ganhos e perdas em unidades vendidas vs. período anterior
- **Efeito Mix** — Variação percentual na participação de cada item na cesta
- **Giro de Estoque** — Velocidade de saída (Vendas/Estoque) com Δ absoluto vs. baseline
- **Alertas Ativos** — Contagem de ocorrências críticas com indicador de urgência

### 🚨 Sistema de Alertas Inteligente
| Tipo | Critério | Severidade |
|---|---|---|
| **Ruptura** | Vendas acima da média + Estoque crítico (< 15% do consumo) | 🔴 Alta |
| **Encalhe** | Vendas estagnadas + Estoque excedente (> 3.5x o médio) | 🟡 Média |
| **Baixa Performance** | Giro < 50% da média histórica + Item Curva A ou B | 🔵 Baixa |

### 📈 Visualizações Avançadas
- **Tendência de Vendas (Histórico)** — Gráfico misto de barras e linhas (Faturamento vs. Unidades)
- **Saúde de Estoque Regional** — Gráfico de barras por loja mostrando Rupturas e Encalhes por PDV
- **Doughnut ABC** — Proporção de itens A/B/C com contagem e percentual
- **Bar Chart Ranking** — Top 15 produtos por faturamento coloridos por curva
- **Heatmap de Giro** — Matriz Produto × Região com escala de calor para identificação de gargalos

### 📂 Inteligência de Dados
- **Filtros Avançados** — Filtre por Período, Região, **Fabricante/Fornecedor** e **Busca por Produto**
- **Formato XLSX** — Detecção automática do layout de relatórios de PDV (Layout Padrão)
- **Baseline Dinâmico** — Comparação temporal automática com o período cronológico anterior
- **Custom Logo** — Interface personalizada com a marca **BoostMark**

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── AlertsPanel/     # Painel de alertas com filtros por tipo
│   ├── Charts/          # Todos os gráficos (Chart.js + react-chartjs-2)
│   ├── FileUpload/      # Drag-and-drop com estados de loading/sucesso/erro
│   ├── Filters/         # Seletores Avançados (Período, Região, Fabricante, Busca)
│   └── KPICards/        # Cards KPI com deltas de comparação temporal
├── types/
│   └── index.ts         # Interfaces TypeScript (Product, ParsedData, Alert, TrendPoint…)
├── utils/
│   ├── analytics.ts     # Motor de KPIs: ABC Dinâmico, Volume, Mix, Tendência, Alertas
│   └── fileParser.ts    # Parser XLSX/CSV com detecção de LayoutPadrao e Categorias
├── firebase.ts          # Inicialização Firebase + Analytics
├── App.tsx              # Layout principal + logic de filtragem e baseline
└── index.css            # Design system: dark theme, glassmorphism, animações, logos
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

---

## 🔥 Deploy no Firebase

```bash
# Build de Produção
npm run build

# Deploy
firebase deploy --only hosting
```

URL de produção: **https://boost--mark.web.app**

---

## 🧪 Formato do Arquivo de Importação

### LayoutPadrao XLSX (Detecção Automática)
O sistema detecta automaticamente relatórios no formato **"Mais Vendidos Por Quantidade"**. O parser extrai metadados (Empresa, Lojas, Datas) e mapeia colunas como Fabricante, Custo, Estoque e Unidades Dia.

### CSV Personalizável
Baixe o **Template CSV** no dashboard e preencha com seus dados para importação rápida.

---

## 📦 Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI components |
| TypeScript | 5 | Type safety estrito |
| Vite | 7 | Build tool + dev server |
| Chart.js | 4 | Visualizações |
| xlsx | 0.18 | Parse de arquivos Excel |
| Firebase | 11 | Hosting + Analytics |

---

## 📄 Licença

Projeto privado — **Porto Farma / BoostMark** © 2026. Todos os direitos reservados.

---

<div align="center">

Desenvolvido com ⚡ e muito ☕ para análises de sell-out mais inteligentes

</div>
