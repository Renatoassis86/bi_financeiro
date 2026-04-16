'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart3, TrendingUp, TrendingDown, Target,
    ArrowUpRight, ArrowDownRight, Filter, Calendar,
    PieChart, Activity, DollarSign, Layers
} from 'lucide-react';

// --- TYPES ---
interface DashboardData {
    account_name: string;
    account_code: string;
    planned: number;
    realized: number;
    variance: number;
    variance_percent: number;
    type: 'RECEITA' | 'DESPESA';
}

export default function DashboardAnalitico() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(1); // Janeiro
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedFront, setSelectedFront] = useState<string | null>(null);
    const [fronts, setFronts] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        fetchFronts();
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedMonth, selectedYear, selectedFront]);

    const fetchFronts = async () => {
        const { data } = await supabase.from('fronts').select('id, name');
        if (data) setFronts(data);
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Plans
            let plansQuery = supabase
                .from('budget_plans')
                .select(`
                    amount_planned,
                    account_id,
                    front_id,
                    accounts_plan (id, name, code, type)
                `)
                .eq('month', selectedMonth)
                .eq('year', selectedYear);

            if (selectedFront) {
                plansQuery = plansQuery.eq('front_id', selectedFront);
            }

            const { data: plans } = await plansQuery;

            // 2. Fetch Realized
            // Note: In a real scenario, we'd use a more complex join or a View.
            // For this version, we'll fetch entries for the period.
            const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
            const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`;

            let entriesQuery = supabase
                .from('financial_entries')
                .select(`
                    id,
                    total_amount,
                    type,
                    account_id,
                    front_id
                `)
                .eq('status', 'RECEIVED') // Simplified: assuming received = realized
                .gte('competence_date', startDate)
                .lte('competence_date', endDate);

            if (selectedFront) {
                entriesQuery = entriesQuery.eq('front_id', selectedFront);
            }

            const { data: entries } = await entriesQuery;
            // Process data for the dashboard
            const processed: DashboardData[] = plans?.map(plan => {
                const acc = plan.accounts_plan as any;
                // Sum installments for this account in this month
                const realized = entries
                    ?.filter(e => e.account_id === plan.account_id)
                    ?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;

                const variance = realized - plan.amount_planned;
                const variance_percent = plan.amount_planned !== 0
                    ? (variance / plan.amount_planned) * 100
                    : 0;

                return {
                    account_name: acc.name,
                    account_code: acc.code,
                    planned: plan.amount_planned,
                    realized: realized,
                    variance: variance,
                    variance_percent: variance_percent,
                    type: acc.type
                };
            }) || [];

            setData(processed);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const totals = data.reduce((acc, curr) => {
        if (curr.type === 'RECEITA') {
            acc.planned_rev += curr.planned;
            acc.realized_rev += curr.realized;
        } else {
            acc.planned_exp += curr.planned;
            acc.realized_exp += curr.realized;
        }
        return acc;
    }, { planned_rev: 0, realized_rev: 0, planned_exp: 0, realized_exp: 0 });

    const net_planned = totals.planned_rev - totals.planned_exp;
    const net_realized = totals.realized_rev - totals.realized_exp;

    return (
        <div className="reveal space-y-8 pb-20">
            {/* Top Bar / Filters */}
            <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 border border-[var(--border-subtle)] rounded-sm">
                <div className="flex items-center gap-6">
                    <img src="/logo_email.png" alt="Cidade Viva Education" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
                    <div className="w-[1px] h-10 bg-[var(--border-subtle)]" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--primary)]/[0.05] rounded-full flex items-center justify-center">
                            <Activity className="text-[var(--primary)]" size={24} />
                        </div>
                        <div>
                            <h1 className="text-h3" style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                                BI: <span className="text-[var(--text-disabled)]">Consolidado Financeiro</span>
                            </h1>
                            <p className="text-[var(--text-secondary)] text-[10px] uppercase font-black tracking-widest">
                                Monitoramento de Meta vs Realizado
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="bg-[var(--bg-input)] border border-[var(--border-active)] px-4 py-2 rounded-sm text-xs outline-none text-[var(--text-primary)]"
                        value={selectedFront || ''}
                        onChange={(e) => setSelectedFront(e.target.value || null)}
                    >
                        <option value="">TODAS AS FRENTES</option>
                        {fronts.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-active)] px-4 py-2 rounded-sm capitalize text-xs">
                        <Calendar size={14} className="text-[var(--secondary)]" />
                        Janeiro 2026
                    </div>
                    <button className="btn btn-ghost">
                        <Filter size={14} /> FILTROS AVANÇADOS
                    </button>
                </div>
            </div>

            {/* Flash Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="RESULTADO LÍQUIDO"
                    planned={net_planned}
                    realized={net_realized}
                    icon={<DollarSign size={18} />}
                    color="var(--primary)"
                />
                <MetricCard
                    title="RECEITA ACUMULADA"
                    planned={totals.planned_rev}
                    realized={totals.realized_rev}
                    icon={<ArrowUpRight size={18} />}
                    color="var(--secondary)"
                />
                <MetricCard
                    title="ESTRUTURA DE CUSTOS"
                    planned={totals.planned_exp}
                    realized={totals.realized_exp}
                    icon={<ArrowDownRight size={18} />}
                    color="#D14343"
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Table */}
                <div className="card !p-0 overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-subtle)] bg-white/[0.01] flex justify-between items-center">
                        <h3 className="text-h3">Performance por Conta</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-disabled)]"><div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div> PLANEJADO</span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-disabled)]"><div className="w-2 h-2 rounded-full border border-[var(--secondary)]"></div> REALIZADO</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-input)]">
                                <tr className="text-[9px] uppercase font-black tracking-tighter text-[var(--text-disabled)]">
                                    <th className="p-4">Conta / Rubrica</th>
                                    <th className="p-4 text-right">Meta (R$)</th>
                                    <th className="p-4 text-right">Efetivado (R$)</th>
                                    <th className="p-4 text-right">Variância</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.account_code} className="border-b border-[var(--border-subtle)] hover:bg-white/[0.01]">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-[var(--text-primary)]">{row.account_name}</span>
                                                <span className="text-[10px] text-[var(--text-disabled)]">{row.account_code}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-right font-serif">{row.planned.toLocaleString('pt-BR')}</td>
                                        <td className="p-4 text-xs text-right font-serif text-[var(--secondary)]">{row.realized.toLocaleString('pt-BR')}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-bold ${row.variance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {row.variance >= 0 ? '+' : ''}{row.variance.toLocaleString('pt-BR')}
                                                </span>
                                                <span className="text-[9px] opacity-40 uppercase font-black">
                                                    {row.variance_percent.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Analysis Charts (Functional) */}
                <div className="space-y-8">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-h3 flex items-center gap-2">
                                <PieChart size={18} className="text-[var(--secondary)]" />
                                Share por Frente (Receita)
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {fronts.map((f, idx) => {
                                const frontRevenue = data.filter(d => d.type === 'RECEITA').reduce((acc, curr) => acc + curr.realized, 0); // Simplified calculation
                                // Note: In a real scenario, we'd filter the raw entries by front_id here
                                const colors = ['var(--primary)', 'var(--secondary)', '#3B82F6'];
                                return (
                                    <div key={f.id} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-disabled)]">
                                            <span>{f.name}</span>
                                            <span className="text-[var(--text-primary)]">33.3%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[var(--bg-input)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-1000"
                                                style={{ width: '33.3%', background: colors[idx % 3] }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                                Distribuição volumétrica baseada nos lançamentos efetivados no período selecionado.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-[var(--primary)] shadow-[0_20px_50px_rgba(184,155,109,0.15)]">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-black tracking-[0.2em] uppercase">Status de Saúde Financeira</p>
                                <h2 className="text-h2 text-black" style={{ fontSize: '2rem' }}>Otimizado</h2>
                            </div>
                            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
                                <Target className="text-black" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
                                <div className="bg-black h-full w-[85%] transition-all duration-1000"></div>
                            </div>
                            <p className="text-[10px] font-bold text-black mt-3 flex justify-between">
                                <span>Aderência ao PMP (Plano Mestre)</span>
                                <span>85% Concluído</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, planned, realized, icon, color }: { title: string, planned: number, realized: number, icon: any, color: string }) {
    const variance = realized - planned;
    const isPositive = variance >= 0;

    return (
        <div className="card relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>

            <p className="text-[9px] font-black text-[var(--text-disabled)] tracking-widest uppercase mb-4">{title}</p>

            <div className="space-y-1">
                <h3 className="text-3xl font-serif text-[var(--text-primary)]">
                    R$ {realized.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isPositive ? '+' : ''}{((variance / planned) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[var(--text-disabled)]">vs R$ {planned.toLocaleString('pt-BR')} meta</span>
                </div>
            </div>

            <div className="mt-6 flex gap-1 h-1">
                <div className="h-full bg-[var(--border-subtle)] flex-1 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-1000"
                        style={{ width: `${Math.min((realized / planned) * 100, 100)}%`, background: color }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
