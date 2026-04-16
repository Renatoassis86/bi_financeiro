-- ######################################################
-- CONTROLADORIA: REMANEJAMENTOS ORÇAMENTÁRIOS
-- ######################################################

CREATE TABLE IF NOT EXISTS budget_reallocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    
    source_front_id UUID REFERENCES fronts(id) NOT NULL,
    source_account_id UUID REFERENCES accounts_plan(id) NOT NULL,
    source_cost_center_id UUID REFERENCES cost_centers(id),
    
    target_front_id UUID REFERENCES fronts(id) NOT NULL,
    target_account_id UUID REFERENCES accounts_plan(id) NOT NULL,
    target_cost_center_id UUID REFERENCES cost_centers(id),
    
    amount DECIMAL(15,2) NOT NULL,
    justification TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    requested_by UUID REFERENCES auth.users(id),
    approved_by_1 UUID REFERENCES auth.users(id),
    approved_by_2 UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE TRIGGER update_budget_reallocations_updated_at 
BEFORE UPDATE ON budget_reallocations 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
