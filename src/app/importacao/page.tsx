'use client';

import { useState, useRef } from 'react';
import {
    Upload, FileSpreadsheet, CheckCircle2, AlertCircle,
    ArrowRight, Download, Info, Trash2, Save,
    Search, Filter, Database, Terminal, FileWarning,
    X, Check, Loader2, History, User
} from 'lucide-react';

// --- TYPES ---

type ImportStep = 'UPLOAD' | 'VALIDATE' | 'PREVIEW' | 'COMMIT' | 'SUCCESS';

interface RowError {
    row: number;
    field: string;
    message: string;
    type: 'ERROR' | 'WARNING';
    suggestion?: string;
}

interface StagingRow {
    index: number;
    data: any;
    errors: RowError[];
    status: 'VALID' | 'INVALID' | 'DUPLICATE';
}

export default function ImportEnginePage() {
    const [step, setStep] = useState<ImportStep>('UPLOAD');
    const [fileName, setFileName] = useState<string | null>(null);
    const [stagingData, setStagingData] = useState<StagingRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- MOCK LOGIC ---

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setIsProcessing(true);

            // Simulate reading and initial validation
            setTimeout(() => {
                const mockRows: StagingRow[] = [
                    {
                        index: 1,
                        data: { data: '01/02/2026', conta: 'Vendas', cc: 'Comercial', valor: 5000, frente: 'PAIDEIA' },
                        errors: [],
                        status: 'VALID'
                    },
                    {
                        index: 2,
                        data: { data: 'Invalid', conta: 'Marketing', cc: 'Unknown', valor: -100, frente: 'OIKOS' },
                        errors: [
                            { row: 2, field: 'data', message: 'Formato de data inválido (esperado DD/MM/AAAA)', type: 'ERROR', suggestion: 'Corrigir para 02/02/2026' },
                            { row: 2, field: 'cc', message: 'Centro de Custo não cadastrado', type: 'ERROR' }
                        ],
                        status: 'INVALID'
                    },
                    {
                        index: 3,
                        data: { data: '01/02/2026', conta: 'Vendas', cc: 'Comercial', valor: 5000, frente: 'PAIDEIA' },
                        errors: [{ row: 3, field: 'HASH', message: 'Possível duplicidade detectada (conflito com linha 1)', type: 'WARNING', suggestion: 'Ignorar ou remover' }],
                        status: 'DUPLICATE'
                    },
                    {
                        index: 4,
                        data: { data: '15/02/2026', conta: 'Salários', cc: 'Acadêmico', valor: 150000, frente: 'PAIDEIA' },
                        errors: [],
                        status: 'VALID'
                    }
                ];
                setStagingData(mockRows);
                setIsProcessing(false);
                setStep('PREVIEW');
            }, 1500);
        }
    };

    const totals = {
        valid: stagingData.filter(r => r.status === 'VALID').length,
        invalid: stagingData.filter(r => r.status === 'INVALID').length,
        warning: stagingData.filter(r => r.status === 'DUPLICATE').length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. Header & Steps Stepper */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-h1">Importação Inteligente (XLSX)</h1>
                    <p className="text-body">Pipeline de staging e validação robusta para dados financeiros</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <StepIndicator current={step} step="UPLOAD" label="Upload" />
                    <StepIndicator current={step} step="PREVIEW" label="Validação" />
                    <StepIndicator current={step} step="COMMIT" label="Produção" />
                </div>
            </div>

            {step === 'UPLOAD' && (
                <>
                    {/* 2. Upload Area */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            height: '300px', border: '2px dashed #222', borderRadius: '24px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: '0.2s', background: 'rgba(255,255,255,0.01)'
                        }}
                        className="hover:border-[var(--primary)] hover:bg-white/[0.03]"
                    >
                        {isProcessing ? (
                            <div style={{ textAlign: 'center' }}>
                                <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ fontWeight: 700 }}>Processando arquivo...</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Executando staging e hashing de linhas</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <Upload size={32} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Clique ou Arraste o arquivo XLSX</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-disabled)' }}>Tamanho máximo: 10MB. Siga o template oficial para evitar erros.</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".xlsx, .csv" />
                    </div>

                    {/* 3. Help & Templates Section */}
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Download size={20} color="var(--primary)" />
                                <h4 style={{ fontWeight: 700 }}>Templates Oficiais</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <TemplateItem label="Template: Movimentações Diárias" />
                                <TemplateItem label="Template: Planejamento Mensal" />
                                <TemplateItem label="Template: Cadastro de Fornecedores" />
                            </div>
                        </div>
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Database size={20} color="var(--secondary)" />
                                <h4 style={{ fontWeight: 700 }}>Dicionário de Dados</h4>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Campos obrigatórios: <strong>Data (DD/MM/AAAA), Valor (Numérico), Conta, Centro de Custo, Frente</strong>.
                            </p>
                            <button className="btn btn-ghost" style={{ width: '100%', fontSize: '11px', border: '1px solid #333' }}>Ver documentação completa de chaves</button>
                        </div>
                    </div>
                </>
            )}

            {step === 'PREVIEW' && (
                <>
                    {/* 4. Validation Summary & Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <SummaryStat label="Válidas" value={totals.valid} color="var(--success)" icon={<CheckCircle2 size={14} />} />
                            <SummaryStat label="Erros" value={totals.invalid} color="var(--danger)" icon={<AlertCircle size={14} />} />
                            <SummaryStat label="Avisos" value={totals.warning} color="var(--warning)" icon={<FileWarning size={14} />} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-ghost" style={{ border: '1px solid #333' }} onClick={() => setStep('UPLOAD')}>Cancelar</button>
                            <button
                                className="btn btn-primary"
                                disabled={totals.invalid > 0}
                                style={{ opacity: totals.invalid > 0 ? 0.5 : 1 }}
                                onClick={() => setStep('COMMIT')}
                            >
                                Commit para Produção
                            </button>
                        </div>
                    </div>

                    {/* 5. Data Preview & Correction UI */}
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Terminal size={18} />
                                <h3 className="text-h3" style={{ fontSize: '14px' }}>Buffer de Staging — {fileName}</h3>
                            </div>
                            <button className="btn btn-ghost" style={{ fontSize: '11px', color: 'var(--danger)' }}><Trash2 size={14} style={{ marginRight: 8 }} /> Limpar Staging</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-disabled)', fontSize: '10px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '16px 24px', width: '60px' }}>Linha</th>
                                        <th style={{ padding: '16px' }}>Status / Validação</th>
                                        <th style={{ padding: '16px' }}>Data</th>
                                        <th style={{ padding: '16px' }}>Conta</th>
                                        <th style={{ padding: '16px' }}>C.Custo</th>
                                        <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                                        <th style={{ padding: '16px 24px', width: '100px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stagingData.map((row) => (
                                        <tr key={row.index} style={{ borderBottom: '1px solid #1A1A1A', background: row.status === 'VALID' ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                            <td style={{ padding: '16px 24px', color: '#555' }}>#{row.index}</td>
                                            <td style={{ padding: '16px' }}>
                                                {row.errors.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        {row.errors.map((err, i) => (
                                                            <div key={i} style={{ fontSize: '11px', color: err.type === 'ERROR' ? 'var(--danger)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {err.type === 'ERROR' ? <AlertCircle size={10} /> : <FileWarning size={10} />}
                                                                {err.message}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <CheckCircle2 size={10} /> Pronto para Commit
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px' }}>{row.data.data}</td>
                                            <td style={{ padding: '16px' }}>{row.data.conta}</td>
                                            <td style={{ padding: '16px' }}>{row.data.cc}</td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>R$ {row.data.valor.toLocaleString()}</td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                {row.errors.length > 0 && <button className="btn btn-ghost" style={{ padding: '4px' }}><Info size={16} /></button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {step === 'COMMIT' && (
                <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                        <Save size={40} />
                    </div>
                    <h2 className="text-h2" style={{ marginBottom: '16px' }}>Confirmar Commit em Produção?</h2>
                    <p style={{ maxWidth: '500px', margin: '0 auto 40px', color: 'var(--text-secondary)' }}>
                        Você está prestes a persistir <strong>{totals.valid} registros</strong> na base de dados principal.
                        Esta ação será registrada no log de auditoria do usuário <strong>Admin User</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', padding: '12px 32px' }} onClick={() => setStep('PREVIEW')}>Revisar Novamente</button>
                        <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setStep('SUCCESS'); }, 2000); }}>Confirmar e Salvar</button>
                    </div>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="card" style={{ padding: '60px', textAlign: 'center', borderColor: 'var(--success)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,230,118,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                        <Check size={40} />
                    </div>
                    <h2 className="text-h2" style={{ marginBottom: '16px' }}>Importação Concluída com Sucesso!</h2>
                    <p style={{ maxWidth: '500px', margin: '0 auto 40px', color: 'var(--text-secondary)' }}>
                        Os dados foram migrados do staging para as tabelas de produção. O relatório de execução está disponível no histórico.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid #333', padding: '12px 32px' }} onClick={() => setStep('UPLOAD')}>Nova Importação</button>
                        <button className="btn btn-primary" style={{ padding: '12px 32px' }}>Ver Logs de Auditoria</button>
                    </div>
                </div>
            )}

        </div>
    );
}

function StepIndicator({ current, step, label }: { current: ImportStep, step: ImportStep, label: string }) {
    const stepsOrder: ImportStep[] = ['UPLOAD', 'PREVIEW', 'COMMIT', 'SUCCESS'];
    const isActive = current === step;
    const isPast = stepsOrder.indexOf(current) > stepsOrder.indexOf(step);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: isPast ? 'var(--primary)' : isActive ? 'var(--primary)' : '#111',
                border: '1px solid' + (isActive || isPast ? 'var(--primary)' : '#222'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: isPast ? 'black' : 'white'
            }}>
                {isPast ? <Check size={14} /> : '✓'}
            </div>
            <span style={{ fontSize: '13px', color: isActive ? 'white' : 'var(--text-disabled)', fontWeight: isActive ? 700 : 400 }}>{label}</span>
            {label !== 'Produção' && <div style={{ width: '20px', height: '1px', background: '#222' }} />}
        </div>
    );
}

function SummaryStat({ label, value, color, icon }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: '6px', background: `${color}10`, color: color }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '10px', color: 'var(--text-disabled)', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{value}</p>
            </div>
        </div>
    );
}

function TemplateItem({ label }: { label: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid #222' }}>
            <span style={{ fontSize: '13px' }}>{label}</span>
            <button className="btn btn-ghost" style={{ padding: '4px' }}><Download size={16} /></button>
        </div>
    );
}

const inputStyle = { width: '100%', background: '#0D0D0D', border: '1px solid #222', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' };
