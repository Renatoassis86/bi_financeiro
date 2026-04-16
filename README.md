# Financeiro Education - BI Financeiro

Este é o projeto de BI Financeiro desenvolvido em Next.js com integração ao Supabase.

## 🚀 Como configurar em uma nova máquina local

Siga os passos abaixo para rodar o projeto em outro computador:

### 1. Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (Versão 18 ou superior recomendada)
- **Git**

### 2. Clonar o Repositório

```bash
git clone https://github.com/Renatoassis86/bi_financeiro.git
cd bi_financeiro
```

### 3. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

### 4. Configurar Variáveis de Ambiente

O projeto depende do Supabase para o banco de dados e autenticação.

1. Localize o arquivo `.env.example` na raiz do projeto.
2. Crie uma cópia dele e nomeie como `.env.local`.
3. Preencha os valores das chaves (você pode copiar os valores da máquina original se tiver acesso ou do painel do Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 5. Executar o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🛠 Estrutura do Projeto

- `/src/app`: Rotas e páginas da aplicação (Next.js App Router).
- `/src/components`: Componentes reutilizáveis de UI.
- `/src/contexts`: Contextos do React para estado global.
- `/supabase_schema.sql`: Arquivo SQL para recriar a estrutura do banco se necessário.
- `/migrations`: Histórico de alterações do banco.

## 📦 Tecnologias Principais

- **Frontend:** Next.js, React, Tailwind CSS.
- **Gráficos:** Recharts.
- **Backend/DB:** Supabase.
- **Utilitários:** xlsx (para importação de dados).
