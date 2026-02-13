# DRE Gerencial — Documentação Técnica & Mapeamento

Este documento descreve o modelo de dados, as queries e a lógica de mapeamento para o relatório de **DRE Gerencial** da Cidade Viva Education.

---

## 1. Modelo de Dados (SQL Schema)

### Tabela: `dre_account_mapping`
Esta tabela define o mapeamento entre o Plano de Contas técnico e as linhas gerenciais da DRE.

```sql
CREATE TABLE dre_account_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_code VARCHAR(20) NOT NULL, -- Ex: '1.01.01'
    dre_line_id VARCHAR(20) NOT NULL,  -- Ex: 'DED', 'COGS', 'DV_MK'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Exemplo de Mapeamento (AccountMappingDRE)
| Plano de Contas (Código) | Nome da Conta | Linha DRE (ID) | Descrição da Linha |
| :--- | :--- | :--- | :--- |
| **3.01.01.01** | Receita Mensalidades | `RB` | Receita Bruta |
| **3.01.02.01** | ISS Faturado | `DED` | Deduções e Impostos |
| **4.01.01.01** | Custo de Material Didático | `COGS` | Custos Diretos |
| **4.02.01.05** | Facebook/Google Ads | `DV_MK` | Marketing & Vendas |
| **4.02.05.01** | Cloud Hosting (AWS) | `DV_TE` | Tecnologia / Plataforma |

---

## 2. Queries Principais (Pseudo-SQL)

### Query: Consolidação Mensal (Competência)
Esta query agrupa os lançamentos baseando-se no mapeamento da DRE para o mês de competência selecionado.

```sql
SELECT 
    m.dre_line_id,
    SUM(CASE WHEN e.type = 'REVENUE' THEN e.amount ELSE -e.amount END) as realized_total,
    SUM(b.planned_amount) as budgeted_total
FROM financial_entries e
JOIN dre_account_mapping m ON e.account_code = m.account_code
LEFT JOIN budget_plans b ON e.account_code = b.account_code 
    AND b.month = MONTH(e.competency_date)
    AND b.year = YEAR(e.competency_date)
WHERE 
    e.competency_date BETWEEN '2026-02-01' AND '2026-02-28'
    AND e.front = :front_filter -- PAIDEIA / OIKOS / BIBLOS
GROUP BY m.dre_line_id;
```

### Query: Drill-down de Linha
Recupera os lançamentos individuais que compõem uma linha específica da DRE.

```sql
SELECT 
    e.date, 
    e.description, 
    e.amount, 
    e.front, 
    a.account_name
FROM financial_entries e
JOIN dre_account_mapping m ON e.account_code = m.account_code
JOIN chart_of_accounts a ON e.account_code = a.code
WHERE 
    m.dre_line_id = :line_id 
    AND e.competency_date BETWEEN :start_date AND :end_date
ORDER BY e.date DESC;
```

---

## 3. Lógica de Agregação (Engine)

O motor de DRE aplica as seguintes fórmulas após o processamento das linhas SUB:

1.  **Receita Líquida (RL)** = `RB` + `DED`
2.  **Margem Bruta (MB)** = `RL` + `COGS`
3.  **EBITDA GERENCIAL** = `MB` + `DV` (Onde `DV` é a soma de `DV_MK`, `DV_AD`, `DV_TE`, etc)
4.  **RESULTADO OPERACIONAL** = `EBITDA` + `DA`

---

## 4. Filtros Globais

O sistema utiliza as seguintes dimensões para filtragem em todas as visões:
- **Período**: Mês e Ano de Competência (Default) ou Caixa.
- **Unidade (Frente)**: Filtramento por Centro de Custo/Frente.
- **Produto**: Atrelado à flag de produto em cada lançamento para análise de rentabilidade.
