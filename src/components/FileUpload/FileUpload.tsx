import { useRef, useState } from 'react';
import { Upload, FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { parseFile, generateCSVTemplate } from '../../utils/fileParser';
import type { ParsedData } from '../../types';

interface FileUploadProps {
    onData: (data: ParsedData) => void;
}

export function FileUpload({ onData }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFile(file: File) {
        setFileName(file.name);
        setStatus('loading');
        setErrorMsg('');
        try {
            const data = await parseFile(file);
            if (data.products.length === 0) {
                throw new Error('Nenhum produto encontrado. Verifique as colunas do arquivo.');
            }
            setStatus('success');
            onData(data);
        } catch (err: unknown) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar arquivo');
        }
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function downloadTemplate() {
        const csv = generateCSVTemplate();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'boostmark_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="upload-section">
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${status === 'success' ? 'success' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />

                {status === 'loading' && (
                    <div className="upload-state">
                        <div className="spinner" />
                        <span>Processando {fileName}…</span>
                    </div>
                )}
                {status === 'success' && (
                    <div className="upload-state success">
                        <CheckCircle size={28} color="#22c55e" />
                        <span>{fileName} carregado</span>
                    </div>
                )}
                {status === 'error' && (
                    <div className="upload-state error">
                        <XCircle size={28} color="#ef4444" />
                        <span>{errorMsg}</span>
                    </div>
                )}
                {status === 'idle' && (
                    <div className="upload-state">
                        <Upload size={28} opacity={0.6} />
                        <span>Arraste CSV / XLSX ou clique</span>
                        <span className="upload-hint">name, region, revenue, unitsSold, stock, avgStock, price, period</span>
                    </div>
                )}
            </div>

            <div className="upload-actions">
                <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}>
                    <Download size={13} /> Template CSV
                </button>
                <span className="upload-formats">
                    <FileText size={12} /> CSV · XLSX · XLS
                </span>
            </div>
        </div>
    );
}
