# 🚀 Título do Projeto: BoostMark - Sell-Out Intelligence Dashboard

<div align="center">
    <img src="C:\Users\rtl\Downloads\BoostMark.png" alt="Banner ou Screenshot do Projeto" width="100%" max-width="800px">
</div>

<br>

## 📝 Descrição do Projeto

Este projeto tem como objetivo analisar e monitorar a performance comercial em tempo real para redes de varejo e farmácias. O **BoostMark** atua como um dashboard dinâmico que transforma relatórios brutos de Ponto de Venda (PDV), sejam eles de planilhas Excel ou arquivos CSV, em métricas e insights acionáveis totalmente automatizados (como cálculo de Curva ABC, Efeito Volume e Mix de Vendas).

Desenvolvido com foco em **performance, análise preditiva visual e facilidade de uso** para as equipes de *trade marketing*, gestores comerciais e analistas de dados. A plataforma destaca-se por possuir um motor automático de alertas contra rupturas e encalhes de estoque, comparativos temporais ágeis e ausência total de necessidade de setup complexo.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

Nesta seção, listamos as principais tecnologias que sustentam o projeto.

| Camada | Tecnologias |
|:---|:---|
| **Linguagem/Runtime** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) |
| **Frameworks/Libs** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white) |
| **Processamento de Dados** | Extratores Inteligentes: ![xlsx](https://img.shields.io/badge/xlsx-217346?style=for-the-badge&logo=microsoftexcel&logoColor=white) e ![PapaParse](https://img.shields.io/badge/PapaParse-FFD700?style=for-the-badge&logoColor=black) |
| **DevOps/Cloud/Hosting** | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) |
| **Ferramentas** | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) |

*(Ecossistema voltado ao uso flexível no Frontend aliado à robustez de tipagem)*

---

## ⚙️ Como Rodar o Projeto Localmente

Siga estes passos para configurar o ambiente e executar o projeto na sua máquina.

### 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado:
* Node.js (versão 18+)
* NPM ou Yarn
* Um cliente Git para clonar o repositório

### � Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/boostmark.git
    cd boostmark
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Execute o projeto:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

4.  **Acesse a aplicação:**
    A aplicação estará rodando na porta do Vite, que por padrão fica disponível no seu navegador em: `http://localhost:5173`. Assim que for aberto, você pode realizar o upload dos relatórios CSV ou XLSX compatíveis.

---

## 📁 Estrutura do Projeto (Visão Geral)

Para facilitar a navegação, aqui está uma breve descrição da organização das pastas no **BoostMark**.

```text
boostmark/
├── src/                  # Código-fonte principal da aplicação
│   ├── components/       # Componentes de UI (AlertsPanel, Charts, Filtros e KPICards)
│   ├── types/            # Definições estritas de tipagem e interfaces TypeScript
│   ├── utils/            # Regras de negócios, Parser de relatórios e Analytics (cálculo de Δs e Pareto)
│   ├── data/             # Assets e logotipos estáticos referenciados pelo UI
│   ├── App.tsx           # Contexto principal de estado global
│   └── main.tsx          # Ponto de entrada do React
├── public/               # Favicon, manifestos e arquivos públicos estáticos
├── .firebase/            # Instâncias em cache e referências de Deploy Firebase
├── firebase.json         # Configurações de Deploy (Hosting Settings)
├── vite.config.ts        # Regras de compilação da ferramenta Vite
├── package.json          # Listagem de Bibliotecas e Scripts
└── README.md             # Este arquivo
```

---

# Rilen T. L. - DataScience

**25+ anos em TI - Especialista em Big Data | IA | CyberSecurity**

***Full Stack Development & Data Intelligence***

Rio das Ostras · RJ · Brasil · PcD (Implante Coclear)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rilen/)
[![Gmail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rilen.lima@gmail.com)
[![Portfólio](https://img.shields.io/badge/Portfólio-000000?style=for-the-badge&logo=githubpages&logoColor=white)](https://rilen.github.io/portfolio/)

---
