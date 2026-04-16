'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Upload,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Download,
    Trash2,
    Save,
    Database,
    Terminal,
    Loader2,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    CreditCard,
    Building2,
    X,
    Check,
    Calendar,
    ArrowRightLeft,
    Info
} from 'lucide-react';
import Link from 'next/link';

// --- TYPES ---

type ImportStep = 'UPLOAD' | 'CONFIG' | 'PREVIEW' | 'SUCCESS';

interface RevenueRow {
    id: number;
    competencia: string;
    caixa: string;
    descricao: string;
    rubrica: string;
    centroCusto: string;
    valor: number;
    status: 'VALID' | 'INVALID';
    errors?: string[];
}

export default function ImportacaoReceitasPage() {
    const [step, setStep] = useState<ImportStep>('UPLOAD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- DATA ---
    const [previewData, setPreviewData] = useState<RevenueRow[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setIsProcessing(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split(/\r?\n/);

                const parsedData: RevenueRow[] = lines.slice(1)
                    .filter(line => line.trim() !== '')
                    .map((line, idx) => {
                        const cols = line.split(';');
                        return {
                            id: idx + 1,
                            competencia: cols[0]?.trim() || '',
                            caixa: cols[1]?.trim() || '',
                            descricao: cols[2]?.trim() || '',
                            rubrica: cols[3]?.trim() || '',
                            centroCusto: cols[4]?.trim() || '',
                            valor: parseFloat(cols[5]?.replace('.', '').replace(',', '.') || '0'),
                            status: cols[0] && cols[5] ? 'VALID' : 'INVALID',
                            errors: (!cols[0] || !cols[5]) ? ['Campos obrigatórios ausentes'] : []
                        };
                    });

                setPreviewData(parsedData);
                setIsProcessing(false);
                setStep('CONFIG');
            };
            reader.readAsText(file);
        }
    };

    const handleCommit = async () => {
        setIsProcessing(true);
        try {
            // 1. Fetch reference data
            const { data: fronts } = await supabase.from('fronts').select('id, name');
            const { data: accounts } = await supabase.from('accounts_plan').select('id, name');
            const { data: costCenters } = await supabase.from('cost_centers').select('id, name');

            // 2. Prepare entries
            const validRows = previewData.filter(r => r.status === 'VALID');

            for (const row of validRows) {
                const frontId = fronts?.find(f => f.name.includes(row.centroCusto))?.id;
                const accountId = accounts?.find(a => a.name === row.rubrica)?.id;
                const ccId = costCenters?.find(cc => cc.name === row.centroCusto)?.id;

                // Create Entry
                const { data: entry, error: entryErr } = await supabase
                    .from('financial_entries')
                    .insert({
                        description: row.descricao,
                        type: 'INCOME',
                        front_id: frontId,
                        account_id: accountId,
                        cost_center_id: ccId,
                        total_amount: row.valor,
                        status: 'RECEIVED'
                    })
                    .select()
                    .single();

                if (entryErr) throw entryErr;

                // Create Installment
                const { error: instErr } = await supabase
                    .from('installments')
                    .insert({
                        entry_id: entry.id,
                        number: 1,
                        amount: row.valor,
                        due_date: new Date(row.caixa.split('/').reverse().join('-')),
                        competence_date: new Date(row.competencia.split('/').reverse().join('-') + '-01'),
                        status: 'PAID',
                        payment_date: new Date(row.caixa.split('/').reverse().join('-'))
                    });

                if (instErr) throw instErr;
            }

            setStep('SUCCESS');
        } catch (err) {
            console.error('Error:', err);
            alert('Falha ao sincronizar com o banco de dados.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "Competência;Data de Caixa;Descrição;Rubrica;Centro de Custo;Valor\n";
        const rows = [
            "02/2026;13/02/2026;Mensalidade Fev;Receitas PAIDEIA;PAIDEIA;1250,00",
            "02/2026;14/02/2026;Venda Livro;Receitas BIBLOS;BIBLOS;85,00"
        ].join("\n");
        const bom = "\uFEFF";
        const blob = new Blob([bom + headers + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "modelo_importacao_receitas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal">

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-active)'
            }}>
                <div>
                    <h1 className="text-h1" style={{ fontSize: '3rem' }}>
                        Importação <span style={{ color: 'var(--text-primary)' }}>Integrada</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Processamento de receitas com distinção automática entre Regime de Caixa e Competência
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn btn-ghost" onClick={downloadTemplate}>
                        <Download size={16} /> DOWNLOAD TEMPLATE
                    </button>
                    <Link href="/receitas" className="btn btn-ghost" style={{ border: '1px solid var(--border-subtle)' }}>
                        CANCELAR
                    </Link>
                </div>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginBottom: '10px' }}>
                <StepItem active={step === 'UPLOAD'} completed={['CONFIG', 'PREVIEW', 'SUCCESS'].includes(step)} icon={<Upload size={18} />} label="Upload" />
                <StepItem active={step === 'CONFIG'} completed={['PREVIEW', 'SUCCESS'].includes(step)} icon={<ArrowRightLeft size={18} />} label="Configuração" />
                <StepItem active={step === 'PREVIEW'} completed={['SUCCESS'].includes(step)} icon={<ShieldCheck size={18} />} label="Validação" />
            </div>

            {/* Content Logic */}
            {step === 'UPLOAD' && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        height: '400px', border: '1px dashed var(--border-active)', borderRadius: '2px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: 'rgba(255,255,255,0.01)', transition: 'all 0.3s'
                    }}
                    className="hover:border-var(--primary) hover:bg-white/[0.03]"
                >
                    {isProcessing ? (
                        <div style={{ textAlign: 'center' }}>
                            <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
                            <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>Auditando arquivo...</h3>
                        </div>
                    ) : (
                        <>
                            <div style={iconCircleStyle}>
                                <FileSpreadsheet size={32} color="var(--primary)" />
                            </div>
                            <h3 className="text-h2" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Selecione o Fluxo de Entrada</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Suporta Caixa e Competência no mesmo arquivo</p>
                            <button className="btn btn-primary" style={{ padding: '16px 40px' }}>CARREGAR PLANILHA PADRÃO</button>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
            )}

            {step === 'CONFIG' && (
                <div className="card" style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                        <div style={iconCircleStyleSmall}><Database size={18} color="var(--primary)" /></div>
                        <div>
                            <h3 className="text-h2" style={{ fontSize: '1.4rem' }}>Definindo Regras de Importação</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                O sistema identificou <strong>{previewData.length} registros</strong>. Confirme as colunas abaixo:
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <MappingRow label="DATA DE COMPETÊNCIA" system="competencia_mes" />
                            <MappingRow label="DATA DE CAIXA / ENTRADA" system="data_entrada_caixa" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <MappingRow label="DESCRIÇÃO / FAVORECIDO" system="descricao" />
                            <MappingRow label="VALOR BRUTO (R$)" system="valor_bruto" />
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255,102,0,0.05)', borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Info size={16} color="var(--accent)" />
                            <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>DETECÇÃO DE RUBRICAS</p>
                        </div>
                        <p style={{ fontSize: '13px', color: 'white', marginTop: '8px' }}>
                            O sistema tentará vincular automaticamente rubricas como <strong>"Receitas PAIDEIA"</strong> aos códigos contábeis do seu plano mestre.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', gap: '16px' }}>
                        <button className="btn btn-ghost" onClick={() => setStep('UPLOAD')}>VOLTAR</button>
                        <button className="btn btn-primary" onClick={() => setStep('PREVIEW')}>CALCULAR IMPACTO →</button>
                    </div>
                </div>
            )}

            {step === 'PREVIEW' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Terminal size={18} color="var(--primary)" />
                                <h3 className="text-h3">Linhas Processadas para Entrada</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <SummaryBadge label="VÁLIDOS" value="02" color="var(--success)" />
                                <SummaryBadge label="ERROS" value="01" color="var(--accent)" />
                            </div>
                        </div>
                        <div style={{ maxHeight: '450px', overflowY: 'auto' }} className="custom-scrollbar">
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 5 }}>
                                    <tr style={{ borderBottom: '1px solid var(--border-active)' }}>
                                        <th style={thStyle}>COMPETÊNCIA</th>
                                        <th style={thStyle}>CAIXA</th>
                                        <th style={thStyle}>DESCRIÇÃO / RUBRICA</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>VALOR</th>
                                        <th style={thStyle}>ALERTA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="hover:bg-white/[0.01]">
                                            <td style={tdStyle}>{row.competencia}</td>
                                            <td style={tdStyle}>{row.caixa}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 700, color: 'white' }}>{row.descricao}</span>
                                                    <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 800 }}>{row.rubrica}</span>
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 900 }}>R$ {row.valor.toLocaleString()}</td>
                                            <td style={tdStyle}>
                                                {row.status === 'VALID' ? (
                                                    <CheckCircle2 size={16} color="var(--success)" />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '11px', fontWeight: 900 }}>
                                                        <AlertCircle size={14} /> {row.errors?.[0]}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button className="btn btn-ghost" onClick={() => setStep('CONFIG')}>CORRIGIR REGRAS</button>
                        <button className="btn btn-primary" onClick={handleCommit} disabled={isProcessing} style={{ padding: '20px 40px' }}>
                            {isProcessing ? 'PROCESSANDO...' : 'CONFIRMAR E DAR ENTRADA NO BANCO'} <Sparkles size={16} style={{ marginLeft: 8 }} />
                        </button>
                    </div>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="card" style={{ padding: '80px', textAlign: 'center', border: '1px solid var(--success)' }}>
                    <div style={{ ...iconCircleStyle, background: 'rgba(0,255,136,0.05)', color: 'var(--success)', border: '1px solid var(--success)', margin: '0 auto 32px' }}>
                        <Check size={48} />
                    </div>
                    <h2 className="text-h1" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Entradas Processadas</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 40px' }}>
                        As receitas foram integradas. Agora você pode visualizar o impacto nos relatórios de <strong>Regime de Caixa</strong> e <strong>Regime de Competência</strong>.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <Link href="/relatorios/dre" className="btn btn-primary" style={{ padding: '16px 40px' }}>VER DRE (COMPETÊNCIA)</Link>
                        <Link href="/fluxo-caixa" className="btn btn-ghost" style={{ padding: '16px 40px' }}>VER FLUXO DE CAIXA</Link>
                    </div>
                </div>
            )}

        </div>
    );
}

