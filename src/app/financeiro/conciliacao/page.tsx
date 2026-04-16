'use client';

import { useState } from 'react';
import {
    Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
    CheckCircle2, Clock, AlertCircle, FileDown, MoreHorizontal,
    ChevronDown, LayoutGrid, List, Calendar, User, Building2,
    DollarSign, Receipt, CreditCard, Wallet, Banknote, Upload,
    Check, X, RefreshCw, FileText, Link2, Link2Off, Landmark,
    ShieldCheck, Calculator, ArrowRightLeft, Database
} from 'lucide-react';

interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'IN' | 'OUT';
    status: 'PENDENTE' | 'CONCILIADO' | 'DIVERGENTE';
    matchedWith?: {
        id: string;
        description: string;
        date: string;
    };
}

export default function Conciliacao() {
    const [isImporting, setIsImporting] = useState(false);
    const [transactions, setTransactions] = useState<BankTransaction[]>([
        {
            id: '1', date: '2026-02-14', description: 'PIX RECEBIDO - PAIDEIA CURSOS',
            amount: 450.00, type: 'IN', status: 'PENDENTE'
        },
        {
            id: '2', date: '2026-02-14', description: 'PGTO BOLETO - ENERGIA ELETRICA',
            amount: -1250.00, type: 'OUT', status: 'DIVERGENTE'
        },
        {
            id: '3', date: '2026-02-13', description: 'TRANSFERENCIA - RENATO ASSIS',
            amount: -6000.00, type: 'OUT', status: 'CONCILIADO',
            matchedWith: { id: 'ERP-992', description: 'Recibo Honorários #88', date: '2026-02-13' }
        },
        {
            id: '4', date: '2026-02-13', description: 'RECEBIMENTO MENSALIDADE - ANA CLARA',
            amount: 890.00, type: 'IN', status: 'PENDENTE'
        },
    ]);

    return (
        <div className="reveal space-y-16 w-full pb-20">

            {/* Header Area - SPACIOUS (Slate & Emerald) */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 bg-[var(--bg-card)]/40 p-12 rounded-2xl border border-white/5 shadow-2xl">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_15px_var(--primary)]" />
                        <h2 className="text-caption text-[var(--primary)] tracking-[0.4em] text-sm">FinOps Intelligence • Audit Ready</h2>
                    </div>
                    <h1 className="h1">Conciliação <span className="text-[var(--primary)]">Bancária</span></h1>
                    <p className="text-lg font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed">
                        Sistema automatizado para cruzamento de extratos bancários (OFX/CSV) com lançamentos de Contas a Pagar e Receber.
                        Garantia de <strong className="text-white">Compliance e Integridade de Caixa</strong>.
                    </p>
                </div>
                <div className="flex gap-6">
                    <button className="btn btn-ghost !px-8">
                        <FileText size={20} className="text-[var(--accent-azure)]" />
                        <span>RELATÓRIO DE AUDIT</span>
                    </button>
                    <button
                        onClick={() => setIsImporting(true)}
                        className="btn btn-primary !px-10 shadow-xl shadow-[var(--primary)]/20"
                    >
                        <Upload size={20} />
                        <span>IMPORTAR EXTRATO</span>
                    </button>
                </div>
            </header>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="card !p-10 border-l-4 border-l-[var(--accent-azure)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest mb-3">Saldo em Aberto (ERP)</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter">R$ 42.180,50</h3>
                    <div className="flex items-center gap-2 mt-4 text-[var(--accent-azure)]">
                        <Database size={14} />
                        <span className="text-[10px] font-black uppercase">Pendente de Baixa</span>
                    </div>
                </div>
                <div className="card !p-10 border-l-4 border-l-[var(--primary)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest mb-3">Conciliado (Bancos)</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter">R$ 1.248.391,00</h3>
                    <div className="flex items-center gap-2 mt-4 text-[var(--primary)]">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black uppercase">Integridade Verificada</span>
                    </div>
                </div>
                <div className="card !p-10 border-l-4 border-l-[var(--danger)] bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B]">
                    <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest mb-3">Divergências Gritantes</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter">R$ (1.250,00)</h3>
                    <div className="flex items-center gap-2 mt-4 text-[var(--danger)]">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase">Ação Imediata Necessária</span>
                    </div>
                </div>
            </div>

            {/* Main Reconciliation Surface */}
            <div className="grid grid-cols-1 gap-12">
                <div className="card !p-0 overflow-hidden border-white/5 bg-[var(--bg-card)]/60 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">

                    {/* Toolbar / Filters */}
                    <div className="bg-[#1D222B] p-10 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20 shadow-inner">
                                    <Landmark size={22} className="text-[var(--primary)]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Extrato Bancário Consolidador</h3>
                                    <p className="text-xs text-[var(--text-disabled)] mt-1 font-medium italic">Agencia: 0123 • Conta: 12345-6 • ITAÚ UNIBANCO</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 items-center w-full xl:w-auto">
                            <div className="relative flex-1 xl:flex-none xl:w-80">
                                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" />
                                <input
                                    placeholder="Filtrar por descrição ou valor..."
                                    className="w-full bg-[var(--bg-input)] border border-white/5 px-14 py-4 rounded-xl text-sm outline-none focus:border-[var(--primary)] transition-all"
                                />
                            </div>
                            <button className="btn btn-ghost !py-4 border-white/10">
                                <Filter size={18} />
                                <span>FILTRAR PERÍODO</span>
                            </button>
                        </div>
                    </div>

                    {/* Table View (New Spacious Style) */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#151921] text-[10px] uppercase font-black text-white/30 tracking-[0.25em]">
                                <tr>
                                    <th className="p-10 w-32">DATA</th>
                                    <th className="p-10">REGISTRO BANCÁRIO</th>
                                    <th className="p-10 text-right w-48">VALOR (R$)</th>
                                    <th className="p-10 text-center w-[400px]">INTELIGÊNCIA DE CONCILIAÇÃO</th>
                                    <th className="p-10 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="p-10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-white">{t.date.split('-')[1]}/{t.date.split('-')[2]}</span>
                                                <span className="text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-widest">FY26</span>
                                            </div>
                                        </td>
                                        <td className="p-10">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${t.type === 'IN' ? 'bg-[var(--primary)]' : 'bg-[var(--accent-slate)]'}`} />
                                                    <span className="text-base font-black text-white uppercase tracking-tight truncate max-w-[350px]">
                                                        {t.description}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 ml-5">
                                                    <span className="text-[9px] font-black text-[var(--text-disabled)] uppercase tracking-widest">DOC REF:</span>
                                                    <span className="text-[10px] font-bold text-white/40">BTX-{t.id}-0226</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-10 text-right">
                                            <span className={`text-xl font-black tracking-tighter ${t.type === 'IN' ? 'text-[var(--primary)]' : 'text-white'}`}>
                                                {t.type === 'IN' ? '+' : ''} R$ {Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="p-10">
                                            <div className="flex justify-center">
                                                {t.status === 'CONCILIADO' ? (
                                                    <div className="flex items-center gap-5 bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-5 rounded-2xl w-full max-w-[350px]">
                                                        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-md">
                                                            <Link2 size={18} className="text-[var(--primary)]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-black text-white truncate uppercase">{t.matchedWith?.description}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <ShieldCheck size={12} className="text-[var(--primary)]" />
                                                                <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">Audit Verified</span>
                                                            </div>
                                                        </div>
                                                        <button title="Desvincular" className="p-2 text-white/10 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-all">
                                                            <Link2Off size={16} />
                                                        </button>
                                                    </div>
                                                ) : t.status === 'DIVERGENTE' ? (
                                                    <div className="flex items-center gap-5 bg-[var(--danger)]/5 border border-[var(--danger)]/20 p-5 rounded-2xl w-full max-w-[350px] animate-pulse">
                                                        <div className="w-10 h-10 rounded-xl bg-[var(--danger)]/10 flex items-center justify-center border border-[var(--danger)]/20 shadow-md">
                                                            <AlertCircle size={18} className="text-[var(--danger)]" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-black text-white uppercase tracking-tight">Valor Divergente</p>
                                                            <p className="text-[9px] font-bold text-[var(--danger)] uppercase tracking-widest mt-1 opacity-80">Check Manual Entries</p>
                                                        </div>
                                                        <button className="px-4 py-2 bg-[var(--danger)] text-white text-[9px] font-black uppercase rounded-lg shadow-lg">CORRIGIR</button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-5 bg-white/[0.02] border border-dashed border-white/10 p-5 rounded-2xl w-full max-w-[350px] group/match hover:border-[var(--primary)]/50 transition-all">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                                            <RefreshCw size={16} className="text-white/20 group-hover/match:animate-spin" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover/match:text-white/40 transition-colors">Aguardando Lançamento...</span>
                                                        </div>
                                                        <button className="btn !p-3 bg-white/5 border border-white/10 hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all">
                                                            <ArrowRightLeft size={16} className="text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-10">
                                            <button className="opacity-10 group-hover:opacity-100 p-3 hover:bg-white/5 rounded-xl transition-all">
                                                <MoreHorizontal size={20} className="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="p-10 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
                        <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-widest">Transações Analisadas: {transactions.length} | Audit Logs: 100% OK</p>
                        <div className="flex gap-4">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${p === 1 ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tactical Actions HUD - RESTORED & CORRECTED */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="card !p-12 border-dashed bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B] flex flex-col lg:flex-row gap-10 items-center group cursor-pointer hover:border-[var(--primary)]/40 transition-all">
                        <div className="w-20 h-20 rounded-3xl bg-[var(--accent-azure)]/10 flex items-center justify-center border border-[var(--accent-azure)]/20 group-hover:scale-110 transition-transform shadow-2xl">
                            <Database size={32} className="text-[var(--accent-azure)]" />
                        </div>
                        <div className="flex-1 text-center lg:text-left space-y-3">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Vincular Lançamentos Pendentes</h4>
                            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                                Identificamos <strong className="text-white">12 registros no ERP</strong> que podem corresponder a este período bancário. Realize a conciliação assistida.
                            </p>
                        </div>
                        <button className="btn btn-primary !px-10 !text-[10px] !rounded-xl group-hover:shadow-[0_0_30px_var(--primary)] transition-all">
                            ABRIR VÍNCULOS
                        </button>
                    </div>

                    <div className="card !p-12 border-dashed bg-gradient-to-br from-[var(--bg-card)] to-[#1D222B] flex flex-col lg:flex-row gap-10 items-center group cursor-pointer hover:border-[var(--accent-gold)]/40 transition-all">
                        <div className="w-20 h-20 rounded-3xl bg-[var(--accent-gold)]/10 flex items-center justify-center border border-[var(--accent-gold)]/20 group-hover:scale-110 transition-transform shadow-2xl">
                            <Calculator size={32} className="text-[var(--accent-gold)]" />
                        </div>
                        <div className="flex-1 text-center lg:text-left space-y-3">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Audit Checklist Report</h4>
                            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                                Foram detectadas <strong className="text-white">3 movimentações atípicas</strong> sem NF-e vinculada. Gere o relatório de divergência institucional.
                            </p>
                        </div>
                        <button className="btn btn-ghost !px-10 !text-[10px] !rounded-xl border-white/5 group-hover:bg-white/10 transition-all">
                            GERAR RELATÓRIO
                        </button>
                    </div>
                </div>
            </div>

            {/* IMPORT MODAL MOCK */}
            {isImporting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-10">
                    <div className="card w-full max-w-2xl !p-16 space-y-10 relative">
                        <button
                            onClick={() => setIsImporting(false)}
                            className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto border border-[var(--primary)]/20 shadow-xl">
                                <Upload size={32} className="text-[var(--primary)]" />
                            </div>
                            <h2 className="h3">Importar Extrato Bancário</h2>
                            <p className="text-[var(--text-muted)] font-medium">Selecione o arquivo exportado do seu banco (OFX, CSV ou XLS).</p>
                        </div>
                        <div className="border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center gap-6 bg-white/[0.02] hover:border-[var(--primary)]/40 transition-all cursor-pointer group">
                            <Database size={48} className="text-white/10 group-hover:text-[var(--primary)] transition-colors" />
                            <p className="text-sm font-black text-white/30 uppercase tracking-[0.25em] group-hover:text-white transition-colors">Arraste o arquivo aqui</p>
                            <button className="btn btn-ghost !py-3 !px-8 !text-[10px] !rounded-xl">PROCURAR ARQUIVO</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
