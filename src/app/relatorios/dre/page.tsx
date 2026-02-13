'use client';

import { useState } from 'react';
import {
    ChevronDown, ChevronRight, Info, Filter, ArrowUpRight,
    Search, Download, FileText, Printer, FileSpreadsheet,
    TrendingUp, TrendingDown, Layers, Target, Database,
    Eye, Calendar, Box, Building2
} from 'lucide-react';
import { useGlobalFilters } from '@/contexts/GlobalFilterContext';

// --- DATA STRUCTURES ---

type DRELine = {
    id: string;
    label: string;
    planned: number;
    realized: number;
    type: 'HEADER' | 'SUB' | 'TOTAL' | 'RESULT';
    level: number;
    children?: string[]; // IDs of children lines
};

const DRE_STRUCTURE: DRELine[] = [
    { id: 'RB', label: 'RECEITA BRUTA', planned: 950000, realized: 880000, type: 'HEADER', level: 0 },
    { id: 'DED', label: '(-) Deduções, Impostos e Taxas', planned: -95000, realized: -85000, type: 'SUB', level: 1 },
    { id: 'RL', label: 'RECEITA LÍQUIDA', planned: 855000, realized: 795000, type: 'TOTAL', level: 0 },
    { id: 'COGS', label: '(-) Custos Diretos (COGS)', planned: -350000, realized: -380000, type: 'SUB', level: 1 },
    { id: 'MB', label: 'MARGEM BRUTA', planned: 505000, realized: 415000, type: 'TOTAL', level: 0 },
    { id: 'DV', label: '(-) Despesas Operacionais', planned: -280000, realized: -295000, type: 'HEADER', level: 1 },
    { id: 'DV_MK', label: 'Marketing & Vendas', planned: -80000, realized: -85000, type: 'SUB', level: 2 },
    { id: 'DV_AD', label: 'Administrativo', planned: -50000, realized: -55000, type: 'SUB', level: 2 },
    { id: 'DV_TE', label: 'Tecnologia / Plataforma', planned: -60000, realized: -62000, type: 'SUB', level: 2 },
    { id: 'DV_PE', label: 'Pedagógico / Conteúdo', planned: -70000, realized: -75000, type: 'SUB', level: 2 },
    { id: 'DV_JU', label: 'Jurídico / Compliance', planned: -20000, realized: -18000, type: 'SUB', level: 2 },
    { id: 'EBITDA', label: 'EBITDA GERENCIAL', planned: 225000, realized: 120000, type: 'TOTAL', level: 0 },
    { id: 'DA', label: '(-) Depreciação / Amortização', planned: -15000, realized: -15000, type: 'SUB', level: 1 },
    { id: 'ROP', label: 'RESULTADO OPERACIONAL', planned: 210000, realized: 105000, type: 'RESULT', level: 0 },
];

const DRILL_DOWN_DATA = [
    { id: 101, data: '05/02/2026', descricao: 'Google Ads - Campanha Paideia', conta: 'Marketing', valor: -12500.00, frente: 'PAIDEIA' },
    { id: 102, data: '08/02/2026', descricao: 'Assinatura AWS Production', conta: 'Tecnologia', valor: -4200.00, frente: 'CONSOLIDADO' },
    { id: 103, data: '12/02/2026', descricao: 'Salários Equipe Pedagógica', conta: 'Pedagógico', valor: -45000.00, frente: 'PAIDEIA' },
];

