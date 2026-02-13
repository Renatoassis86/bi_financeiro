'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportacaoPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const expectedColumns = ['data_competencia', 'valor', 'descricao', 'centro_custo', 'conta_contabil', 'frente'];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            processFile(uploadedFile);
        }
    };

    const processFile = (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const bstr = e.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws);

                setData(jsonData);
                setStatus('success');
                setMessage(`${jsonData.length} registros processados com sucesso.`);
            } catch (err) {
                setStatus('error');
                setMessage('Erro ao processar planilha. Verifique o formato do arquivo.');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const clearFile = () => {
        setFile(null);
        setData([]);
        setStatus('idle');
        setMessage('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h1 className="text-h1">Importação de Dados</h1>
                <p className="text-body">Carregue planilhas de lançamentos, orçamentos ou cadastros.</p>
            </div>

            <div className="card" style={{
                border: '2px dashed var(--border-subtle)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '60px',
                textAlign: 'center',
                position: 'relative'
            }}>
                {!file ? (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 230, 118, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'var(--primary)'
                        }}>
                            <Upload size={32} />
                        </div>
                        <h3 className="text-h3" style={{ marginBottom: '8px' }}>Arraste sua planilha aqui</h3>
                        <p className="text-body" style={{ marginBottom: '24px' }}>Suporta .xlsx, .xls e .csv</p>

                        <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            Selecionar Arquivo
                            <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                        </label>
                    </>
                ) : (
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <FileSpreadsheet size={32} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 600 }}>{file.name}</p>
                                    <p className="text-body" style={{ fontSize: '12px' }}>{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
                                <Loader2 size={24} className="animate-spin" />
                                <span>Processando dados...</span>
                            </div>
                        ) : status === 'success' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 600 }}>
                                    <CheckCircle2 size={20} />
                                    {message}
                                </div>

                                <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Pré-visualização (Primeiros 5 registros)</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>Mapeamento Automático</span>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                                {data.length > 0 && Object.keys(data[0]).slice(0, 5).map(key => (
                                                    <th key={key} style={{ padding: '12px 16px' }}>{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.slice(0, 5).map((row, i) => (
                                                <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                                                    {Object.values(row).slice(0, 5).map((val: any, j) => (
                                                        <td key={j} style={{ padding: '12px 16px' }}>{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button className="btn btn-primary" style={{ flex: 1 }}>Confirmar e Salvar no Banco</button>
                                    <button className="btn btn-ghost" onClick={clearFile} style={{ flex: 1 }}>Cancelar</button>
                                </div>
                            </div>
                        ) : status === 'error' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 600 }}>
                                <AlertCircle size={20} />
                                {message}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Templates Section */}
            <div style={{ marginTop: '20px' }}>
                <h3 className="text-h3" style={{ marginBottom: '16px' }}>Templates de Importação</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {['Lançamentos Financeiros', 'Planilha de Orçamento', 'Cadastro de Produtos'].map(t => (
                        <div key={t} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                            <span style={{ fontSize: '14px' }}>{t}</span>
                            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>DOWNLOAD CSV</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
