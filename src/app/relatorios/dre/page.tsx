'use client';

import { useState, useMemo } from 'react';
import {
    ChevronDown, ChevronRight, Info, Filter, ArrowUpRight,
    Search, Download, FileText, Printer, FileSpreadsheet,
    TrendingUp, TrendingDown, Layers, Target, Database,
    Eye, Calendar, Box, Building2, X, AlertCircle
} from 'lucide-react';
import { useGlobalFilters } from '@/contexts/GlobalFilterContext';

// --- DATA STRUCTURES ---

type DRELine = {
    id: string;
    label: string;
    planned: number;
    realized: number;
    type: 'HEADER' | 'SUB' | 'TOTAL' | 'RESULT' | 'ELIMINACAO';
    level: number;
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
    { id: 'DV_PE', label: 'Pedagógico / Conteúdo', planned: -70000, realized: -75000, type: 'SUB', level: 2 },
    { id: 'EBITDA', label: 'EBITDA GERENCIAL', planned: 225000, realized: 120000, type: 'TOTAL', level: 0 },
    { id: 'ELIM', label: '(+/-) Eliminações Inter-Company', planned: 0, realized: -12000, type: 'ELIMINACAO', level: 0 },
    { id: 'ROP', label: 'RESULTADO LÍQUIDO CONSOLIDADO', planned: 225000, realized: 108000, type: 'RESULT', level: 0 },
];

const DRILL_DOWN_DATA = [
    { id: 101, data: '05/02/2026', descricao: 'Google Ads - Campanha Paideia', conta: 'Marketing', valor: -12500.00, frente: 'PAIDEIA' },
    { id: 102, data: '08/02/2026', descricao: 'Assinatura AWS Production', conta: 'Tecnologia', valor: -4200.00, frente: 'CONSOLIDADO' },
];

export default function DREGerencialPage() {
    const { filters, setFilters } = useGlobalFilters();
    const [drillDownLine, setDrillDownLine] = useState<string | null>(null);

    const isConsolidated = filters.front === 'CONSOLIDADO';

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

            {/* 1. Global Filter & Multi-Entity Header */}
            <div className="card" style={{ padding: '24px', borderLeft: `4px solid ${isConsolidated ? 'var(--secondary)' : 'var(--primary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1 className="text-h1" style={{ fontSize: '24px' }}>DRE Gerencial — {isConsolidated ? 'Grupo Cidade Viva' : filters.front}</h1>
                            {isConsolidated && <span style={{ fontSize: '10px', background: 'var(--secondary)', color: 'black', padding: '2px 8px', borderRadius: '10px', fontWeight: 900 }}>CONSOLIDADOR ATIVO</span>}
                        </div>
                        <p className="text-body" style={{ marginTop: '4px' }}>Visão {isConsolidated ? 'multinível com eliminações automáticas' : 'por unidade de negócio individual'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={`btn ${filters.viewType === 'COMPETENCIA' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilters({ ...filters, viewType: 'COMPETENCIA' })} style={{ fontSize: '11px' }}>COMPETÊNCIA</button>
                        <button className={`btn ${filters.viewType === 'CAIXA' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilters({ ...filters, viewType: 'CAIXA' })} style={{ fontSize: '11px', border: '1px solid #333' }}>CAIXA</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
                    <FilterGroup icon={<Calendar size={14} />} label="Período">
                        <select value={filters.month} onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })} style={selectStyle}>
                            <option value={1}>Janeiro / 2026</option>
                            <option value={2}>Fevereiro / 2026</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup icon={<Building2 size={14} />} label="Unidade / Consolidação">
                        <select value={filters.front} onChange={(e) => setFilters({ ...filters, front: e.target.value })} style={selectStyle}>
                            <option value="CONSOLIDADO">🏢 Consolidado (Grupo)</option>
                            <option value="PAIDEIA">🎓 PAIDEIA</option>
                            <option value="OIKOS">🏠 OIKOS</option>
                            <option value="BIBLOS">📚 BIBLOS</option>
                        </select>
                    </FilterGroup>

                    <FilterGroup icon={<Box size={14} />} label="Produto (BI)">
                        <select value={filters.product} onChange={(e) => setFilters({ ...filters, product: e.target.value })} style={selectStyle}>
                            <option value="TODOS">Todos os Produtos</option>
                            <option value="CURSOS">Cursos Online</option>
                        </select>
                    </FilterGroup>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #333', fontSize: '12px' }}><FileSpreadsheet size={16} /></button>
                        <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px' }}><RefreshCw size={14} style={{ marginRight: 8 }} /> Recalcular</button>
                    </div>
                </div>
            </div>

            {/* 2. DRE Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.01)' }}>
                            <th style={{ padding: '16px 24px' }}>Estrutura de Resultados</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Budget 2026</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Realizado</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Desvio (R$)</th>
                            <th style={{ padding: '16px', textAlign: 'right', paddingRight: '24px' }}>Perf. (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DRE_STRUCTURE.map((line) => {
                            if (!isConsolidated && line.type === 'ELIMINACAO') return null;
                            const varData = calculateVariance(line.realized, line.planned);
                            const isTotal = line.type === 'TOTAL' || line.type === 'RESULT';
                            const isHeader = line.type === 'HEADER';
                            const isElim = line.type === 'ELIMINACAO';

                            return (
                                <tr
                                    key={line.id}
                                    onClick={() => line.type === 'SUB' && setDrillDownLine(line.label)}
                                    style={{
                                        borderBottom: '1px solid #1A1A1A',
                                        backgroundColor: isTotal ? 'rgba(255,255,255,0.02)' : isElim ? 'rgba(255,171,0,0.02)' : 'transparent',
                                        cursor: line.type === 'SUB' ? 'pointer' : 'default',
                                        fontWeight: isTotal || isHeader ? 700 : 400
                                    }}
                                    className={line.type === 'SUB' ? 'hover:bg-white/[0.04]' : ''}
                                >
                                    <td style={{ padding: '14px 24px', paddingLeft: 24 + (line.level * 20), fontSize: '13px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {isElim && <AlertCircle size={12} color="var(--warning)" />}
                                            {line.label}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', color: 'var(--text-secondary)' }}>{formatCurrency(line.planned)}</td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px' }}>{formatCurrency(line.realized)}</td>
                                    <td style={{ padding: '14px', textAlign: 'right', fontSize: '13px', color: varData.diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                        {varData.diff.toLocaleString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '14px', textAlign: 'right', paddingRight: '24px', fontSize: '13px' }}>
                                        {Math.abs(varData.perc).toFixed(1)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 3. Panel: Drilldown */}
            {drillDownLine && (
                <div style={sidePanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <h3>Composição: {drillDownLine}</h3>
                        <button onClick={() => setDrillDownLine(null)}><X size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterGroup({ icon, label, children }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>{icon} {label}</label>
            {children}
        </div>
    );
}

function RefreshCw({ size, style, className }: any) { return <Layers size={size} style={style} className={className} /> }

const selectStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px', borderRadius: '8px', color: 'white', fontSize: '13px' };
const sidePanelStyle: any = { position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', background: '#090909', borderLeft: '1px solid #222', padding: '40px', zIndex: 1000 };
