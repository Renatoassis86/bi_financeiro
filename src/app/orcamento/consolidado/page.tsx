'use client';

import { useState, useEffect } from 'react';
import {
    Table as TableIcon,
    FileSpreadsheet,
    Download,
    Filter,
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Building2,
    Calendar,
    Database,
    Sparkles,
    Lock,
    Loader2
} from 'lucide-react';
import { useGlobalFilters } from '@/contexts/GlobalFilterContext';
import { supabase } from '@/lib/supabase';

// --- TYPES FOR DYNAMIC DATA ---

interface BudgetRecord {
    id: string;
    level: number;
    parentId?: string;
    front: string;
    category: string;
    subcategory: string;
    months: number[];
    total: number;
    code: string;
}

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export default function ConsolidadoOrcamentarioPage() {
    const { filters } = useGlobalFilters();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [budgetData, setBudgetData] = useState<BudgetRecord[]>([]);
    const [totals, setTotals] = useState({ revenue: 0, expense: 0, result: 0 });

    useEffect(() => {
        fetchData();
    }, [filters.year]);

    async function fetchData() {
        setLoading(true);
        try {
            // 1. Fetch Master Data
            const { data: accounts } = await supabase.from('accounts_plan').select('*').order('code');
            const { data: fronts } = await supabase.from('fronts').select('id, name');
            const { data: plans } = await supabase.from('budget_plans').select('*').eq('year', filters.year || 2026);

            if (!accounts || !fronts) return;

            // 2. Map Plans to a Matrix
            const planMap: Record<string, number[]> = {};
            plans?.forEach(p => {
                if (!planMap[p.account_id]) planMap[p.account_id] = Array(12).fill(0);
                planMap[p.account_id][p.month - 1] += Number(p.amount_planned);
            });

            // 3. Built Hierarchical Records and Roll up amounts
            const records: BudgetRecord[] = accounts.map(acc => {
                const months = planMap[acc.id] || Array(12).fill(0);
                return {
                    id: acc.id,
                    code: acc.code,
                    level: acc.level,
                    parentId: acc.parent_id,
                    category: acc.type,
                    subcategory: acc.name,
                    front: 'CONSOLIDADO', // Simplificado para a visão mestre
                    months: months,
                    total: months.reduce((a, b) => a + b, 0)
                };
            });

            // Hierarchical Roll-up (Soma filhos nos pais)
            // Processamos do nível mais alto para o mais baixo (folhas para raiz)
            const maxLevel = Math.max(...records.map(r => r.level));
            for (let l = maxLevel; l > 1; l--) {
                records.filter(r => r.level === l).forEach(child => {
                    const parent = records.find(p => p.id === child.parentId);
                    if (parent) {
                        child.months.forEach((val, i) => {
                            parent.months[i] += val;
                        });
                        parent.total = parent.months.reduce((a, b) => a + b, 0);
                    }
                });
            }

            setBudgetData(records);

            // Calculate Totals
            const revenue = records.filter(r => r.level === 1 && r.category === 'RECEITA').reduce((sum, r) => sum + r.total, 0);
            const expense = records.filter(r => r.level === 1 && r.category === 'DESPESA').reduce((sum, r) => sum + Math.abs(r.total), 0);
            setTotals({
                revenue,
                expense,
                result: revenue - expense
            });

        } catch (error) {
            console.error("Error fetching budget data:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (val: number) => {
        if (val === 0) return '-';
        const isNeg = val < 0;
        const absVal = Math.abs(val).toLocaleString('pt-BR', { minimumFractionDigits: 0 });
        return isNeg ? `(${absVal})` : absVal;
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal">

            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-active)'
            }}>
                <div>
                    <h1 className="text-h1" style={{ fontSize: '3rem' }}>
                        Proposta <span style={{ color: 'var(--text-primary)' }}>Orçamentária</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Matriz consolidada do exercício 2026. Integração automática entre entradas manuais e subidas via importador.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn btn-ghost" style={{ border: '1px solid var(--border-subtle)' }}>
                        <Download size={16} /> EXPORTAR MATRIZ
                    </button>
                    <button className="btn btn-primary shadow-lg shadow-[var(--primary)]/10">
                        <Sparkles size={16} /> SINCRONIZAR BI
                    </button>
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                    <input
                        placeholder="Pesquisar por conta, unidade ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-subtle)',
                            padding: '14px 14px 14px 48px',
                            color: 'white',
                            fontSize: '14px',
                            borderRadius: '2px',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '12px 20px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={14} color="var(--secondary)" />
                        <span style={{ fontSize: '12px', fontWeight: 800 }}>EXERCÍCIO 2026</span>
                    </div>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,102,0,0.05)', border: '1px solid var(--accent)', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={14} color="var(--accent)" />
                        <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--accent)' }}>VERSÃO BLOQUEADA</span>
                    </div>
                </div>
            </div>

            {/* Master Spreadsheet Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{
                    maxHeight: 'calc(100vh - 450px)',
                    overflowY: 'auto',
                    overflowX: 'auto'
                }} className="custom-scrollbar">
                    {loading ? (
                        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <p style={{ color: 'var(--text-disabled)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                Consolidando Matriz Orçamentária...
                            </p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1500px' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border-active)' }}>
                                    <th style={{ ...thStyle, position: 'sticky', left: 0, zIndex: 20, background: 'var(--bg-card)', minWidth: '350px' }}>RUBRICA / CONTA</th>
                                    <th style={thStyle}>UNIDADE</th>
                                    {MONTHS.map(m => (
                                        <th key={m} style={{ ...thStyle, textAlign: 'right', minWidth: '100px' }}>{m}</th>
                                    ))}
                                    <th style={{ ...thStyle, textAlign: 'right', background: 'rgba(229, 225, 216, 0.05)', minWidth: '120px' }}>TOTAL ANUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgetData
                                    .filter(item =>
                                        item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        item.code.includes(searchTerm)
                                    )
                                    .map((row) => (
                                        <tr key={row.id} style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                                            background: row.level === 1 ? 'rgba(255,255,255,0.01)' : 'transparent',
                                            display: (row.total === 0 && row.level > 1) ? 'none' : 'table-row' // Esconde subcontas zeradas para limpar visão
                                        }} className="hover:bg-white/[0.02] transition-all">
                                            <td style={{
                                                ...tdStyle,
                                                paddingLeft: `${row.level * 24}px`,
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10,
                                                background: 'var(--bg-card)',
                                                borderRight: '1px solid rgba(255,255,255,0.03)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: row.level === 1 ? (row.category === 'RECEITA' ? '#00ff88' : 'var(--accent)') : 'var(--text-disabled)',
                                                        opacity: 0.5
                                                    }} />
                                                    <span style={{
                                                        fontWeight: row.level === 1 ? 900 : (row.level === 2 ? 700 : 500),
                                                        color: row.level === 1 ? 'white' : 'var(--text-secondary)',
                                                        fontSize: row.level === 1 ? '13px' : '12px',
                                                        textTransform: row.level === 1 ? 'uppercase' : 'none',
                                                        letterSpacing: row.level === 1 ? '0.05em' : 'normal'
                                                    }}>
                                                        {row.subcategory}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: 900,
                                                    color: 'var(--text-disabled)'
                                                }}>{row.front}</span>
                                            </td>
                                            {row.months.map((val, idx) => (
                                                <td key={idx} style={{
                                                    ...tdStyle,
                                                    textAlign: 'right',
                                                    fontFamily: 'var(--font-outfit)',
                                                    color: val < 0 ? 'var(--accent)' : (val > 0 ? '#00ff88' : 'var(--text-disabled)')
                                                }}>
                                                    {formatCurrency(val)}
                                                </td>
                                            ))}
                                            <td style={{
                                                ...tdStyle,
                                                textAlign: 'right',
                                                fontWeight: 900,
                                                color: row.total < 0 ? 'var(--accent)' : (row.total > 0 ? 'var(--primary)' : 'var(--text-disabled)'),
                                                background: 'rgba(229, 225, 216, 0.02)',
                                                borderLeft: '1px solid rgba(255,255,255,0.03)'
                                            }}>
                                                {formatCurrency(row.total)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Footer Summary Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '60px',
                padding: '32px 48px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Receitas (Exercício)</p>
                    <h3 style={{ fontSize: '2rem', color: '#00ff88', fontFamily: 'var(--font-outfit)', fontWeight: 800 }}>
                        {totals.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Despesas (Exercício)</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--accent)', fontFamily: 'var(--font-outfit)', fontWeight: 800 }}>
                        {formatCurrency(totals.expense * -1)}
                    </h3>
                </div>
                <div style={{ textAlign: 'right', paddingLeft: '40px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resultado Estimado</p>
                    <h3 style={{ fontSize: '2.4rem', color: 'var(--primary)', fontFamily: 'var(--font-outfit)', fontWeight: 900 }}>
                        {totals.result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                </div>
            </div>

        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '10px',
    fontWeight: 900,
    color: 'var(--text-disabled)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '13px',
    color: 'var(--text-secondary)'
};
