# ⚡ BoostMark — Manual de Utilização

> **Versão:** 1.1 · **Atualizado em:** Março/2026  
> **Acesso:** [https://boost--mark.web.app](https://boost--mark.web.app)

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Estrutura da Interface](#2-estrutura-da-interface)
3. [Importando seus Dados](#3-importando-seus-dados)
4. [Entendendo os Indicadores (KPIs)](#4-entendendo-os-indicadores-kpis)
5. [Usando os Filtros](#5-usando-os-filtros)
6. [Navegação por Abas](#6-navegação-por-abas)
7. [Central de Alertas](#7-central-de-alertas)
8. [Interpretando os Gráficos](#8-interpretando-os-gráficos)
9. [Ações Recomendadas por Alerta](#9-ações-recomendadas-por-alerta)
10. [Perguntas Frequentes](#10-perguntas-frequentes)

---

## 1. Visão Geral

O **BoostMark** é uma ferramenta de inteligência de sell-out que automatiza a análise de performance de produtos no varejo. Ele processa relatórios de vendas e estoque, classificando itens pela Curva ABC, medindo ganhos de volume/mix e disparando alertas automáticos de ruptura ou estoque parado.

---

## 2. Estrutura da Interface

A interface é dividida em quatro áreas principais:

- **Sidebar (Esquerda):** Upload de arquivos e filtros dinâmicos.
- **Header:** Navegação por abas temática.
- **Painel Central:** KPIs consolidados e visualizações gráficas.
- **Sidebar de Alertas (Direita):** Lista prioritária de problemas detectados.

---

## 3. Importando seus Dados

### 3.1 Relatório XLSX (Formato Automático)
O BoostMark detecta automaticamente relatórios exportados do seu sistema PDV no formato **"Mais Vendidos Por Quantidade"**.

**Passo a passo:**
1. No seu sistema de gestão, exporte o relatório de vendas em formato `.xlsx`
2. No dashboard, clique na área pontilhada **"Arraste CSV / XLSX ou clique"**
3. Selecione o arquivo. O sistema exibirá o nome da empresa e o período extraído em um banner.

### 3.2 Arquivo CSV Personalizado
Para dados provenientes de outros sistemas, use o formato CSV. Baixe o **Template CSV** na sidebar para ver o cabeçalho correto.

---

## 4. Entendendo os Indicadores (KPIs)

### 4.1 Faturamento e Deltas (Δ)
Exibe a receita total do período selecionado. O indicador pequeno no topo (+X%) mostra o crescimento ou queda em relação ao período cronologicamente anterior.

### 4.2 Curva ABC Dinâmica
Classifica produtos em A (80% da receita), B (15%) e C (5%). É recalculada dinamicamente conforme você muda os filtros de região ou fabricante.

### 4.3 Efeito Volume e Mix
- **Volume:** Quantas unidades a mais (ou a menos) foram vendidas comparado ao período anterior.
- **Mix:** Se o produto ganhou ou perdeu relevância dentro da receita total da loja.

---

## 5. Usando os Filtros

### 5.1 Período
Define o recorte temporal. Selecionar um período específico habilita as comparações históricas automáticas.

### 5.2 Região
Isola a performance por loja ou grupo de lojas.

### 5.3 Fabricante / Fornecedor
Filtra todos os gráficos para mostrar apenas produtos de um fornecedor específico. Essencial para reuniões comerciais com marcas parceiras.

### 5.4 Busca por Produto
Busca instantânea por nome ou parte do nome do produto.

---

## 6. Navegação por Abas

- **Dashboard:** Visão geral executiva com KPIs e tendências.
- **Curva ABC:** Ranking detalhado de faturamento (Top SKUs).
- **Volume & Mix:** Análise de tração e participação de mercado.
- **Heatmap:** Identificação de gargalos geográficos de giro.

---

## 7. Central de Alertas

Os alertas são gerados automaticamente combinando vendas e cobertura de estoque:

- **🔴 Ruptura:** Venda em alta e estoque insuficiente para os próximos dias. **Ação: Reposição Imediata.**
- **🟡 Encalhe:** Estoque muito alto (excesso de cobertura) e venda estagnada. **Ação: Promoção.**
- **🔵 Baixa Performance:** Itens Curva A que estão girando abaixo do normal. **Ação: Revisar POS/Exposição.**

---

## 8. Interpretando os Gráficos

### Tendência de Vendas (Histórico)
Mostra como Faturamento e Unidades variam ao longo do tempo. Divergências entre as linhas indicam mudanças no preço médio praticado.

### Saúde de Estoque por PDV
Identifica quais lojas concentram a maior carga de rupturas ou encalhes, permitindo decisões logísticas cirúrgicas.

---

## 9. Perguntas Frequentes

**Q: Como o sistema calcula o período anterior?**  
A: O sistema ordena todos os períodos encontrados no arquivo cronologicamente e pega o vizinho imediato do período selecionado.

**Q: Posso importar vários arquivos?**  
A: Sim. A ferramenta processa o arquivo mais recente carregado, substituindo os dados da memória.

---