export default function DREGerencialPage() {
    const { filters, setFilters } = useGlobalFilters();
    const [drillDownLine, setDrillDownLine] = useState<string | null>(null);

    const formatCurrency = (val: number) => {
        const isNeg = val < 0;
        const absVal = Math.abs(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        return isNeg ? `(${absVal})` : absVal;
    };

    const calculateVariance = (real: number, plan: number) => {
        const diff = real - plan;
        const perc = plan !== 0 ? (diff / Math.abs(plan)) * 100 : 0;
        return { diff, perc };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Global Filter & Header Control */}
            <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="text-h1" style={{ fontSize: '24px' }}>DRE Gerencial — Cidade Viva</h1>
                        <p className="text-body" style={{ marginTop: '4px' }}>Visão consolidada e por unidade de negócio</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={`btn ${filters.viewType === 'COMPETENCIA' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilters({ ...filters, viewType: 'COMPETENCIA' })} style={{ fontSize: '11px' }}>COMPETÊNCIA</button>
                        <button className={`btn ${filters.viewType === 'CAIXA' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilters({ ...filters, viewType: 'CAIXA' })} style={{ fontSize: '11px', border: '1px solid #333' }}>CAIXA</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
                    <FilterGroup icon={<Calendar size={14} />} label="Período">
                        <select
                            value={filters.month}
                            onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                            style={selectStyle}
                        >
                            <option value={1}>Janeiro / 2026</option>
                            <option value={2}>Fevereiro / 2026</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup icon={<Building2 size={14} />} label="Frente">
                        <select
                            value={filters.front}
                            onChange={(e) => setFilters({ ...filters, front: e.target.value })}
                            style={selectStyle}
                        >
                            <option value="CONSOLIDADO">Consolidado</option>
                            <option value="PAIDEIA">PAIDEIA</option>
                            <option value="OIKOS">OIKOS</option>
                            <option value="BIBLOS">BIBLOS</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup icon={<Box size={14} />} label="Produto">
                        <select
                            value={filters.product}
                            onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                            style={selectStyle}
                        >
                            <option value="TODOS">Todos os Produtos</option>
                            <option value="CURSOS">Cursos Online</option>
                            <option value="LIVROS">Editora / Livros</option>
                        </select>
                    </FilterGroup>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #333', fontSize: '12px' }}><FileSpreadsheet size={16} /></button>
                        <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #333', fontSize: '12px' }}><Download size={16} /></button>
                    </div>
                </div>
            </div>

            {/* 2. DRE Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="text-h3" style={{ fontSize: '14px' }}>Demonstrativo Gerencial ({filters.viewType})</h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: 'var(--primary)' }} /> Realizado</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#444' }} /> Orçado</span>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                            <th style={{ padding: '16px 24px' }}>Estrutura</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Orçado (Plan)</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Realizado (Act)</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Var. (R$)</th>
                            <th style={{ padding: '16px', textAlign: 'right', paddingRight: '24px' }}>Var. (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DRE_STRUCTURE.map((line) => {
                            const varData = calculateVariance(line.realized, line.planned);
                            const isTotal = line.type === 'TOTAL' || line.type === 'RESULT';
                            const isHeader = line.type === 'HEADER';

                            return (
                                <tr
                                    key={line.id}
                                    onClick={() => line.type === 'SUB' && setDrillDownLine(line.label)}
                                    style={{
                                        borderBottom: '1px solid #1A1A1A',
                                        backgroundColor: isTotal ? 'rgba(255,255,255,0.02)' : 'transparent',
                                        cursor: line.type === 'SUB' ? 'pointer' : 'default',
                                        transition: 'background 0.2s',
                                        fontWeight: isTotal || isHeader ? 700 : 400
                                    }}
                                    className={line.type === 'SUB' ? 'hover:bg-white/[0.04]' : ''}
                                >
                                    <td style={{ padding: '14px 24px', paddingLeft: 24 + (line.level * 20), fontSize: '13px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {line.type === 'SUB' && <Eye size={12} color="var(--primary)" opacity={0.5} />}
                                            {line.label}
                                        </div>
                                        {line.type === 'TOTAL' && <div style={{ fontSize: '9px', color: 'var(--primary)', fontWeight: 'normal' }}>Cálculo Automático</div>}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {formatCurrency(line.planned)}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', color: isTotal && line.realized < 0 ? 'var(--danger)' : 'white' }}>
                                        {formatCurrency(line.realized)}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', color: varData.diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                        {varData.diff > 0 ? '+' : ''}{varData.diff.toLocaleString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', paddingRight: '24px', fontSize: '13px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: varData.perc >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                            {varData.perc > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {Math.abs(varData.perc).toFixed(1)}%
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 3. Drill-down Sidebar */}
            {drillDownLine && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Composição da Linha</p>
                            <h2 className="text-h2" style={{ color: 'var(--primary)' }}>{drillDownLine}</h2>
                        </div>
                        <button onClick={() => setDrillDownLine(null)} className="btn btn-ghost"><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {DRILL_DOWN_DATA.map(item => (
                            <div key={item.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.data}</span>
                                    <span className={`badge badge-${item.frente.toLowerCase()}`} style={{ fontSize: '9px' }}>{item.frente}</span>
                                </div>
                                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.descricao}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Conta: {item.conta}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: item.valor < 0 ? 'var(--danger)' : 'var(--success)' }}>
                                        R$ {Math.abs(item.valor).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                        <button className="btn btn-ghost" style={{ width: '100%', border: '1px solid #333' }}>Ver Todos os Lançamentos</button>
                    </div>
                </div>
            )}

            {/* 4. Footer info */}
            <div style={{ display: 'flex', gap: '16px', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                    <Database size={12} /> Fonte: Lançamentos Supabase ({filters.viewType})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-disabled)' }}>
                    <Target size={12} /> Orçamento: Versão 2026.1 (Locked)
                </div>
            </div>

        </div>
    );
}

function FilterGroup({ icon, label, children }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}

const selectStyle = {
    width: '100%',
    background: '#0D0D0D',
    border: '1px solid #222',
    padding: '10px 12px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    outline: 'none'
};

const sidePanelStyle: any = {
    position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px',
    background: '#0A0A0A', borderLeft: '1px solid #222', padding: '40px',
    boxShadow: '-24px 0 60px rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column'
};

function X(props: any) { return <ArrowUpRight style={{ transform: 'rotate(45deg)' }} {...props} /> }
