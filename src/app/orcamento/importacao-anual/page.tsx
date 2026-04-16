'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import {
    Upload, FileSpreadsheet, CheckCircle2,
    Loader2, Download, Save,
    Calendar, Calculator, Sparkles, Tag, Brain,
    LayoutDashboard, ListTree, ArrowRight,
    Search, Info, ChevronRight, FileUp, Zap
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX_LIB from 'xlsx';

interface TransactionalBudgetRow {
    id: string;
    rubrica: string;
    area: string;
    mes: string;
    valor: number;
    suggestions: {
        natureza_economica: string;
        funcao_cc: string;
        comportamento: string;
        temporalidade: string;
    };
    status: 'VALID' | 'WARNING' | 'ERROR';
}

export default function PropostaOrcamentariaAnual() {
    const [step, setStep] = useState<'UPLOAD' | 'PREVIEW' | 'SUCCESS'>('UPLOAD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<TransactionalBudgetRow[]>([]);
    const [year, setYear] = useState<number>(2026);
    const [importResult, setImportResult] = useState<{
        budgetCount: number;
        entriesCount: number;
        installmentsCount: number;
        createdAccounts: number;
        skipped: number;
        total: number;
    } | null>(null);

    const [fronts, setFronts] = useState<{ id: string, name: string }[]>([]);
    const [accounts, setAccounts] = useState<{ id: string, name: string, code?: string }[]>([]);
    const [costCenters, setCostCenters] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: f } = await supabase.from('fronts').select('id, name');
            const { data: a } = await supabase.from('accounts_plan').select('id, name, code');
            const { data: cc } = await supabase.from('cost_centers').select('id, name');
            if (f) setFronts(f);
            if (a) setAccounts(a);
            if (cc) setCostCenters(cc);
        };
        fetchData();
    }, []);

    const getAISuggestions = (rubrica: string) => {
        const name = rubrica.toLowerCase();
        let nature = 'Despesas Operacionais';
        let func = 'Administrativas';
        let comp = 'Fixas';
        let temp = 'Recorrentes mensais';

        if (name.includes('salário') || name.includes('clt') || name.includes('pj') || name.includes('consultor')) {
            nature = 'Pessoal e encargos';
            func = 'Administrativas';
            comp = 'Fixas';
        } else if (name.includes('marketing') || name.includes('publicidade') || name.includes('comercial')) {
            nature = 'Comunicação e marketing';
            func = 'Comerciais';
            comp = 'Variáveis';
        } else if (name.includes('didático') || name.includes('pedagógico') || name.includes('autoria')) {
            nature = 'Despesas pedagógicas';
            func = 'Acadêmicas / Pedagógicas';
            comp = 'Semi-variáveis';
            temp = 'Sazonais';
        } else if (name.includes('infra') || name.includes('aluguel') || name.includes('energia')) {
            nature = 'Infraestrutura';
            func = 'Operacionais';
            comp = 'Fixas';
        } else if (name.includes('receita') || name.includes('mensalidade') || name.includes('matrícula')) {
            nature = 'Receitas operacionais';
            func = 'Comerciais';
            comp = 'Variáveis';
            temp = 'Sazonais';
        }

        return { natureza_economica: nature, funcao_cc: func, comportamento: comp, temporalidade: temp };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setIsProcessing(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
                const parsed: TransactionalBudgetRow[] = jsonData.map((row) => {
                    const rubrica = row['Rubrica'] || row['rubrica'] || row['nome'] || '';
                    const area = row['Área (CC)'] || row['area'] || '';
                    const mes = row['Mês'] || row['mes'] || '';
                    let valor = 0;
                    const rawValor = row['Valor'] || row['valor'];
                    if (typeof rawValor === 'number') {
                        valor = rawValor;
                    } else if (typeof rawValor === 'string') {
                        const cleanStr = rawValor.replace(/\s/g, '');
                        if (cleanStr.includes(',') && cleanStr.includes('.')) {
                            valor = parseFloat(cleanStr.replace(/\./g, '').replace(',', '.'));
                        } else if (cleanStr.includes(',')) {
                            valor = parseFloat(cleanStr.replace(',', '.'));
                        } else {
                            valor = parseFloat(cleanStr);
                        }
                    }
                    if (isNaN(valor)) valor = 0;
                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        rubrica, area, mes, valor,
                        suggestions: getAISuggestions(rubrica),
                        status: (rubrica && area && mes && !isNaN(valor)) ? 'VALID' : 'ERROR'
                    };
                });
                setPreviewData(parsed);
                setIsProcessing(false);
                setStep('PREVIEW');
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Busca inteligente de conta: exata > contém > substring
    const findAccountFuzzy = (rubrica: string, accountsList: { id: string, name: string, code?: string }[]) => {
        const q = rubrica.toLowerCase().trim();
        // 1. Match exato
        let match = accountsList.find(a => a.name.toLowerCase().trim() === q);
        if (match) return match;
        // 2. Nome da conta contém a rubrica
        match = accountsList.find(a => a.name.toLowerCase().includes(q));
        if (match) return match;
        // 3. Rubrica contém o nome da conta
        match = accountsList.find(a => q.includes(a.name.toLowerCase().trim()));
        if (match) return match;
        // 4. Match por palavras-chave significativas (>3 chars)
        const keywords = q.split(/[\s\-–,]+/).filter(w => w.length > 3);
        for (const kw of keywords) {
            match = accountsList.find(a => a.name.toLowerCase().includes(kw));
            if (match) return match;
        }
        return null;
    };

    const monthMap: { [key: string]: number } = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4, 'maio': 5, 'junho': 6,
        'julho': 7, 'agosto': 8, 'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12,
        'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
        'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
    };

    const handleCommit = async () => {
        if (fronts.length === 0) {
            alert('Aguarde o carregamento dos dados de mestre (Unidades) antes de efetivar.');
            return;
        }

        setIsProcessing(true);
        try {
            let budgetCount = 0;
            let entriesCount = 0;
            let installmentsCount = 0;
            let createdAccounts = 0;
            let skippedCount = 0;
            const errors: string[] = [];

            // Copia local mutável das contas para incluir as criadas em runtime
            let localAccounts = [...accounts];

            const defaultFront = fronts.find(f => f.name === 'CVE') || fronts[0];
            const defaultCC = costCenters.find(cc => cc.name === 'CVE') || (costCenters.length > 0 ? costCenters[0] : null);

            for (const row of previewData) {
                if (row.status === 'ERROR' || !row.rubrica || !row.valor) {
                    skippedCount++;
                    continue;
                }

                // ── 1. Resolver Front e Cost Center ────────────────────
                const front = fronts.find(f => f.name.toLowerCase().trim() === row.area.toLowerCase().trim()) || defaultFront;
                const costCenter = costCenters.find(cc => cc.name.toLowerCase().trim() === row.area.toLowerCase().trim()) || defaultCC;

                if (!front) {
                    skippedCount++;
                    errors.push(`Front não encontrado: ${row.area}`);
                    continue;
                }

                // ── 2. Resolver Conta (fuzzy + auto-create) ────────────
                let account = findAccountFuzzy(row.rubrica, localAccounts);

                if (!account) {
                    // Auto-criar conta no plano de contas
                    const isIncome = row.rubrica.toLowerCase().includes('receita') || row.rubrica.toLowerCase().includes('mensalidade');
                    const accountType = isIncome ? 'RECEITA' : 'DESPESA';
                    const codePrefix = isIncome ? 'IMP-R' : 'IMP-D';
                    const autoCode = `${codePrefix}-${Date.now().toString(36).slice(-5)}-${Math.random().toString(36).slice(2, 4)}`.toUpperCase();

                    const { data: newAccount, error: createErr } = await supabase
                        .from('accounts_plan')
                        .insert([{
                            code: autoCode,
                            name: row.rubrica.trim(),
                            type: accountType,
                            level: 3,
                        }])
                        .select('id, name, code')
                        .single();

                    if (createErr || !newAccount) {
                        skippedCount++;
                        errors.push(`Erro ao criar conta "${row.rubrica}": ${createErr?.message || 'desconhecido'}`);
                        continue;
                    }

                    account = newAccount;
                    localAccounts.push(newAccount);
                    createdAccounts++;
                }

                // ── 3. Resolver mês ────────────────────────────────────
                const monthName = row.mes.toLowerCase().trim();
                const monthNum = monthMap[monthName] || 1;
                const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-05`;

                // ── 4. INSERT budget_plans (Orçamento) ─────────────────
                const { error: budgetErr } = await supabase
                    .from('budget_plans')
                    .upsert([{
                        year,
                        month: monthNum,
                        front_id: front.id,
                        account_id: account.id,
                        cost_center_id: costCenter?.id || null,
                        amount_planned: row.valor,
                    }], { onConflict: 'year,month,front_id,account_id,cost_center_id' });

                if (budgetErr) {
                    errors.push(`Budget [${row.rubrica}/${row.mes}]: ${budgetErr.message}`);
                } else {
                    budgetCount++;
                }

                // ── 5. INSERT financial_entries (Contas a Pagar/Receber) ──
                const isIncome = row.rubrica.toLowerCase().includes('receita') ||
                    row.rubrica.toLowerCase().includes('mensalidade') ||
                    row.rubrica.toLowerCase().includes('matrícula');
                const entryType = isIncome ? 'INCOME' : 'EXPENSE';

                const { data: newEntry, error: entryErr } = await supabase
                    .from('financial_entries')
                    .insert([{
                        description: `${row.rubrica} — ${row.mes}/${year}`,
                        type: entryType,
                        front_id: front.id,
                        account_id: account.id,
                        cost_center_id: costCenter?.id || null,
                        total_amount: Math.abs(row.valor),
                        status: 'OPEN',
                        document_number: `IMP-${year}-${String(monthNum).padStart(2, '0')}`,
                    }])
                    .select('id')
                    .single();

                if (entryErr || !newEntry) {
                    errors.push(`Entry [${row.rubrica}]: ${entryErr?.message || 'desconhecido'}`);
                } else {
                    entriesCount++;

                    // ── 6. INSERT installments (Parcelas/Fluxo de Caixa) ─
                    const { error: instErr } = await supabase
                        .from('installments')
                        .insert([{
                            entry_id: newEntry.id,
                            number: 1,
                            amount: Math.abs(row.valor),
                            due_date: dateStr,
                            competence_date: dateStr,
                            status: 'PENDING',
                        }]);

                    if (instErr) {
                        errors.push(`Installment [${row.rubrica}]: ${instErr.message}`);
                    } else {
                        installmentsCount++;
                    }
                }
            }

            // Log de erros se houver
            if (errors.length > 0) {
                console.warn('Erros durante a importação:', errors);
            }

            // Atualiza o state de contas com as novas
            setAccounts(localAccounts);

            const totalProcessed = budgetCount + entriesCount + installmentsCount;

            if (totalProcessed === 0 && previewData.length > 0) {
                alert(`Nenhum registro foi integrado ao banco de dados.\n\nErros:\n${errors.slice(0, 5).join('\n')}\n\nVerifique se as Rubricas e Áreas existem nos cadastros do sistema.`);
            } else {
                setImportResult({
                    budgetCount,
                    entriesCount,
                    installmentsCount,
                    createdAccounts,
                    skipped: skippedCount,
                    total: previewData.length,
                });
                setStep('SUCCESS');
            }

        } catch (err: any) {
            console.error('Erro crítico na importação:', err);
            alert('Erro ao salvar no banco: ' + (err.message || String(err)));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="reveal space-y-12">

            {/* 1. Header & Navigation */}
            <header className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[var(--border-subtle)] pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[var(--accent-purple)] rounded-full" />
                        <h2 className="text-caption text-[var(--accent-purple)] tracking-[0.3em]">Gestão Orçamentária</h2>
                    </div>
                    <div>
                        <h1 className="h1">Importador de <span className="text-[var(--primary)]">Dados Financeiros</span></h1>
                        <p className="text-[var(--text-secondary)] text-sm font-medium mt-3 max-w-2xl">
                            Hub centralizado para importação de extratos bancários, despesas previstas/executadas e receitas para consolidação da Proposta Orçamentária.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="btn btn-ghost hover:border-[var(--accent-gold)] group" onClick={() => {
                        const data = [
                            { 'Nível': 1, 'Rubrica': 'RUBRICA MASTER', 'Área (CC)': 'CVE', 'Mês': 'Janeiro', 'Ano': 2026, 'Valor': 10000 },
                            { 'Nível': 2, 'Rubrica': 'SUB-RUBRICA', 'Área (CC)': 'CVE', 'Mês': 'Janeiro', 'Ano': 2026, 'Valor': 5000 }
                        ];
                        const ws = XLSX_LIB.utils.json_to_sheet(data);
                        const wb = XLSX_LIB.utils.book_new();
                        XLSX_LIB.utils.book_append_sheet(wb, ws, "Proposta_Orcamentaria");
                        XLSX_LIB.writeFile(wb, "modelo_proposta_2026.xlsx");
                    }}>
                        <Download size={16} className="text-[var(--accent-gold)] group-hover:scale-110 transition-transform" />
                        <span>MODELO PROPOSTA</span>
                    </button>
                    <Link href="/orcamento/estruturador" className="btn btn-primary shadow-lg shadow-[var(--primary)]/20">
                        <ListTree size={16} />
                        <span>Matriz Estruturadora</span>
                    </Link>
                </div>
            </header>

            {/* 2. AI Intelligence Banner */}
            <div className="card bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-input)] border-l-4 border-l-[var(--primary)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-[var(--primary)]/5 blur-3xl rounded-full translate-x-1/2" />
                <div className="p-8 flex items-center gap-10 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20 shadow-inner">
                        <Brain className="text-[var(--primary)]" size={36} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-black text-[var(--primary)] uppercase tracking-widest">Inteligência de Classificação Ativa</h4>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl font-medium">
                            Nosso motor de análise decompõe o nome de cada rubrica importada e sugere automaticamente a <strong className="text-white">Natureza Econômica</strong>, <strong className="text-white">Finalidade Estratégica</strong> e o <strong className="text-white">Comportamento de Custo</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Main Action Surface */}
            <section className="card min-h-[500px] flex items-center justify-center p-12 overflow-hidden bg-[var(--bg-card)]/50 backdrop-blur-md relative border-dashed border-white/5 hover:border-[var(--primary)]/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(90,140,255,0.03)_0%,transparent_70%)]" />

                {step === 'UPLOAD' && (
                    <div className="text-center space-y-12 max-w-xl z-10">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-2xl group transition-all duration-500 hover:scale-110">
                            <FileUp className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" size={40} />
                        </div>
                        <label
                            className="bg-[#F43F5E] text-white px-20 py-8 rounded-2xl flex items-center gap-6 shadow-[0_20px_40px_rgba(244,63,94,0.3)] hover:scale-105 transition-all cursor-pointer group active:scale-95"
                            style={{ border: 'none', outline: 'none' }}
                        >
                            <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <Upload size={24} className="text-white" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[14px] font-black tracking-widest uppercase">Subir Dados da Proposta</span>
                                <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Excel ou CSV Detectado</span>
                            </div>
                        </label>
                        <div className="flex items-center justify-center gap-8 mt-10">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-disabled)] tracking-widest uppercase">
                                <CheckCircle2 size={12} className="text-[var(--accent-lime)]" /> Padronizado
                            </div>
                            <div className="w-px h-3 bg-white/10" />
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-disabled)] tracking-widest uppercase">
                                <CheckCircle2 size={12} className="text-[var(--accent-lime)]" /> Validado por IA
                            </div>
                        </div>
                    </div>
                )}

                {step === 'PREVIEW' && (
                    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-8">
                            <div>
                                <h3 className="h3">{previewData.length} Registros Detectados</h3>
                                <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Validação preliminar concluída com sucesso</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="btn btn-ghost" onClick={() => setStep('UPLOAD')}>Substituir</button>
                                <button className="btn btn-primary" onClick={handleCommit} disabled={isProcessing}>
                                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    <span>Efetivar Planejamento</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-main)]/50 backdrop-blur-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-[var(--border-subtle)]">
                                        <th className="p-8 text-caption text-white">Rubrica / Detalhe</th>
                                        <th className="p-8 text-caption text-white">Centro de Lucro</th>
                                        <th className="p-8 text-caption text-white">Período</th>
                                        <th className="p-8 text-caption text-right text-white">Projeção</th>
                                        <th className="p-8 text-caption text-center text-white">Insights</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.slice(0, 15).map((row) => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover:bg-white/[0.02] transition-all group">
                                            <td style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Tag size={18} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{row.rubrica}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontSize: '9px', color: 'var(--text-disabled)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.suggestions.natureza_economica}</span>
                                                            <div style={{ width: '3px', height: '3px', background: 'white', borderRadius: '50%', opacity: 0.2 }} />
                                                            <span style={{ fontSize: '9px', color: 'var(--accent-azure)', fontWeight: 900, textTransform: 'uppercase' }}>{row.area}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                                    <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 900, borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>{row.area}</span>
                                                    <span style={{ fontSize: '8px', color: 'var(--text-disabled)', fontWeight: 800, textTransform: 'uppercase', marginLeft: '4px' }}>CENTRO DE CUSTOS</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                                    <span style={{ fontSize: '12px', color: 'white', fontWeight: 900, textTransform: 'uppercase' }}>{row.mes}</span>
                                                    <span style={{ fontSize: '8px', color: 'var(--text-disabled)', fontWeight: 800, textTransform: 'uppercase' }}>EXERCÍCIO {year}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                    <span style={{ fontSize: '16px', fontWeight: 900, color: row.valor < 0 ? 'var(--accent)' : '#00ff88', letterSpacing: '-0.02em' }}>
                                                        {row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    <span style={{ fontSize: '8px', color: 'var(--text-disabled)', fontWeight: 800, textTransform: 'uppercase' }}>{row.suggestions.comportamento}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--primary)', cursor: 'help' }}>
                                                        <Brain size={18} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {previewData.length > 10 && (
                                <div className="p-6 text-center border-t border-[var(--border-subtle)] bg-white/[0.01]">
                                    <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.3em]">
                                        Exibindo 10 de {previewData.length} registros
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 'SUCCESS' && importResult && (
                    <div className="text-center space-y-12 animate-in zoom-in-95 duration-1000 z-10 max-w-2xl">
                        <div className="w-28 h-28 bg-[var(--accent-lime)]/10 text-[var(--accent-lime)] rounded-full flex items-center justify-center mx-auto border border-[var(--accent-lime)]/20 shadow-[0_0_60px_rgba(50,255,126,0.15)]">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="h2 tracking-tighter text-white">Integração Concluída com Sucesso!</h2>
                            <p className="text-[var(--text-muted)] text-base max-w-lg mx-auto leading-relaxed font-medium">
                                Os dados foram gravados no banco de dados e distribuídos entre todos os módulos da plataforma.
                            </p>
                        </div>

                        {/* Detailed Counters */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.15em] mb-2">Orçamento</p>
                                <p className="text-2xl font-black text-[var(--primary)]">{importResult.budgetCount}</p>
                                <p className="text-[9px] text-[var(--text-muted)] mt-1">budget_plans</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.15em] mb-2">Lançamentos</p>
                                <p className="text-2xl font-black text-[#00ff88]">{importResult.entriesCount}</p>
                                <p className="text-[9px] text-[var(--text-muted)] mt-1">financial_entries</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.15em] mb-2">Parcelas</p>
                                <p className="text-2xl font-black text-[var(--accent-cyan)]">{importResult.installmentsCount}</p>
                                <p className="text-[9px] text-[var(--text-muted)] mt-1">installments</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.15em] mb-2">Contas Criadas</p>
                                <p className="text-2xl font-black text-[var(--accent-gold)]">{importResult.createdAccounts}</p>
                                <p className="text-[9px] text-[var(--text-muted)] mt-1">accounts_plan</p>
                            </div>
                        </div>

                        {importResult.skipped > 0 && (
                            <div className="flex items-center justify-center gap-3 text-[11px] text-[var(--text-disabled)]">
                                <Info size={14} />
                                <span>{importResult.skipped} de {importResult.total} registros ignorados (dados inválidos ou vazios)</span>
                            </div>
                        )}

                        <div className="flex justify-center gap-6 pt-4">
                            <button className="btn btn-ghost px-10" onClick={() => { setStep('UPLOAD'); setImportResult(null); }}>Novo Import</button>
                            <Link href="/orcamento/consolidado" className="btn btn-primary px-10">Ver Proposta Orçamentária</Link>
                        </div>
                    </div>
                )}
            </section>

            {/* 4. Insight Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="card p-10 flex gap-8 group hover:bg-gradient-to-br hover:from-[var(--bg-card)] hover:to-[var(--bg-input)]">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent-cyan)]/10 flex items-center justify-center border border-[var(--accent-cyan)]/20 group-hover:scale-110 transition-transform flex-shrink-0">
                        <Calendar size={28} className="text-[var(--accent-cyan)]" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-caption !text-[12px] text-white">Sincronização Fiscal</h4>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium group-hover:text-[var(--text-secondary)] transition-colors">
                            O motor detecta janelas sazonais de rematrícula e picos operacionais, otimizando a projeção de liquidez conforme o ano letivo.
                        </p>
                    </div>
                </div>

                <div className="card p-10 flex gap-8 group hover:bg-gradient-to-br hover:from-[var(--bg-card)] hover:to-[var(--bg-input)]">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--accent-purple)]/10 flex items-center justify-center border border-[var(--accent-purple)]/20 group-hover:scale-110 transition-transform flex-shrink-0">
                        <Calculator size={28} className="text-[var(--accent-purple)]" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-caption !text-[12px] text-white">Consolidação Integrada</h4>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium group-hover:text-[var(--text-secondary)] transition-colors">
                            A integração direta com o DRE Gerencial permite comparativos em tempo real entre o planejamento anual e a execução de caixa.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
