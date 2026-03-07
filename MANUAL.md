# ⚡ BoostMark — Manual de Utilização

> **Versão:** 1.1 · **Atualizado em:** Março/2026
> **URL de Acesso:** [https://boost--mark.web.app](https://boost--mark.web.app)

---

## Índice

1. [O que é o BoostMark?](#1-o-que-é-o-boostmark)
2. [Estrutura da Interface](#2-estrutura-da-interface)
3. [Primeiros Passos — Importando Dados](#3-primeiros-passos--importando-dados)
4. [Entendendo os KPIs](#4-entendendo-os-kpis)
5. [Usando os Filtros](#5-usando-os-filtros)
6. [Navegando pelas Abas](#6-navegando-pelas-abas)
7. [Central de Alertas](#7-central-de-alertas)
8. [Interpretando os Gráficos](#8-interpretando-os-gráficos)
9. [Ações Recomendadas por Alerta](#9-ações-recomendadas-por-alerta)
10. [Perguntas Frequentes](#10-perguntas-frequentes)

---

## 1. O que é o BoostMark?

O **BoostMark** é uma ferramenta de inteligência sell-out que converte relatórios de PDV (ponto de venda) em análises acionáveis instantaneamente. Não requer configuração — basta importar o arquivo e começar a analisar.

**Principais capacidades:**
- Classificação ABC dinâmica de produtos por acumulado de faturamento
- Efeito Volume e Efeito Mix com comparação automática inter-períodos
- Giro de estoque com alertas de ruptura e encalhe por PDV
- Filtros por período, região, fabricante e produto
- Tendência histórica de vendas e saúde de estoque por loja

---

## 2. Estrutura da Interface

Após importar dados, a interface é dividida em quatro áreas:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚡ BoostMark  [Dashboard]  [Curva ABC]  [Volume & Mix]  [Heatmap]  │  ← Header
├──────────────┬──────────────────────────────────┬───────────────────┤
│  SIDEBAR     │       PAINEL PRINCIPAL            │  ALERTAS          │
│  • Upload    │  KPIs · Gráficos de análise       │  Central de       │
│  • Filtros   │  (muda conforme aba ativa)        │  alertas ativos   │
│  • Alertas   │                                   │                   │
│    resumidos │                                   │                   │
└──────────────┴──────────────────────────────────┴───────────────────┘
```

Quando nenhum dado está carregado, aparece o **Empty State** com a logomarca e a zona de upload centralizada.

---

## 3. Primeiros Passos — Importando Dados

### 3.1 Relatório XLSX (Detecção Automática)

O BoostMark reconhece automaticamente o formato **"Mais Vendidos Por Quantidade"** exportado pelo sistema de PDV de farmácias.

**Passo a passo:**
1. No seu sistema, exporte o relatório de vendas em `.xlsx`
2. Na tela inicial, clique ou arraste o arquivo para a zona de upload
3. O sistema processa em segundos e exibe um banner com Empresa · Período · Lojas
4. Todos os gráficos e alertas são gerados automaticamente

> ⚠️ Não modifique o arquivo antes de importar. Células mescladas ou linhas inseridas manualmente podem impedir o reconhecimento.

**O que o parser extrai automaticamente:**

| Coluna no relatório | Campo no BoostMark |
|---|---|
| Código do produto | ID interno |
| Descrição | Nome do produto |
| Valor Total | Faturamento (R$) |
| Qtd. Vendida | Unidades vendidas |
| Custo Últ. Compra | Preço de custo |
| Est. Atual | Estoque atual |
| Un./dia | Velocidade de saída |
| Dias de Estoque | Cobertura de estoque |
| Fabricante | Categoria / Fornecedor |
| Lojas (cabeçalho) | Região |
| Período (cabeçalho) | Período (ex: Mar/26) |

### 3.2 Arquivo CSV Personalizado

Para dados de outros sistemas, use o formato CSV com cabeçalho padronizado.

**Como obter o template:**
1. Após a primeira importação (ou na tela de upload), clique em **↓ Template CSV**
2. Preencha com seus dados mantendo o cabeçalho intacto

**Cabeçalho obrigatório:**
```
name,region,category,revenue,unitsSold,stock,avgStock,price,period
```

**Exemplo com dois períodos (necessário para ativar comparativos):**
```csv
name,region,category,revenue,unitsSold,stock,avgStock,price,period
Dipirona 500mg,Loja 1,Neo Química,980.00,70,42,55,14.00,Fev/26
Dipirona 500mg,Loja 1,Neo Química,1250.00,85,30,55,14.70,Mar/26
Neosoro 15ml,Loja 2,100% Natural,450.00,90,15,40,5.00,Fev/26
Neosoro 15ml,Loja 2,100% Natural,380.00,72,8,40,5.30,Mar/26
```

> 💡 **Dica:** Importar múltiplos períodos ativa os deltas (Δ) nos KPIs e os gráficos de Efeito Volume e Mix.

---

## 4. Entendendo os KPIs

Os 6 cards no topo do Dashboard resumem a performance do período selecionado. Quando há mais de um período disponível, os cards exibem indicadores de variação (Δ) em relação ao período anterior.

### 4.1 Faturamento (R$)
**O que é:** Receita total dos produtos no filtro atual.
**O Δ%:** Crescimento ou queda percentual vs. período anterior. Verde = crescimento, vermelho = queda.

### 4.2 Curva A / B / C
**O que é:** Distribuição dos produtos pelos segmentos de Pareto:
- **A:** primeiros 80% do faturamento — produtos estrela, prioridade máxima
- **B:** próximos 15% — produtos de apoio, monitorar ativamente
- **C:** últimos 5% — produtos cauda, analisar permanência no mix

> A classificação é **dinâmica**: muda conforme você filtra por região ou fabricante.

### 4.3 Efeito Volume
**O que é:** Variação total em unidades vendidas comparada ao período anterior. Positivo = ganho de tração de mercado.

### 4.4 Efeito Mix
**O que é:** Variação na participação percentual dos produtos na receita total da loja. Um produto pode vender mais em valor, mas ter *menos espaço* na cesta se outros cresceram mais.

**Fórmula:** `Δ Mix = (% atual na receita) − (% no período anterior)`

### 4.5 Giro de Estoque
**O que é:** Velocidade de saída dos produtos. Calculado como `Unidades Vendidas ÷ Estoque Médio`.
- **Giro alto:** produto com boa saída, atenção para não faltar
- **Giro baixo:** produto parado, risco de encalhe

O **Δ** exibido é a diferença absoluta em relação ao período anterior (ex: `+0.15` significa que o giro melhorou 0,15 pontos).

### 4.6 Alertas Ativos
**O que é:** Total de situações identificadas automaticamente que requerem atenção (rupturas + encalhes + baixa performance).

---

## 5. Usando os Filtros

Os filtros ficam na **sidebar esquerda** e afetam todos os cards, gráficos e alertas simultaneamente.

### 5.1 Período
Seleciona o intervalo de análise. As opções são extraídas automaticamente dos dados importados.

| Opção | Comportamento |
|---|---|
| **Todos os períodos** | Consolida toda a base histórica disponível |
| **Mar/26** (exemplo) | Filtra para o mês selecionado e usa Fev/26 como baseline para os Δ |

> ⚙️ O **baseline automático** é sempre o período imediatamente anterior ao selecionado, na ordem cronológica dos dados.

### 5.2 Região
Filtra por loja ou cluster de lojas. Use para investigar se um alerta é pontual de uma unidade ou sistêmico em toda a rede.

### 5.3 Fabricante / Fornecedor
Filtra todos os gráficos para um fornecedor específico. Ideal para:
- Reuniões de revisão de negócio (JBP) com a indústria
- Analisar o portfólio de um fabricante isoladamente
- Comparar performance de dois fabricantes alternativamente

> O filtro de Fabricante é extraído automaticamente da coluna "Fabricante" do relatório XLSX.

### 5.4 Busca por Produto
Campo de texto livre para localizar um SKU específico pelo nome. Suporta busca parcial (ex: digitar "dipir" encontra "Dipirona 500mg").

---

## 6. Navegando pelas Abas

### 6.1 Dashboard (Visão Executiva)
Visão consolidada com:
- 6 KPIs com deltas temporais
- Gráfico de **Tendência de Vendas** (histórico de faturamento × unidades)
- Gráfico de **Saúde de Estoque por PDV** (rupturas e encalhes por loja)
- Ranking ABC (Top 15 produtos)
- Distribuição ABC (Doughnut)

**Use quando:** Quiser uma visão geral rápida antes de aprofundar em uma área específica.

### 6.2 Curva ABC
Análise aprofundada da classificação dos produtos:
- **Ranking horizontal:** todos os produtos ordenados por faturamento, coloridos por curva (🟣 A · 🔵 B · 🟡 C)
- **Doughnut:** proporção percentual de itens em cada curva

**Use quando:** Precisar definir estratégia de sortimento, priorizar reposição ou apresentar performance por produto para a diretoria.

### 6.3 Volume & Mix
- **Efeito Volume:** Linha de tendência mostrando quais produtos ganharam ou perderam unidades vs. período anterior
- **Efeito Mix:** Barras horizontais destacando produtos que ganharam (verde) ou perderam (vermelho) participação na cesta

**Use quando:** Identificar produtos que perderam relevância mesmo vendendo — e orientar ações promocionais.

### 6.4 Giro / Heatmap
Mapa de calor da velocidade de saída cruzando Produto × Região:
- 🔵 **Azul escuro:** giro baixo (alerta de encalhe)
- 🟠 **Laranja/bronze:** giro médio
- 🟡 **Âmbar:** giro alto (monitorar ruptura)

**Use quando:** Identificar desequilíbrios regionais — um produto que gira bem em uma loja mas empaca em outra.

---

## 7. Central de Alertas

A coluna da direita lista automaticamente todas as situações que exigem atenção, em ordem de severidade.

### Tipos de Alerta

#### 🔴 Ruptura (Alta Severidade)
```
CRITÉRIO: Vendas ≥ percentil 60 da base E Estoque ≤ 15% do estoque médio histórico
```
O produto está vendendo bem, mas o estoque está criticamente baixo. Risco imediato de perda de venda.

**Ação recomendada:**
- Solicitar reposição urgente ao fornecedor
- Acionar estoque de outras lojas (transferência lateral)
- Registrar ocorrência no sistema de pedidos com prioridade máxima

#### 🟡 Encalhe (Média Severidade)
```
CRITÉRIO: Vendas ≤ percentil 30 da base E Estoque ≥ 3,5× o estoque médio histórico
```
Produto com baixa saída e estoque excessivo. Capital imobilizado e risco de vencimento.

**Ação recomendada:**
- Promoção relâmpago ou desconto progressivo
- Cross-selling (combinar com produto de maior giro)
- Renegociar lote mínimo de compra com o fornecedor
- Avaliar redistribuição para loja com maior giro desse produto

#### 🔵 Baixa Performance (Baixa Severidade)
```
CRITÉRIO: Giro < 50% da média geral E Produto classificado como Curva A ou B
```
Produto importante (alta receita ou médio valor) com desempenho aquém do esperado.

**Ação recomendada:**
- Revisar precificação versus concorrência
- Verificar posição e exposição no ponto de venda
- Avaliar se o produto está em campanha ou ação do fornecedor

---

## 8. Interpretando os Gráficos

### Tendência de Vendas (Histórico)
- **Barras Roxas:** Faturamento (R$) por período
- **Linha Azul:** Unidades vendidas por período
- **Divergência:** Se o faturamento sobe mas as unidades caem → houve aumento de preço médio (ou mix valorizado). Se ambos caem → perda real de tração de mercado.

### Saúde de Estoque por PDV
- **Barra Vermelha (Rupturas):** Contagem de produtos com estoque crítico naquela loja
- **Barra Laranja (Encalhes):** Contagem de produtos com excesso de estoque
- **Lojas ordenadas:** Da mais crítica (maior soma) para a mais saudável
- **Use para:** Priorizar visitas de campo e negociações logísticas por loja

### Ranking ABC (Curva ABC)
- Barras horizontais — o comprimento representa o faturamento absoluto
- Cor indica a curva: 🟣 Roxo = A, 🔵 Cyan = B, 🟡 Âmbar = C
- Top 15 produtos mais relevantes do financio

### Heatmap de Giro
- Cada **linha** = produto (Top 10 por volume)
- Cada **coluna** = região/loja
- Cada **célula** = velocidade de giro naquele cruzamento
- **Valor numérico:** quanto menor, mais lento o produto está girando nessa região

### Efeito Volume (Linha)
- Cada linha representa um produto (Top 5 com mais variação)
- Valores positivos = ganhou unidades vs. período anterior
- Valores negativos = perdeu unidades

### Efeito Mix (Barras)
- **Verde:** produto que ganhou participação na cesta (cresceu acima da média)
- **Vermelho:** produto que perdeu espaço mesmo que tenha vendido
- Ordenado pelo maior impacto absoluto

---

## 9. Ações Recomendadas por Alerta

| Alerta | Urgência | Ação Imediata | Ação Estratégica |
|---|---|---|---|
| Ruptura | ⚡ Alta | Reposição emergencial | Ajustar estoque de segurança |
| Encalhe | 🕐 Média | Promoção local | Renegociar lote mínimo com fornecedor |
| Baixa Performance | 📋 Baixa | Verificar exposição no PDV | Revisar precificação e mix |

---

## 10. Perguntas Frequentes

**Q: O que acontece quando importo um novo arquivo?**
R: Os dados anteriores são substituídos inteiramente pelo conteúdo do novo arquivo. A ferramenta não persiste dados — tudo fica em memória durante a sessão.

**Q: Como o sistema calcula os comparativos (Δ)?**
R: Os períodos são ordenados cronologicamente com base nos dados importados. Ao selecionar um período (ex: Mar/26), o sistema usa automaticamente o período imediatamente anterior (ex: Fev/26) como baseline. Ao selecionar "Todos os períodos", usa o primeiro período como baseline.

**Q: Por que os Δ aparecem como "—" em alguns KPIs?**
R: Os deltas só aparecem quando há ao menos dois períodos distintos no arquivo. Com apenas um período, não há baseline para comparação.

**Q: Posso importar dados de múltiplas lojas no mesmo arquivo?**
R: Sim. O arquivo pode conter dados de múltiplas lojas e períodos. O sistema agrupa automaticamente por Região e Período, e os filtros detectam todas as combinações disponíveis.

**Q: Posso usar o filtro de Fabricante com o CSV personalizado?**
R: Sim. Preencha a coluna `category` do CSV com o nome do fabricante/fornecedor para que o filtro funcione.

**Q: A classificação ABC muda quando aplico filtros?**
R: Sim, propositalmente. A Curva ABC é recalculada com base nos produtos e períodos filtrados, refletindo a realidade do segmento analisado.

**Q: Os dados ficam salvos na nuvem?**
R: Não. O BoostMark processa tudo localmente no navegador. Nenhum dado é enviado a servidores. Ao fechar ou recarregar a página, os dados são perdidos.

---

> Dúvidas ou sugestões? Entre em contato com a equipe de desenvolvimento.
