-- ######################################################
-- CIDADE VIVA FINANCE - DATABASE SCHEMA (ERP + BI)
-- Target: PostgreSQL / Supabase
-- ######################################################

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ######################################################
-- 1. ESTRUTURA ORGANIZACIONAL & USUÁRIOS
-- ######################################################

CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'viewer', -- admin, controller, manager, viewer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fronts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- PAIDEIA, OIKOS, BIBLOS
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ######################################################
-- 2. CADASTROS BASE (DIMENSÕES)
-- ######################################################

CREATE TABLE accounts_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES accounts_plan(id),
    code TEXT UNIQUE NOT NULL, -- Ex: 1.1.01
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- ATIVO, PASSIVO, RECEITA, DESPESA
    level INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cost_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES cost_centers(id),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tax_id TEXT UNIQUE, -- CPF/CNPJ
    type TEXT CHECK (type IN ('CLIENT', 'SUPPLIER', 'BOTH')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    front_id UUID REFERENCES fronts(id) NOT NULL,
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ######################################################
-- 3. TRANSACIONAL (ERP)
-- ######################################################

CREATE TABLE financial_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    entity_id UUID REFERENCES entities(id),
    front_id UUID REFERENCES fronts(id) NOT NULL,
    account_id UUID REFERENCES accounts_plan(id) NOT NULL,
    cost_center_id UUID REFERENCES cost_centers(id),
    total_amount DECIMAL(15,2) NOT NULL,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PARTIAL', 'SETTLED', 'CANCELLED')),
    document_number TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID REFERENCES financial_entries(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    competence_date DATE NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ######################################################
-- 4. CONTROLADORIA (ORÇAMENTO)
-- ######################################################

CREATE TABLE budget_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    front_id UUID REFERENCES fronts(id) NOT NULL,
    account_id UUID REFERENCES accounts_plan(id) NOT NULL,
    cost_center_id UUID REFERENCES cost_centers(id) NOT NULL,
    amount_planned DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, month, front_id, account_id, cost_center_id)
);

-- ######################################################
-- 5. AUDITORIA & GATILHOS
-- ######################################################

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_financial_entries_updated_at BEFORE UPDATE ON financial_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON installments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ######################################################
-- 6. VIEWS PARA BI (DENORMALIZADO)
-- ######################################################

CREATE VIEW view_fact_accrual AS
SELECT 
    i.id as installment_id,
    e.description,
    e.type as entry_type,
    i.amount,
    i.competence_date,
    f.name as front_name,
    ap.name as account_name,
    ap.code as account_code,
    cc.name as cost_center_name,
    ent.name as entity_name
FROM installments i
JOIN financial_entries e ON i.entry_id = e.id
JOIN fronts f ON e.front_id = f.id
JOIN accounts_plan ap ON e.account_id = ap.id
LEFT JOIN cost_centers cc ON e.cost_center_id = cc.id
LEFT JOIN entities ent ON e.entity_id = ent.id;