function StepItem({ active, completed, icon, label }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: active || completed ? 1 : 0.2 }}>
            <div style={{
                width: '32px', height: '32px', background: completed ? 'var(--primary)' : 'transparent',
                border: '1px solid' + (active || completed ? 'var(--primary)' : 'var(--border-subtle)'),
                color: completed ? 'black' : 'white', borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {completed ? <Check size={16} /> : icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: active ? 'white' : 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        </div>
    );
}

function MappingRow({ label, system }: any) {
    return (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '12px 0' }}>
            <p style={{ fontSize: '9px', color: 'var(--text-disabled)', fontWeight: 900, marginBottom: '8px' }}>{label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '10px', borderRadius: '2px', fontSize: '12px', flex: 1 }}>
                    <option>AUTODETECTAR COLUNA...</option>
                    <option value="A">COMPETÊNCIA</option>
                    <option value="B">DATA DE CAIXA</option>
                    <option value="C">ITEM / DESCRIÇÃO</option>
                    <option value="D">RUBRICA</option>
                    <option value="E">VALOR</option>
                </select>
            </div>
        </div>
    );
}

function SummaryBadge({ label, value, color }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-disabled)' }}>{label}</span>
            <span style={{ fontSize: '12px', fontWeight: 900, color: color }}>{value}</span>
        </div>
    );
}

const thStyle: React.CSSProperties = { padding: '16px 32px', fontSize: '10px', fontWeight: 900, color: 'var(--text-disabled)', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '16px 32px', fontSize: '13px', color: 'var(--text-secondary)' };
const iconCircleStyle = { width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const iconCircleStyleSmall = { width: '40px', height: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
