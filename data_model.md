# Modelo de Dados - Cidade Viva Finance (ERP + BI)

Este documento descreve a arquitetura de dados unificada para suportar operações de ERP (OLTP) e análise de BI (DW/OLAP).

---

## 1. ERP - Camada Operacional (OLTP)

O modelo ERP foca em integridade referencial, normalização e auditoria.

### 1.1 Core & Organização
- **`companies`**: Empresa principal (Cidade Viva Education).
- **`fronts`**: Frentes de negócio (PAIDEIA, OIKOS, BIBLOS).
- **`users`**: Cadastro de usuários.
- **`roles` / `permissions`**: RBAC (Role-Based Access Control).

### 1.2 Estruturas Hierárquicas (Dimensões ERP)
- **`accounts_plan`**: Plano de contas.
  - `id`, `parent_id`, `code` (ex: 1.1.01), `name`, `type` (Ativo, Passivo, Receita, Despesa), `level`.
- **`cost_centers`**: Centros de custo.
  - `id`, `parent_id`, `code`, `name`.
- **`products`**: Cadastro de produtos com vínculo obrigatório com frente.
  - `id`, `sku`, `name`, `front_id`, `active`.

### 1.3 Transacional (Controle Financeiro)
- **`financial_entries` (Lançamento Mestre)**:
  - `id`, `description`, `type` (Receita/Despesa), `entity_id` (Fornecedor/Cliente), `front_id`, `cost_center_id`, `account_id`, `total_amount`, `currency`, `document_number`, `status` (Aberto, Parcial, Liquidado, Cancelado).
- **`installments` (Parcelas/Compromissos)**:
  - `id`, `entry_id`, `installment_number`, `due_date`, `competence_date`, `amount`, `discount_amount`, `penalty_amount`, `status` (Pendente, Pago, Vencido, Cancelado).
- **`transactions` (Movimentação de Caixa)**:
  - `id`, `installment_id`, `payment_date` (Data Caixa), `amount_paid`, `payment_method`, `bank_account_id`.

### 1.4 Orçamento & Controladoria
- **`budgets`**: Planejamento mensal.
  - `id`, `year`, `month`, `account_id`, `cost_center_id`, `front_id`, `amount_planned`.
- **`commitments` (Empenhos)**: Reserva de orçamento.
  - `id`, `budget_id`, `description`, `amount_committed`.
- **`budget_reallocations` (Remanejamentos)**:
  - `id`, `from_budget_id`, `to_budget_id`, `amount`, `justification`, `created_by`.

---

## 2. BI - Camada Analítica (DW)

O DW segue o modelo **Star Schema** para performance em ferramentas de BI (PowerBI/Looker).

### Dimensions (Tabelas Dimensão)
- **`dim_date`**: Grain: Dia. Atributos: `ano`, `mes`, `trimestre`, `dia_util`, `feriado`.
- **`dim_account`**: Atributos: `nome_conta`, `grupo_nivel_1`, `grupo_nivel_2`.
- **`dim_cost_center`**: Atributos: `nome_cc`, `departamento`.
- **`dim_front`**: Atributos: `nome_frente` (Paideia, Oikos, Biblos).
- **`dim_entity`**: Clientes e Fornecedores consolidados.
- **`dim_product`**: Linha de produto e SKU.

### Facts (Tabelas Fato)
- **`fact_accrual` (Fato Lançamentos - Competência)**:
  - Chaves: `sk_date_competence`, `sk_account`...
  - Métricas: `valor_lancado`, `valor_provisionado`.
- **`fact_cash` (Fato Caixa - Realizado)**:
  - Chaves: `sk_date_payment`, `sk_account`...
  - Métricas: `valor_pago`, `juros_pago`, `desconto_aplicado`.
- **`fact_budget` (Fato Orçamento)**:
  - Chaves: `sk_period`, `sk_account`, `sk_cost_center`...
  - Métricas: `valor_planejado`.

---

## 3. Regras de Integridade & Validações

### Essenciais
1. **Consistência de Parcelas**: A soma de `installments.amount` deve ser exatamente igual a `financial_entries.total_amount`.
2. **Vínculo de Produto**: Se o lançamento é de "Receita de Mensalidade", o `product_id` e `front_id` devem ser validados (ex: Mensalidade escolar só pode ser Frente PAIDEIA).
3. **Status de Registro**: Um registro `Paid` não pode ser excluído; deve haver um estorno com log de auditoria.
4. **Fechamento Mensal**: Impedir lançamentos ou alterações em `competence_date < data_fechamento_oficial`.

### Índices Sugeridos
- `idx_entries_front_date`: `(front_id, competence_date)` para filtros globais rápidos.
- `idx_installments_due_status`: `(due_date, status)` para dashboards de contas a pagar/receber.
- `idx_budget_lookup`: `(year, month, account_id, front_id)` para cálculos de Realizado x Orçado.

---

## 4. Auditoria
Todas as tabelas contêm:
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `created_by` (uuid)
- `deleted_at` (soft delete)
- `version` (optimistic locking)
