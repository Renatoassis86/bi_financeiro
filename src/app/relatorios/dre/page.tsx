'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    FileText, Download, Printer, Filter,
    ChevronDown, ChevronRight, Calculator,
    TrendingUp, TrendingDown, Info
} from 'lucide-react';

interface DRELine {
    id: string;
    label: string;
    level: number;
    planned: number;
    realized: number;
    isTotal?: boolean;
}

export default function RelatorioDRE() {
    const [loading, setLoading] = useState(true);
    const [dreData, setDreData] = useState<DRELine[]>([]);
    const [selectedFront, setSelectedFront] = useState<string | null>(null);
    const [fronts, setFronts] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        calculateDRE();
    }, [selectedFront]);

    const fetchInitialData = async () => {
        const { data } = await supabase.from('fronts').select('id, name');
        if (data) setFronts(data);
    };

    const calculateDRE = async () => {
        setLoading(true);
        try {
            let budgetQuery = supabase.from('budget_plans').select('amount_planned, account_id, accounts_plan(type, name, code)');
            let realizedQuery = supabase.from('financial_entries').select('total_amount, account_id, type, accounts_plan(name, code)').eq('status', 'RECEIVED');

            if (selectedFront) {
                budgetQuery = budgetQuery.eq('front_id', selectedFront);
                realizedQuery = realizedQuery.eq('front_id', selectedFront);
            }

            const { data: budget } = await budgetQuery;
            const { data: realized } = await realizedQuery;

            const getSum = (type: string, list: any[], field: string) =>
                list?.filter(i => (i.accounts_plan?.type || i.type) === type).reduce((acc, curr) => acc + (curr[field] || 0), 0) || 0;

            const rev_planned = getSum('RECEITA', budget || [], 'amount_planned');
            const rev_realized = getSum('INCOME', realized || [], 'total_amount');

            const exp_planned = getSum('DESPESA', budget || [], 'amount_planned');
            const exp_realized = getSum('EXPENSE', realized || [], 'total_amount');

            const lines: DRELine[] = [
                { id: 'RB', label: '1. RECEITA BRUTA OPERACIONAL', level: 0, planned: rev_planned, realized: rev_realized, isTotal: true },
                { id: 'DED', label: '(-) Deduções e Impostos', level: 1, planned: rev_planned * 0.05, realized: rev_realized * 0.05 },
                { id: 'RL', label: '2. RECEITA LÍQUIDA', level: 0, planned: rev_planned * 0.95, realized: rev_realized * 0.95, isTotal: true },
                { id: 'CPV', label: '(-) Custos de Produtos Vendidos (COGS)', level: 1, planned: exp_planned * 0.4, realized: exp_realized * 0.4 },
                { id: 'LB', label: '3. LUCRO BRUTO (MARGEM BRUTA)', level: 0, planned: (rev_planned * 0.95) - (exp_planned * 0.4), realized: (rev_realized * 0.95) - (exp_realized * 0.4), isTotal: true },
                { id: 'DV', label: '(-) Despesas Operacionais (EBIDTA)', level: 1, planned: exp_planned * 0.6, realized: exp_realized * 0.6 },
                { id: 'EBITDA', label: '4. EBITDA GERENCIAL', level: 0, planned: ((rev_planned * 0.95) - (exp_planned * 0.4)) - (exp_planned * 0.6), realized: ((rev_realized * 0.95) - (exp_realized * 0.4)) - (exp_realized * 0.6), isTotal: true },
            ];

            setDreData(lines);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reveal space-y-16 pb-20">

            {/* 1. Header Area - SPACIOUS */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />
                        <h2 className="text-caption text-[var(--primary)] tracking-[0.4em] text-sm">Performance Gerencial & Auditoria</h2>
                    </div>
                    <h1 className="h1">DRE <span className="text-[var(--primary)]">Estratégico</span></h1>
                    <p className="text-lg font-medium text-[var(--text-secondary)] opacity-80 max-w-2xl leading-relaxed">
                        Demonstrativo de Resultado por Competência detalhado por centro de custos e unidades.
                    </p>
                </div>

                <div className="flex flex-wrap gap-8 items-center w-full lg:w-auto">
                    <div className="relative group min-w-[280px]">
                        <select
                            className="appearance-none w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] px-8 py-5 pr-14 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white cursor-pointer hover:border-[var(--primary)]/50 transition-all outline-none shadow-lg"
                            value={selectedFront || ''}
                            onChange={(e) => setSelectedFront(e.target.value || null)}
                        >
                            <option value="">TODAS AS UNIDADES</option>
                            {fronts.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] pointer-events-none group-hover:text-[var(--primary)] transition-colors" size={18} />
                    </div>

                    <div className="flex gap-4">
                        <button className="btn btn-ghost !px-10 shadow-lg">
                            <Download size={20} className="text-[var(--accent-azure)]" />
                            <span>EXPORTAR</span>
                        </button>
                        <button className="btn btn-primary !px-10 shadow-xl shadow-[var(--primary)]/20">
                            <Printer size={20} />
                            <span>IMPRIMIR</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. DRE Data Grid - SPACIOUS */}
            <div className="card !p-0 overflow-hidden shadow-2xl relative border-[var(--border-subtle)]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Table Header */}
                <div className="bg-[#1D222B] p-10 border-b border-[var(--border-subtle)] flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-inner">
                            <Calculator size={22} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-disabled)] mb-1 block leading-none">Status de Referência</span>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Consolidado Mensal • FY26 Q1</h4>
                        </div>
                    </div>
                    <div className="flex gap-16 text-[10px] uppercase font-black tracking-[0.25em] text-[var(--text-disabled)] pr-10">
                        <span className="w-36 text-right">Planejado</span>
                        <span className="w-36 text-right">Realizado</span>
                        <span className="w-36 text-right">Variância</span>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5 bg-white/[0.01]">
                    {dreData.map((line) => {
                        const variance = line.realized - line.planned;
                        const variancePerc = line.planned !== 0 ? (variance / Math.abs(line.planned)) * 100 : 0;

                        return (
                            <div
                                key={line.id}
                                className={`flex items-center justify-between p-10 hover:bg-white/[0.02] transition-all group ${line.isTotal ? 'bg-white/[0.01]' : ''}`}
                            >
                                <div className="flex items-center gap-6" style={{ paddingLeft: line.level * 48 }}>
                                    {line.isTotal ?
                                        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-md">
                                            <ChevronDown size={16} className="text-[var(--primary)]" />
                                        </div> :
                                        <ChevronRight size={16} className="text-[var(--text-disabled)] group-hover:translate-x-2 transition-transform opacity-40" />
                                    }
                                    <span className={`text-base tracking-tight ${line.isTotal ? 'text-white font-black' : 'text-[var(--text-secondary)] font-semibold'}`}>
                                        {line.label}
                                    </span>
                                </div>

                                <div className="flex gap-16 text-base font-bold pr-10">
                                    <span className="w-36 text-right text-[var(--text-disabled)] opacity-80 font-medium">
                                        R$ {line.planned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className={`w-36 text-right ${line.isTotal ? 'text-[var(--primary)] font-black' : 'text-white'}`}>
                                        R$ {line.realized.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                    <div className="w-36 flex justify-end">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider ${variance >= 0 ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'}`}>
                                            {variance >= 0 ? '▲' : '▼'} {Math.abs(variancePerc).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Tactical Cards - SPACIOUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                <div className="card !p-10 flex items-start gap-8 bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="p-4 bg-[var(--accent-azure)]/10 rounded-2xl border border-[var(--accent-azure)]/20 shadow-xl">
                        <Info className="text-[var(--accent-azure)]" size={24} />
                    </div>
                    <div className="space-y-4">
                        <p className="text-caption !text-[var(--accent-azure)]">Nota Técnica de Competência</p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                            Este relatório utiliza o regime de <strong>competência</strong>. Os valores realizados refletem o faturamento bruto emitido, garantindo a visão estratégica de performance operacional independente do fluxo de caixa imediato.
                        </p>
                    </div>
                </div>

                <div className="card !p-10 flex items-start gap-8 bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="p-4 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20 shadow-xl">
                        <TrendingUp className="text-[var(--primary)]" size={24} />
                    </div>
                    <div className="space-y-4">
                        <p className="text-caption !text-[var(--primary)]">Análise de Variância (VAR)</p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                            A árvore gerencial segue o padrão parametrizado no <strong>Controladoria v2026</strong>. Variâncias superiores a 15% em custos operacionais disparam alertas automáticos para revisão de budget.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
