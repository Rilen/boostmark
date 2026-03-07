import type { Alert } from '../../types';
import { AlertTriangle, ShoppingBag, TrendingDown, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AlertsPanelProps {
    alerts: Alert[];
}

const TYPE_META = {
    ruptura: {
        label: 'Ruptura',
        icon: <AlertTriangle size={14} />,
        color: '#ef4444',
        bg: '#ef444422',
    },
    encalhe: {
        label: 'Encalhe',
        icon: <ShoppingBag size={14} />,
        color: '#f59e0b',
        bg: '#f59e0b22',
    },
    baixa_performance: {
        label: 'Baixa Performance',
        icon: <TrendingDown size={14} />,
        color: '#06b6d4',
        bg: '#06b6d422',
    },
};

const SEV_ORDER = { high: 0, medium: 1, low: 2 };

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('all');

    const sorted = [...alerts].sort(
        (a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]
    );

    const filtered = filterType === 'all' ? sorted : sorted.filter((a) => a.type === filterType);

    const counts = {
        ruptura: alerts.filter((a) => a.type === 'ruptura').length,
        encalhe: alerts.filter((a) => a.type === 'encalhe').length,
        baixa_performance: alerts.filter((a) => a.type === 'baixa_performance').length,
    };

    return (
        <div className="alerts-panel">
            <div className="alerts-panel__filters">
                <button
                    className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterType('all')}
                >
                    Todos ({alerts.length})
                </button>
                <button
                    className={`filter-pill ruptura ${filterType === 'ruptura' ? 'active' : ''}`}
                    onClick={() => setFilterType('ruptura')}
                >
                    <AlertTriangle size={11} /> Rupturas ({counts.ruptura})
                </button>
                <button
                    className={`filter-pill encalhe ${filterType === 'encalhe' ? 'active' : ''}`}
                    onClick={() => setFilterType('encalhe')}
                >
                    <ShoppingBag size={11} /> Encalhes ({counts.encalhe})
                </button>
                <button
                    className={`filter-pill perf ${filterType === 'baixa_performance' ? 'active' : ''}`}
                    onClick={() => setFilterType('baixa_performance')}
                >
                    <TrendingDown size={11} /> Performance ({counts.baixa_performance})
                </button>
            </div>

            <div className="alerts-list">
                {filtered.length === 0 && (
                    <div className="alerts-empty">
                        <X size={32} opacity={0.3} />
                        <span>Nenhum alerta encontrado</span>
                    </div>
                )}
                {filtered.map((alert) => {
                    const meta = TYPE_META[alert.type];
                    const isOpen = expanded === alert.id;
                    return (
                        <div
                            key={alert.id}
                            className={`alert-card severity-${alert.severity}`}
                            style={{ '--alert-color': meta.color, '--alert-bg': meta.bg } as React.CSSProperties}
                        >
                            <div className="alert-card__header" onClick={() => setExpanded(isOpen ? null : alert.id)}>
                                <span className="alert-badge" style={{ background: meta.bg, color: meta.color }}>
                                    {meta.icon} {meta.label}
                                </span>
                                <div className="alert-card__title">
                                    <strong>{alert.product}</strong>
                                    <span className="alert-region">· {alert.region} · {alert.period}</span>
                                </div>
                                <span className="alert-card__message">{alert.message}</span>
                                <button className="alert-expand">
                                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>
                            {isOpen && (
                                <div className="alert-card__body">
                                    <div className="alert-rec">
                                        <strong>📋 Recomendação:</strong> {alert.recommendation}
                                    </div>
                                    <div className="alert-stats">
                                        {alert.unitsSold !== undefined && (
                                            <span>Vendas: <b>{alert.unitsSold.toLocaleString('pt-BR')}</b></span>
                                        )}
                                        {alert.stock !== undefined && (
                                            <span>Estoque: <b>{alert.stock.toLocaleString('pt-BR')}</b></span>
                                        )}
                                        {alert.stockTurnover !== undefined && (
                                            <span>Giro: <b>{alert.stockTurnover.toFixed(2)}</b></span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
