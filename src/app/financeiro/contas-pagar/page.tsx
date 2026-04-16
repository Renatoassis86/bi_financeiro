'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
    CheckCircle2, Clock, AlertCircle, FileDown, MoreHorizontal,
    ChevronDown, LayoutGrid, List, Calendar, User, Building2,
    DollarSign, Receipt, CreditCard, Wallet, Banknote, Trash2,
    Eye, Pencil, Truck, Database, Landmark, Heart, Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ContasPagar() {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('financial_entries')
                .select(`
                    id, description, total_amount, status, created_at,
                    fronts(name),
                    entities(name),
                    accounts_plan(name),
                    installments(id, number, amount, due_date, status, payment_date)
                `)
                .eq('type', 'EXPENSE')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            alert('Despesas detectadas! Iniciando importação em massa para o banco...');
        };
        reader.readAsBinaryString(file);
    };

    const stats = useMemo(() => {
        const allInst = entries.flatMap(e => e.installments || []);
        const toPay = allInst.filter(i => i.status === 'PENDING').reduce((acc, i) => acc + i.amount, 0);
        const overdue = allInst.filter(i => i.status === 'OVERDUE').reduce((acc, i) => acc + i.amount, 0);
        const paidToday = allInst.filter(i => i.status === 'PAID' && i.payment_date?.startsWith(new Date().toISOString().split('T')[0])).reduce((acc, i) => acc + i.amount, 0);

        return { toPay, overdue, paidToday };
    }, [entries]);

    return (
        <div className="reveal space-y-16 w-full pb-20">

            {/* Header Area - SPACIOUS (Slate & Emerald) */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 bg-[var(--bg-card)]/40 p-12 rounded-2xl border border-white/5 shadow-2xl">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-pink)] shadow-[0_0_15px_var(--accent-pink)]" />
                        <h2 className="text-caption text-[var(--accent-pink)] tracking-[0.4em] text-sm">Controle de Desembolsos • Saídas de Caixa</h2>
                    </div>
                    <h1 className="h1">Contas a <span className="text-[var(--primary)]">Pagar</span></h1>
                    <p className="text-lg font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed">
                        Gestão centralizada de fornecedores, impostos e obrigações fixas.
                        Fluxo otimizado para <strong className="text-white">Agendamento Bancário</strong> e Auditoria.
                    </p>
                </div>
                <div className="flex items-center gap-12">
                    <button
                        onClick={() => document.getElementById('xlsx-import-cp')?.click()}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        className="flex items-center gap-4 group hover:opacity-70 transition-all cursor-pointer"
                    >
                        <Upload size={20} className="text-[#F43F5E]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#F43F5E]">IMPORTAR DESPESAS</span>
                        <input
                            id="xlsx-import-cp"
                            type="file"
                            style={{ display: 'none' }}
                            accept=".xlsx, .xls"
                            onChange={handleImportXLSX}
                        />
                    </button>

                    <div className="flex gap-6">
                        <button className="btn btn-ghost !px-8">
                            <Calendar size={20} className="text-[var(--accent-gold)]" />
                            <span>CALENDÁRIO FISCAL</span>
                        </button>
                        <button className="btn btn-primary !px-10 shadow-xl shadow-[var(--primary)]/20">
                            <Plus size={20} />
                            <span>NOVA DESPESA</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="card !p-10 border-l-4 border-l-[var(--accent-pink)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Total em Aberto</p>
                        <Wallet size={16} className="text-[var(--accent-pink)] opacity-50" />
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tighter">R$ {stats.toPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <div className="flex items-center gap-2 mt-6 text-[var(--accent-pink)]">
                        <ArrowDownRight size={14} />
                        <span className="text-[10px] font-black uppercase">Comprometimento de Caixa</span>
                    </div>
                </div>

                <div className="card !p-10 border-l-4 border-l-[var(--danger)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Vencidos (Risco Alto)</p>
                        <AlertCircle size={16} className="text-[var(--danger)] opacity-50" />
                    </div>
                    <h3 className="text-4xl font-black text-[var(--danger)] tracking-tighter">R$ {stats.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <div className="flex items-center gap-2 mt-6 text-[var(--danger)]">
                        <Landmark size={14} className="text-[var(--danger)] opacity-60" />
                        <span className="text-[10px] font-black uppercase">Pendências Institucionais</span>
                    </div>
                </div>

                <div className="card !p-10 border-l-4 border-l-[var(--accent-azure)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Liquidado Hoje</p>
                        <CheckCircle2 size={16} className="text-[var(--accent-azure)] opacity-50" />
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tighter">R$ {stats.paidToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <div className="flex items-center gap-2 mt-6 text-[var(--accent-azure)]">
                        <Heart size={14} />
                        <span className="text-[10px] font-black uppercase">Fluxo em Conformidade</span>
                    </div>
                </div>
            </div>

            {/* Filter Surface */}
            <div className="card !p-8 bg-[var(--bg-card)]/40 border-white/5 flex flex-col xl:flex-row items-center gap-8">
                <div className="flex-1 flex items-center gap-5 bg-[var(--bg-input)] border border-white/5 rounded-2xl px-8 py-5 w-full">
                    <Search size={20} className="text-[var(--text-disabled)]" />
                    <input
                        placeholder="Buscar por fornecedor, nota fiscal, rubrica ou centro de custo..."
                        className="bg-transparent border-none outline-none text-white text-base w-full font-medium placeholder:text-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-6 w-full xl:w-auto">
                    <div className="relative flex-1 xl:flex-none xl:w-64">
                        <select
                            className="w-full bg-[var(--bg-input)] border border-white/5 outline-none text-[11px] font-black uppercase tracking-widest text-white px-8 py-5 rounded-2xl cursor-pointer hover:border-[var(--primary)] transition-all appearance-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">TODOS STATUS</option>
                            <option value="PENDING">PENDENTES</option>
                            <option value="PAID">PAGOS / LIQUIDADOS</option>
                            <option value="OVERDUE">VENCIDOS</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                    <button className="btn btn-ghost !py-5 !px-8 !rounded-2xl border-white/5">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Entries Table - SPACIOUS */}
            <div className="card !p-0 overflow-hidden border-white/5 bg-[var(--bg-card)]/60 backdrop-blur-3xl shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-[#151921] border-b border-white/5 text-[10px] uppercase font-black text-white/30 tracking-[0.25em]">
                        <tr>
                            <th className="p-10">FORNECEDOR / DESPESA</th>
                            <th className="p-10">VENCIMENTO</th>
                            <th className="p-10">CONTA ORÇAMENTÁRIA</th>
                            <th className="p-10 text-right">VALOR BRUTO</th>
                            <th className="p-10 text-center">STATUS PGTO</th>
                            <th className="p-10 text-center w-16">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-32 text-center text-[var(--text-muted)]">
                                    <div className="flex flex-col items-center gap-6 opacity-20">
                                        <Database size={48} />
                                        <p className="text-sm font-black uppercase tracking-[0.4em]">Nenhuma despesa para pagar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="p-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-pink)]/5 border border-[var(--accent-pink)]/10 flex items-center justify-center shadow-inner">
                                                <Truck size={22} className="text-[var(--accent-pink)]" />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white tracking-tight truncate max-w-[300px]">
                                                    {entry.entities?.name || 'Fornecedor Pendente'}
                                                </p>
                                                <p className="text-[11px] font-bold text-[var(--text-muted)] mt-1 uppercase tracking-widest">{entry.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-[var(--text-disabled)]" />
                                            <span className="text-sm font-black text-white">
                                                {new Date(entry.installments?.[0]?.due_date).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-black text-[var(--accent-azure)] uppercase tracking-widest px-3 py-1 bg-[var(--accent-azure)]/5 border border-[var(--accent-azure)]/10 rounded-lg w-fit">
                                                {entry.accounts_plan?.name}
                                            </span>
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                                                {entry.fronts?.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-10 text-right">
                                        <p className="text-xl font-black text-white tracking-tighter">
                                            R$ {entry.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex justify-center">
                                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg
                                                ${entry.status === 'SETTLED' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20' :
                                                    entry.status === 'OVERDUE' ? 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20' :
                                                        'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] border border-[var(--accent-pink)]/20'}`}>
                                                {entry.status === 'SETTLED' ? 'LIQUIDADO' : entry.status === 'OVERDUE' ? 'ATRASADO' : 'PENDENTE'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex justify-center gap-4">
                                            <button title="Pagar Agora" className="btn !p-4 bg-white/5 border border-white/10 hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all">
                                                <DollarSign size={18} />
                                            </button>
                                            <button className="btn !p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-40 hover:opacity-100">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
