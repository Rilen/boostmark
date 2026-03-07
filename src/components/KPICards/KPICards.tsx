import React from 'react';
import type { KPISummary } from '../../types';
import {
    TrendingUp, TrendingDown, AlertTriangle,
    BarChart2, ShoppingCart, Repeat2, Zap
} from 'lucide-react';

interface KPICardsProps {
    kpis: KPISummary;
}

interface CardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    trend?: 'up' | 'down' | 'neutral';
    accent?: string;
}

function Card({ icon, label, value, sub, trend, accent = '#6c63ff' }: CardProps) {
    const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#94a3b8';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

    return (
        <div className="kpi-card" style={{ '--accent': accent } as React.CSSProperties}>
            <div className="kpi-card__icon" style={{ background: `${accent}22`, color: accent }}>
                {icon}
            </div>
            <div className="kpi-card__body">
                <span className="kpi-card__label">{label}</span>
                <span className="kpi-card__value">{value}</span>
                {sub && (
                    <span className="kpi-card__sub" style={{ color: trendColor }}>
                        {TrendIcon && <TrendIcon size={12} style={{ marginRight: 3 }} />}
                        {sub}
                    </span>
                )}
            </div>
        </div>
    );
}

const fmt = (n: number) =>
    n >= 1_000_000
        ? `R$ ${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
            ? `R$ ${(n / 1_000).toFixed(1)}K`
            : `R$ ${n.toFixed(0)}`;

export function KPICards({ kpis }: KPICardsProps) {
    const volTrend = kpis.volumeEffectTotal >= 0 ? 'up' : 'down';
    const mixTrend = kpis.mixEffectTotal >= 0 ? 'up' : 'down';

    return (
        <div className="kpi-grid">
            <Card
                icon={<Zap size={20} />}
                label="Faturamento Total"
                value={fmt(kpis.totalRevenue)}
                sub={`${kpis.totalUnits.toLocaleString('pt-BR')} unidades`}
                accent="#6c63ff"
            />
            <Card
                icon={<BarChart2 size={20} />}
                label="Curva A / B / C"
                value={`${kpis.abcPercent.A.toFixed(0)}% / ${kpis.abcPercent.B.toFixed(0)}% / ${kpis.abcPercent.C.toFixed(0)}%`}
                sub={`${kpis.abcCount.A}A · ${kpis.abcCount.B}B · ${kpis.abcCount.C}C itens`}
                accent="#8b5cf6"
            />
            <Card
                icon={<TrendingUp size={20} />}
                label="Efeito Volume"
                value={`${kpis.volumeEffectTotal >= 0 ? '+' : ''}${kpis.volumeEffectTotal.toFixed(0)} un`}
                sub={kpis.volumeEffectTotal >= 0 ? 'Ganho de tração' : 'Perda de tração'}
                trend={volTrend}
                accent="#06b6d4"
            />
            <Card
                icon={<ShoppingCart size={20} />}
                label="Efeito Mix"
                value={`${kpis.mixEffectTotal >= 0 ? '+' : ''}${kpis.mixEffectTotal.toFixed(2)} p.p.`}
                sub={kpis.mixEffectTotal >= 0 ? 'Ganho de espaço' : 'Perda de espaço na cesta'}
                trend={mixTrend}
                accent="#10b981"
            />
            <Card
                icon={<Repeat2 size={20} />}
                label="Giro de Estoque"
                value={kpis.avgStockTurnover.toFixed(2)}
                sub="Vendas / Estoque Médio"
                accent="#f59e0b"
            />
            <Card
                icon={<AlertTriangle size={20} />}
                label="Alertas Ativos"
                value={String(kpis.activeAlerts)}
                sub={
                    kpis.alerts.filter((a) => a.severity === 'high').length > 0
                        ? `${kpis.alerts.filter((a) => a.severity === 'high').length} urgentes`
                        : 'Sem urgentes'
                }
                trend={kpis.activeAlerts > 0 ? 'down' : 'up'}
                accent="#ef4444"
            />
        </div>
    );
}
