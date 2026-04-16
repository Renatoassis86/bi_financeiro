'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Calendar, ArrowUpCircle, ArrowDownCircle,
    Wallet, TrendingUp, Search, Filter,
    ArrowRight, ChevronLeft, ChevronRight,
    CircleDollarSign
} from 'lucide-react';

interface DailyFlow {
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
    accumulated: number;
}

export default function FluxoCaixaDiario() {
    const [loading, setLoading] = useState(true);
    const [flowData, setFlowData] = useState<DailyFlow[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchDailyFlow();
    }, [selectedMonth]);

    const fetchDailyFlow = async () => {
        setLoading(true);
        try {
            // Get all installments for the month
            const year = 2026;
            const startDate = `${year}-${String(selectedMonth).padStart(2, '0')}-01`;
            const endDate = `${year}-${String(selectedMonth).padStart(2, '0')}-31`;

            const { data: installments } = await supabase
                .from('installments')
                .select(`
                    amount,
                    payment_date,
                    due_date,
                    entry:financial_entries(type)
                `)
                .neq('status', 'CANCELLED');

            // Process daily aggregation
            const daily: { [date: string]: { in: number, out: number } } = {};

            // Initial balance (Mock for demo)
            let currentBalance = 150000;

            installments?.forEach(i => {
                const dateKey = (i.payment_date || i.due_date).split('T')[0];
                if (!daily[dateKey]) daily[dateKey] = { in: 0, out: 0 };

                const type = (i.entry as any)?.type;
                if (type === 'INCOME') daily[dateKey].in += Number(i.amount);
                else daily[dateKey].out += Number(i.amount);
            });

            // Format array and calculate accumulation
            const result: DailyFlow[] = Object.keys(daily).sort().map(date => {
                const dayData = daily[date];
                const dayBalance = dayData.in - dayData.out;
                currentBalance += dayBalance;

                return {
                    date,
                    inflow: dayData.in,
                    outflow: dayData.out,
                    balance: dayBalance,
                    accumulated: currentBalance
                };
            });

            setFlowData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reveal space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center bg-[var(--bg-card)] p-8 border border-[var(--border-subtle)] rounded-sm">
                <div className="flex items-center gap-8">
                    <img src="/logo_email.png" alt="Cidade Viva Education" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
                    <div className="w-[1px] h-10 bg-[var(--border-subtle)]" />
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[var(--secondary)]/[0.1] rounded-full flex items-center justify-center border border-[var(--secondary)]/[0.2]">
                            <Wallet className="text-[var(--secondary)]" size={28} />
                        </div>
                        <div>
                            <h1 className="text-h2" style={{ fontSize: '2.2rem' }}>Fluxo de Caixa <span className="text-[var(--text-disabled)] font-light">Diário</span></h1>
                            <p className="text-[var(--text-secondary)] text-xs uppercase font-bold tracking-widest mt-1">Gestão de Liquidez e Disponibilidade</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[var(--bg-input)] p-1 rounded-sm border border-[var(--border-active)]">
                        <button className="p-2 hover:bg-white/5 transition-colors rounded-sm"><ChevronLeft size={16} /></button>
                        <span className="px-4 text-[10px] font-black uppercase">Janeiro 2026</span>
                        <button className="p-2 hover:bg-white/5 transition-colors rounded-sm"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card border-l-4 border-l-[var(--secondary)]">
                    <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-2">Entradas Hoje</p>
                    <h4 className="text-2xl font-serif text-[var(--secondary)]">R$ 12.450,00</h4>
                </div>
                <div className="card border-l-4 border-l-red-500">
                    <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-2">Saídas Hoje</p>
                    <h4 className="text-2xl font-serif text-red-500">R$ 8.120,00</h4>
                </div>
                <div className="card border-l-4 border-l-blue-500">
                    <p className="text-[9px] font-black text-[var(--text-disabled)] uppercase mb-2">Saldo do Dia</p>
                    <h4 className="text-2xl font-serif text-blue-500">+ R$ 4.330,00</h4>
                </div>
                <div className="card bg-[var(--primary)] border-none text-black">
                    <p className="text-[9px] font-black text-black/60 uppercase mb-2">Saldo Projetado</p>
                    <h4 className="text-2xl font-serif text-black">R$ 154.330,00</h4>
                </div>
            </div>

            {/* Table Area */}
            <div className="card !p-0 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-white/[0.01]">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Movimentação Detalhada</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" size={14} />
                            <input
                                className="bg-[var(--bg-input)] border border-[var(--border-active)] pl-10 pr-4 py-2 rounded-sm text-xs outline-none"
                                placeholder="Buscar lançamento..."
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-input)] text-[9px] uppercase font-black tracking-widest text-[var(--text-disabled)]">
                            <tr>
                                <th className="p-5">Data do Movimento</th>
                                <th className="p-5">Entradas (+)</th>
                                <th className="p-5">Saídas (-)</th>
                                <th className="p-5">Saldo do Dia</th>
                                <th className="p-5">Saldo Acumulado</th>
                                <th className="p-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                            {flowData.map((day, idx) => (
                                <tr key={day.date} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[var(--bg-input)] rounded-sm flex items-center justify-center text-[10px] font-bold border border-[var(--border-active)] group-hover:border-[var(--primary)] transition-colors">
                                                {day.date.split('-')[2]}
                                            </div>
                                            <span className="text-xs font-medium">{new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-xs text-green-500 font-serif">+ {day.inflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className="p-5 text-xs text-red-500 font-serif">- {day.outflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className={`p-5 text-xs font-serif ${day.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                        {day.balance >= 0 ? '+' : ''} {day.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-5 text-sm font-bold text-[var(--text-primary)] font-serif">
                                        R$ {day.accumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="text-[8px] font-black uppercase px-2 py-1 bg-green-500/10 text-green-500 rounded-sm">Conciliado</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Insight */}
            <div className="p-10 border border-dashed border-[var(--border-active)] rounded-sm bg-[var(--bg-card)] flex flex-col items-center text-center space-y-4">
                <CircleDollarSign size={40} className="text-[var(--primary)] opacity-40" />
                <div className="max-w-xl">
                    <h3 className="text-h3 mb-2">Ponto de Equilíbrio Atingido</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Sua projeção de fluxo de caixa indica que a disponibilidade financeira atual é suficiente para cobrir os próximos 45 dias de despesas fixas (Overhead). Nenhuma necessidade de captação externa prevista para o trimestre.
                    </p>
                </div>
            </div>
        </div>
    );
}
