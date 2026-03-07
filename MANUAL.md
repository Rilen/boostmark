# ⚡ BoostMark — Manual de Utilização

> **Versão:** 1.0 · **Atualizado em:** Março/2026  
> **Acesso:** [https://boost--mark.web.app](https://boost--mark.web.app)

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Acessando o Dashboard](#2-acessando-o-dashboard)
3. [Importando seus Dados](#3-importando-seus-dados)
   - 3.1 [Relatório XLSX (Formato Automático)](#31-relatório-xlsx-formato-automático)
   - 3.2 [Arquivo CSV Personalizado](#32-arquivo-csv-personalizado)
   - 3.3 [Modo Demo](#33-modo-demo)
4. [Entendendo os KPIs](#4-entendendo-os-kpis)
   - 4.1 [Faturamento Total](#41-faturamento-total)
   - 4.2 [Curva ABC](#42-curva-abc)
   - 4.3 [Efeito Volume](#43-efeito-volume)
   - 4.4 [Efeito Mix](#44-efeito-mix)
   - 4.5 [Giro de Estoque](#45-giro-de-estoque)
   - 4.6 [Alertas Ativos](#46-alertas-ativos)
5. [Usando os Filtros](#5-usando-os-filtros)
6. [Navegando pelas Abas](#6-navegando-pelas-abas)
   - 6.1 [Dashboard](#61-dashboard)
   - 6.2 [Curva ABC](#62-curva-abc)
   - 6.3 [Volume & Mix](#63-volume--mix)
   - 6.4 [Giro / Heatmap](#64-giro--heatmap)
7. [Central de Alertas](#7-central-de-alertas)
8. [Interpretando os Gráficos](#8-interpretando-os-gráficos)
9. [Ações Recomendadas por Alerta](#9-ações-recomendadas-por-alerta)
10. [Perguntas Frequentes](#10-perguntas-frequentes)

---

## 1. Visão Geral

O **BoostMark** é um dashboard de inteligência comercial que transforma os relatórios de PDV da sua rede em análises visuais automatizadas. Ele calcula em segundos métricas como Curva ABC, Efeito Volume/Mix e Giro de Estoque — e gera alertas automáticos para situações que exigem ação imediata do time de trade marketing.

### Para quem é o BoostMark?

| Perfil | O que o BoostMark entrega |
|---|---|
| **Gerente Comercial** | Visão consolidada de faturamento, mix e performance por loja em segundos |
| **Analista de Trade** | Dados prontos para apresentação: curva ABC, efeitos VM e alertas priorizados |
| **Supervisor de Loja** | Identificação rápida de rupturas e encalhes para ação no campo |
| **Comprador / Compras** | Indicadores de giro e cobertura de estoque para decisões de reposição |

---

## 2. Acessando o Dashboard

1. Abra o navegador (Chrome, Edge ou Firefox recomendados)
2. Acesse: **[https://boost--mark.web.app](https://boost--mark.web.app)**
3. O dashboard carrega automaticamente em **Modo Demo** com dados de exemplo

> 💡 **Dica:** Adicione o link aos favoritos do navegador para acesso rápido.

### Layout da Tela

```
┌────────────────────────────────────────────────────────┐
│  ⚡ BoostMark  [Dashboard] [Curva ABC] [V&M] [Heatmap] │  ← Header + Tabs
├────────────────────────────────────────────────────────┤
│  Banner de contexto (exibido após upload de arquivo)   │  ← Empresa · Período · Lojas
├──────────────┬────────────────────────┬────────────────┤
│              │                        │                │
│  IMPORTAR    │    KPI Cards (6)       │  CENTRAL DE    │
│  DADOS       │                        │  ALERTAS       │
│              ├────────────────────────┤                │
│  FILTROS     │    Gráficos            │  Lista de      │
│              │    (conforme aba)      │  alertas       │
│  ALERTAS     │                        │  filtráveis    │
│  (resumo)    │                        │                │
└──────────────┴────────────────────────┴────────────────┘
```

---

## 3. Importando seus Dados

### 3.1 Relatório XLSX (Formato Automático)

O BoostMark detecta automaticamente relatórios exportados do seu sistema PDV no formato **"Mais Vendidos Por Quantidade"**.

**Passo a passo:**

1. No seu sistema de gestão, exporte o relatório de vendas em formato `.xlsx`
2. No dashboard, clique na área pontilhada **"Arraste CSV / XLSX ou clique"** (sidebar esquerda)
3. Selecione o arquivo `.xlsx` exportado
4. Aguarde o processamento (normalmente menos de 2 segundos)

**O que acontece automaticamente:**
- ✅ O sistema identifica o nome da empresa, período e lojas do relatório
- ✅ Um **banner azul** aparece abaixo do cabeçalho com essas informações
- ✅ Os KPI cards e gráficos são atualizados com os dados reais
- ✅ Os alertas são gerados automaticamente baseado nos dados importados

**Colunas extraídas do XLSX:**

| Coluna no Relatório | Campo no Sistema | Observação |
|---|---|---|
| Produto | Código interno | Identificador único do PDV |
| Descrição | Nome do produto | Usado nos gráficos e alertas |
| Valor Total | Faturamento | Receita no período |
| Qtd. Vendida | Unidades vendidas | Base para ABC e Volume |
| Custo Últ. Compra | Custo | Referência de margem |
| Est. Atual | Estoque atual | Usado nos alertas de ruptura/encalhe |
| Un./dia | Velocidade de saída | Unidades/dia no período |
| Dias est. | Cobertura em dias | Estoque ÷ Un.dia |
| Fabricante | Categoria | Agrupamento por fabricante |

> ⚠️ **Atenção:** O arquivo deve ser exportado diretamente do sistema PDV sem modificações. Alterar a formatação ou mesclar/desemesclar células pode impedir o reconhecimento automático.

---

### 3.2 Arquivo CSV Personalizado

Para dados provenientes de outros sistemas ou planilhas próprias, use o formato CSV padrão.

**Baixando o template:**
1. Clique em **"↓ Template CSV"** na sidebar
2. Um arquivo `boostmark_template.csv` será baixado
3. Abra no Excel ou Google Sheets

**Estrutura do CSV:**

```
name,region,category,revenue,unitsSold,stock,avgStock,price,period
```

| Coluna | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `name` | texto | Nome do produto | `Dipirona 500mg Cpr` |
| `region` | texto | Nome da loja/região | `Loja Centro` |
| `category` | texto | Categoria ou fabricante | `Neo Química` |
| `revenue` | número | Faturamento total (R$) | `1250.00` |
| `unitsSold` | número | Quantidade vendida | `85` |
| `stock` | número | Estoque atual | `42` |
| `avgStock` | número | Estoque médio histórico | `60` |
| `price` | número | Preço unitário (R$) | `14.70` |
| `period` | texto | Período de referência | `Mar/26` |

**Dicas para preenchimento:**
- Use **ponto** como separador decimal (não vírgula)
- O campo `period` pode ser qualquer texto, mas mantenha o padrão `Mmm/AA` para ordenação correta
- Inclua **múltiplos períodos** no mesmo arquivo para habilitar a análise de Volume e Mix (o sistema precisa de pelo menos 2 períodos para calcular variações)
- Você pode ter **múltiplas regiões** — os filtros do sistema detectam automaticamente

**Exemplo com 2 períodos:**
```
name,region,category,revenue,unitsSold,stock,avgStock,price,period
Dipirona 500mg,Loja 1,Neo Química,980.00,70,42,55,14.00,Fev/26
Dipirona 500mg,Loja 1,Neo Química,1250.00,85,30,55,14.70,Mar/26
Neosoro 15ml,Loja 1,100% Natural,450.00,90,15,40,5.00,Fev/26
Neosoro 15ml,Loja 1,100% Natural,380.00,72,8,40,5.28,Mar/26
```

---

### 3.3 Modo Demo

Ao acessar o dashboard pela primeira vez ou clicar em **"↩ Carregar Demo"**, o sistema exibe um dataset sintético com:

- **20 produtos** fictícios distribuídos em **5 regiões** e **6 períodos**
- Anomalias injetadas: rupturas, encalhes e baixa performance propositais
- Útil para explorar todas as funcionalidades sem precisar de dados reais

> 💡 **Dica:** Use o Modo Demo para treinar a equipe antes de importar os dados reais.

---

## 4. Entendendo os KPIs

Os 6 cards no topo do dashboard são atualizados automaticamente conforme os filtros selecionados.

---

### 4.1 Faturamento Total

**O que é:** Soma de toda a receita gerada pelos produtos no período e região filtrados.

**Como ler:**
- O valor principal mostra o total em R$ (formatado em K ou M para facilitar leitura)
- O subtítulo mostra o total de unidades vendidas

**Exemplo:**
```
R$ 8.3K          → R$ 8.317 de faturamento no período
1.819 unidades   → Total de itens vendidos
```

**Ação quando baixo:** Verifique se o período selecionado é curto ou se há itens sem movimento. Expanda o filtro de período.

---

### 4.2 Curva ABC

**O que é:** Classificação dos produtos pelo método de Pareto:

| Curva | Critério | Significado |
|---|---|---|
| **A** | Primeiros 80% do faturamento acumulado | Produtos estrela — foco máximo |
| **B** | De 80% a 95% do faturamento acumulado | Produtos de suporte — atenção regular |
| **C** | Além de 95% do faturamento acumulado | Produtos complementares — requer análise |

**Como ler:**
```
44% / 33% / 24%   → Proporção de itens em cada curva
37A · 29B · 21C   → Quantidade de SKUs em cada categoria
```

**Ação:** Se a proporção de itens A for muito baixa (< 10%), significa que o sortimento está pulverizado. Considere racionalizar o mix.

---

### 4.3 Efeito Volume

**O que é:** Variação na quantidade de unidades vendidas em comparação ao período anterior.

**Fórmula:** `Δ Volume = Unidades Período Atual − Unidades Período Anterior`

**Como ler:**
- **Valor positivo (+)** = ganho de tração → mais unidades vendidas ✅
- **Valor negativo (−)** = perda de tração → menos unidades vendidas ⚠️

**Importante:** Esse indicador compara automaticamente com o **período imediatamente anterior** ao selecionado no filtro. Se "Todos os períodos" estiver selecionado, usa o primeiro período como baseline.

---

### 4.4 Efeito Mix

**O que é:** Variação na participação percentual de cada produto na receita total da cesta.

**Por que importa:** Um produto pode vender mais unidades, mas ter **menos espaço na cesta** se outros produtos cresceram mais. O Efeito Mix captura exatamente isso.

**Fórmula:** `Δ Mix = (% atual na cesta) − (% anterior na cesta)`

**Como ler:**
- **Valor positivo (+p.p.)** = ganho de espaço → produto ficou mais relevante ✅
- **Valor negativo (−p.p.)** = perda de espaço → produto perdeu participação na cesta ⚠️

**Unidade:** Pontos percentuais (p.p.), não porcentagem de variação.

---

### 4.5 Giro de Estoque

**O que é:** Velocidade com que o estoque é renovado no período.

**Fórmula:** `Giro = Unidades Vendidas ÷ Estoque Médio`

**Referências:**

| Giro | Interpretação |
|---|---|
| < 0.5 | Estoque muito parado — risco de encalhe |
| 0.5 – 1.5 | Giro normal para o período |
| > 1.5 | Giro alto — atenção para rupturas |
| > 3.0 | Giro muito alto — reposição urgente |

---

### 4.6 Alertas Ativos

**O que é:** Contagem total de situações que merecem atenção imediata.

**Como ler:**
- O número grande é o total de alertas
- "X urgentes" aparece quando há alertas de severidade Alta (Risco de Ruptura)
- "Sem urgentes" indica que todos os alertas são de média ou baixa severidade

> 🔴 **Priorize sempre os alertas de Ruptura** — são os que causam perda imediata de vendas.

---

## 5. Usando os Filtros

Os filtros ficam na sidebar esquerda e afetam **todos os cards, gráficos e alertas** simultaneamente.

### Filtro de Período

Seleciona o período de análise. As opções listadas são extraídas automaticamente dos dados importados.

| Opção | O que mostra |
|---|---|
| **Todos os períodos** | Consolida toda a base histórica |
| **Jan/26, Fev/26...** | Análise somente daquele mês |

💡 Para calcular Efeito Volume e Mix, selecione um **período específico** — o sistema usa o anterior como baseline automaticamente.

### Filtro de Região

Filtra por loja ou região comercial.

| Opção | O que mostra |
|---|---|
| **Todas as regiões** | Consolida todas as lojas/regiões |
| **Loja 1-5, Norte...** | Análise isolada de uma região |

---

## 6. Navegando pelas Abas

### 6.1 Dashboard

**Visão:** Painel principal com os 6 KPI cards + ranking de faturamento + doughnut ABC.

**Use quando:** Quiser o panorama geral da operação em um único olhar. Ideal para reuniões de acompanhamento semanal.

**O que você vê:**
- Cards de KPI na parte superior
- Gráfico de barras horizontais: Top 15 produtos por faturamento (cores por curva)
- Gráfico doughnut: Distribuição ABC em proporção e quantidade

---

### 6.2 Curva ABC

**Visão:** Análise aprofundada da classificação ABC com dois gráficos em tela cheia.

**Use quando:** Precisar definir estratégia de sortimento, priorizar reposição ou apresentar performance por produto para diretoria.

**O que você vê:**
- **Ranking completo** de faturamento por produto (Top 15, horizontal)
  - 🟣 **Roxo/Azulado** = Curva A
  - 🔵 **Cyan** = Curva B
  - 🟡 **Âmbar** = Curva C
- **Doughnut ABC** com proporção detalhada

**Dica de leitura:** Os produtos no topo do bar chart são os mais críticos para o negócio. Qualquer produto Curva A com estoque baixo deve ser tratado com prioridade máxima.

---

### 6.3 Volume & Mix

**Visão:** Análise das variações de volume de vendas e participação na cesta vs. período anterior.

**Use quando:** For investigar por que o faturamento variou (foi volume, foi mix, ou ambos?) ou identificar produtos que estão perdendo tração.

**O que você vê:**
- **Gráfico de Linhas — Efeito Volume:** Evolução da variação de unidades para os Top 5 produtos
  - Linha acima de zero = crescimento de volume
  - Linha abaixo de zero = retração de volume
- **Gráfico de Barras — Efeito Mix:** Variação de participação na cesta (Top 12 mais impactantes)
  - 🟢 **Verde** = ganhou espaço na cesta
  - 🔴 **Vermelho** = perdeu espaço na cesta

**Exemplo de interpretação:**
> *"O Neosoro teve Efeito Volume positivo (+20 un) mas Efeito Mix negativo (−0.5 p.p.), o que indica que ele cresceu em unidades, mas outros produtos cresceram proporcionalmente mais. O produto perdeu relevância relativa na cesta mesmo vendendo mais."*

---

### 6.4 Giro / Heatmap

**Visão:** Mapa de calor da velocidade de saída de estoque cruzando produto com região.

**Use quando:** Quiser identificar desequilíbrios regionais — um produto que gira bem em uma loja mas empaca em outra.

**O que você vê:**
- **Heatmap Produto × Região:** Cada célula representa o giro de estoque
  - 🔵 **Azul escuro** → Giro baixo (estoque parado)
  - 🟠 **Laranja médio** → Giro normal
  - 🔴 **Vermelho** → Giro alto (atenção para ruptura)
- Passe o mouse sobre qualquer célula para ver o valor exato

**Dica:** Use o heatmap para **redistribuição de estoque** — mova produtos de lojas com giro baixo para lojas com giro alto antes da ruptura.

---

## 7. Central de Alertas

A **Central de Alertas** fica na sidebar direita e lista todas as situações que requerem atenção.

### Tipos de Alerta

#### 🔴 Ruptura (Alta Severidade)
```
CRITÉRIO: Vendas ≥ percentil 60 E Estoque ≤ 15% do estoque médio
```
Produto com alta demanda e estoque crítico. **Risco imediato de venda zero.**

**Ação recomendada:**
- Reposição urgente
- Verificar se há estoque em outras lojas para transferência
- Acionar fornecedor para entrega express

#### 🟡 Encalhe (Média Severidade)
```
CRITÉRIO: Vendas ≤ percentil 30 E Estoque ≥ 3.5x o estoque médio
```
Produto com baixa demanda e estoque excessivo. **Capital imobilizado.**

**Ação recomendada:**
- Promoção relâmpago ou desconto progressivo
- Campanha de cross-selling (venda junto com item de maior giro)
- Revisar política de compra — reduzir lote mínimo

#### 🔵 Baixa Performance (Baixa Severidade)
```
CRITÉRIO: Giro < 50% da média geral E Produto é Curva A ou B
```
Produto estratégico com giro abaixo do esperado. **Perda de receita potencial.**

**Ação recomendada:**
- Revisar precificação comparada ao mercado
- Avaliar posicionamento no PDV (visibilidade, ponto extra)
- Checar se há problema de qualidade ou validade
- Analisar se houve ruptura anterior que quebrou o hábito de compra

---

### Filtrando Alertas

Use os botões de filtro no topo da Central de Alertas:

| Botão | Exibe |
|---|---|
| **Todos** | Todos os alertas |
| **Rupturas** | Somente riscos de ruptura |
| **Encalhes** | Somente encalhes detectados |
| **Performance** | Somente alertas de baixo giro |

### Lendo um Alerta

```
┌─────────────────────────────────────────────────┐
│ 🟡 ENCALHE          Dipirona 500mg · Loja 1     │
│                                                   │
│ Encalhe detectado: estoque 4x acima do médio     │
│                                                   │
│ ▼ (expandir para ver recomendação completa)      │
└─────────────────────────────────────────────────┘
```

- **Badge colorido** → tipo e severidade do alerta
- **Nome do produto + Loja** → onde aconteceu
- **Mensagem** → o que foi detectado (com valores)
- **Expandir (▼)** → mostra a recomendação de ação

---

## 8. Interpretando os Gráficos

### Gráfico de Barras (ABC Revenue)

- **Eixo X (horizontal):** Valor em R$ de faturamento
- **Eixo Y (vertical):** Nome do produto (encurtado para caber)
- **Cor da barra:** Indica a curva do produto (🟣A / 🔵B / 🟡C)
- **Ordenação:** Do maior para o menor faturamento
- **Barra mais longa = produto mais importante** para o faturamento

> 💡 Os primeiros 3-5 produtos geralmente representam > 50% do faturamento total.

---

### Gráfico de Linhas (Volume Effect)

- **Eixo X:** Períodos cronológicos
- **Eixo Y:** Variação em unidades (Δ)
- **Linha zero** = sem variação vs. período anterior
- Cada linha colorida é um produto diferente (Top 5 mais impactantes)
- **Positivo = cresceu, Negativo = retrocedeu**

---

### Gráfico de Barras (Mix Effect)

- **Eixo X:** Variação em pontos percentuais (p.p.)
- **Eixo Y:** Produto + Região abreviados
- **Verde = ganhou espaço na cesta**
- **Vermelho = perdeu espaço na cesta**
- Ordenado por maior impacto absoluto

---

### Heatmap de Giro

- Cada **linha** é um produto (Top 10 por volume)
- Cada **coluna** é uma região/loja
- A **cor** indica o nível de giro:
  - Azul escuro → giro baixo → estoque parado
  - Laranja → giro médio → saudável
  - Vermelho → giro alto → atenção para ruptura
- Passe o **mouse** sobre qualquer célula para ver o valor exato

---

## 9. Ações Recomendadas por Alerta

### Matriz de Decisão Rápida

| Situação | Curva A | Curva B | Curva C |
|---|---|---|---|
| **Ruptura** | 🔴 Reposição URGENTE | 🟠 Reposição prioritária | 🟡 Avaliar se mantém no mix |
| **Encalhe** | 🟠 Promoção ou cross-sell | 🟡 Desconto pontual | 🔵 Considerar descontinuação |
| **Baixa Perf.** | 🔴 Investigar causa raiz | 🟡 Revisar precificação | 🔵 Monitorar por 30 dias |

---

### Fluxo de Decisão: Ruptura

```
Produto com Alerta de Ruptura
         │
         ▼
Há estoque em outras lojas?
    ├── SIM → Transferir imediatamente
    └── NÃO → Entrar em contato com fornecedor
                    │
                    ▼
             Entrega possível em < 48h?
                ├── SIM → Acionar pedido emergencial
                └── NÃO → Comunicar equipe de vendas
                           Buscar substituto temporário
```

---

### Fluxo de Decisão: Encalhe

```
Produto com Alerta de Encalhe
         │
         ▼
Produto próximo do vencimento?
    ├── SIM → Promoção agressiva imediata
    └── NÃO → Cross-selling ou bundles
                    │
                    ▼
             Produto Curva A ou B?
                ├── SIM → Verificar causa (mudança de demanda?)
                └── NÃO → Avaliar descontinuação
```

---

## 10. Perguntas Frequentes

**P: O dashboard salva os dados importados?**  
R: Não. O BoostMark processa os dados localmente no navegador para preservar a privacidade. Ao recarregar a página, retorna para o Modo Demo. Faça o upload do arquivo a cada sessão de análise.

---

**P: Posso usar arquivos com mais de 1.000 produtos?**  
R: Sim. O sistema foi testado com planilhas de até 500 produtos por upload. Para bases maiores, recomendamos filtrar por período antes de exportar.

---

**P: O que acontece se meu arquivo não for reconhecido?**  
R: Uma mensagem de erro aparece na área de upload. Verifique se:
- O arquivo está no formato `.xlsx` ou `.csv`
- O arquivo não está protegido por senha
- O CSV usa vírgula como separador (não ponto-e-vírgula)
- Os nomes das colunas seguem o modelo do Template CSV

---

**P: Por que os Efeitos Volume e Mix mostram zero?**  
R: Os efeitos comparativos exigem **pelo menos 2 períodos** no dataset. Se importou apenas um período, esses indicadores mostrarão zero. Inclua dados de dois ou mais períodos no mesmo arquivo.

---

**P: Posso ter múltiplas lojas no mesmo arquivo?**  
R: Sim. O sistema detecta todas as regiões/lojas automaticamente e disponibiliza no filtro de Região. Análises podem ser feitas consolidadas ou por loja individualmente.

---

**P: Como exporto os resultados?**  
R: Por enquanto, use a ferramenta de captura de tela do seu sistema operacional (`Win + Shift + S` no Windows) para capturar gráficos e cards para relatórios. A funcionalidade de exportação PDF está no roadmap.

---

**P: Os alertas são gerados com base em quê?**  
R: Os alertas usam thresholds estatísticos calculados sobre os dados importados:
- Ruptura: estoque ≤ 15% do médio e vendas ≥ percentil 60 do dataset
- Encalhe: estoque ≥ 3.5x o médio e vendas ≤ percentil 30 do dataset
- Baixa Performance: giro < 50% da média geral, apenas para curvas A e B

---

**P: O dashboard funciona no celular?**  
R: Sim. O layout é responsivo e se adapta a telas menores. Em smartphones, a sidebar e a Central de Alertas empilham verticalmente abaixo dos gráficos.

---

**P: Com que frequência devo atualizar os dados?**  
R: Recomendamos o ciclo:
- **Diariamente** para equipes de campo (verificar rupturas)
- **Semanalmente** para análises de tendência (Volume/Mix/ABC)
- **Mensalmente** para decisões de mix e compras

---

<div align="center">

---

📧 Suporte: rilen.lima@gmail.com

**BoostMark** · Sell-Out Intelligence · © 2026

</div>
