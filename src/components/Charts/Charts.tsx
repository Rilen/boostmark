import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions,
    type TooltipItem,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import type { KPISummary, ProductABC, VolumeEffect, MixEffect, TrendPoint, StockByRegion } from '../../types';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

// Shared style tokens
const TOOLTIP_BASE = {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    titleColor: '#f1f5f9',
    bodyColor: '#94a3b8',
} as const;

const LEGEND_BASE = { labels: { color: '#cbd5e1', font: { size: 11 } } } as const;

const SCALE_BASE = {
    ticks: { color: '#94a3b8', font: { size: 11 } } as const,
    grid: { color: '#1e293b' } as const,
};

// ─── ABC Distribution Doughnut ────────────────────────────────────────────────
interface ABCChartProps {
    abcPercent: KPISummary['abcPercent'];
    abcCount: KPISummary['abcCount'];
}

export function ABCDoughnut({ abcPercent, abcCount }: ABCChartProps) {
    const data = {
        labels: [
            `A – Alto Valor (${abcCount.A})`,
            `B – Médio Valor (${abcCount.B})`,
            `C – Baixo Valor (${abcCount.C})`,
        ],
        datasets: [
            {
                data: [abcPercent.A, abcPercent.B, abcPercent.C],
                backgroundColor: ['#6c63ff', '#06b6d4', '#f59e0b'],
                borderColor: ['#4f46e5', '#0891b2', '#d97706'],
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#cbd5e1', font: { size: 11 }, padding: 12 },
            },
            tooltip: { ...TOOLTIP_BASE },
        },
    };

    return <Doughnut data={data} options={options} />;
}

// ─── ABC Revenue Bar Chart ────────────────────────────────────────────────────
interface ABCRevenueProps {
    products: ProductABC[];
}

export function ABCRevenueBar({ products }: ABCRevenueProps) {
    const byName = new Map<string, { curve: string; revenue: number }>();
    products.forEach((p) => {
        const existing = byName.get(p.name);
        if (!existing) byName.set(p.name, { curve: p.curve, revenue: p.revenue });
        else existing.revenue += p.revenue;
    });

    const sorted = [...byName.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 15);
    const labels = sorted.map(([name]) => name.replace('Produto ', ''));
    const colors = sorted.map(([, v]) =>
        v.curve === 'A' ? '#6c63ff' : v.curve === 'B' ? '#06b6d4' : '#f59e0b'
    );

    const data = {
        labels,
        datasets: [
            {
                label: 'Faturamento (R$)',
                data: sorted.map(([, v]) => v.revenue),
                backgroundColor: colors,
                borderRadius: 4,
                borderSkipped: false as const,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            ...{ legend: LEGEND_BASE },
            legend: { display: false },
            tooltip: {
                ...TOOLTIP_BASE,
                callbacks: {
                    label: (ctx: TooltipItem<'bar'>) =>
                        ` R$ ${(ctx.raw as number).toLocaleString('pt-BR')}`,
                },
            },
        },
        scales: { x: SCALE_BASE, y: SCALE_BASE },
    };

    return <Bar data={data} options={options} />;
}

// ─── Volume Effect Line Chart ─────────────────────────────────────────────────
interface VolumeLineProps {
    effects: VolumeEffect[];
}

export function VolumeEffectLine({ effects }: VolumeLineProps) {
    const byProduct = new Map<string, number[]>();
    const periodSet = new Set<string>();

    effects.forEach((e) => periodSet.add(e.period));
    const periods = [...periodSet];

    effects.forEach((e) => {
        const key = e.product.replace('Produto ', '');
        if (!byProduct.has(key)) byProduct.set(key, Array(periods.length).fill(0));
        const idx = periods.indexOf(e.period);
        byProduct.get(key)![idx] = e.delta;
    });

    const top5 = [...byProduct.entries()].slice(0, 5);
    const palette = ['#6c63ff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const data = {
        labels: periods,
        datasets: top5.map(([name, values], i) => ({
            label: name,
            data: values,
            borderColor: palette[i],
            backgroundColor: `${palette[i]}22`,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
        })),
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: LEGEND_BASE,
            tooltip: {
                ...TOOLTIP_BASE,
                callbacks: {
                    label: (ctx: TooltipItem<'line'>) =>
                        ` Δ ${(ctx.raw as number).toFixed(0)} un`,
                },
            },
        },
        scales: { x: SCALE_BASE, y: SCALE_BASE },
    };

    return <Line data={data} options={options} />;
}

// ─── Mix Effect Bar Chart ─────────────────────────────────────────────────────
interface MixBarProps {
    effects: MixEffect[];
}

export function MixEffectBar({ effects }: MixBarProps) {
    const top = [...effects]
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 12);

    const data = {
        labels: top.map((e) => `${e.product.replace('Produto ', '')} · ${e.region.substring(0, 3)}`),
        datasets: [
            {
                label: 'Δ Participação (p.p.)',
                data: top.map((e) => e.delta),
                backgroundColor: top.map((e) => (e.delta >= 0 ? '#22c55ecc' : '#ef4444cc')),
                borderColor: top.map((e) => (e.delta >= 0 ? '#16a34a' : '#dc2626')),
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...TOOLTIP_BASE,
                callbacks: {
                    label: (ctx: TooltipItem<'bar'>) =>
                        ` Δ ${(ctx.raw as number).toFixed(3)} p.p.`,
                },
            },
        },
        scales: { x: SCALE_BASE, y: SCALE_BASE },
    };

    return <Bar data={data} options={options} />;
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────
interface HeatmapProps {
    products: ProductABC[];
}

export function StockTurnoverHeatmap({ products }: HeatmapProps) {
    const regions = [...new Set(products.map((p) => p.region))];
    const names = [...new Set(products.map((p) => p.name))].slice(0, 10);

    const turnovers: number[][] = names.map((name) =>
        regions.map((region) => {
            const p = products.find((x) => x.name === name && x.region === region);
            return p ? p.stockTurnover : 0;
        })
    );

    const allVals = turnovers.flat();
    const max = Math.max(...allVals) || 1;

    return (
        <div className="heatmap">
            <div className="heatmap__header">
                <div className="heatmap__corner" />
                {regions.map((r) => (
                    <div key={r} className="heatmap__col-label">{r.substring(0, 5)}</div>
                ))}
            </div>
            {names.map((name, ni) => (
                <div key={name} className="heatmap__row">
                    <div className="heatmap__row-label">{name.replace('Produto ', '')}</div>
                    {regions.map((r, ri) => {
                        const val = turnovers[ni][ri];
                        const intensity = val / max;
                        const color = getHeatColor(intensity);
                        return (
                            <div
                                key={r}
                                className="heatmap__cell"
                                style={{ background: color }}
                                title={`${name} · ${r}: giro ${val.toFixed(2)}`}
                            >
                                <span>{val.toFixed(1)}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
            <div className="heatmap__legend">
                <span>Baixo</span>
                <div className="heatmap__gradient" />
                <span>Alto</span>
            </div>
        </div>
    );
}

function getHeatColor(t: number): string {
    if (t < 0.33) {
        const r = Math.round(30 + t * 3 * (100 - 30));
        const g = Math.round(5 + t * 3 * (30 - 5));
        const b = Math.round(50 + t * 3 * (120 - 50));
        return `rgb(${r},${g},${b})`;
    } else if (t < 0.66) {
        const tt = (t - 0.33) * 3;
        const r = Math.round(100 + tt * (245 - 100));
        const g = Math.round(30 + tt * (158 - 30));
        const b = Math.round(120 + tt * (11 - 120));
        return `rgb(${r},${g},${b})`;
    } else {
        const tt = (t - 0.66) * 3;
        const r = Math.round(245 + tt * (239 - 245));
        const g = Math.round(158 + tt * (68 - 158));
        const b = Math.round(11 + tt * (68 - 11));
        return `rgb(${r},${g},${b})`;
    }
}

// ─── Trends Analysis Chart ────────────────────────────────────────────────────
interface TrendProps {
    trend: TrendPoint[];
}

export function TrendAnalysisChart({ trend }: TrendProps) {
    const data = {
        labels: trend.map((t) => t.period),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Faturamento (R$)',
                data: trend.map((t) => t.revenue),
                backgroundColor: 'rgba(108, 99, 255, 0.4)',
                borderColor: '#6c63ff',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                type: 'line' as const,
                label: 'Unidades Vendidas',
                data: trend.map((t) => t.units),
                borderColor: '#06b6d4',
                backgroundColor: 'transparent',
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5,
                yAxisID: 'y1',
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: LEGEND_BASE,
            tooltip: { ...TOOLTIP_BASE },
        },
        scales: {
            y: {
                ...SCALE_BASE,
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: { display: true, text: 'Faturamento', color: '#94a3b8' },
            },
            y1: {
                ...SCALE_BASE,
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Unidades', color: '#94a3b8' },
            },
            x: SCALE_BASE,
        },
    };

    return <Bar data={data as any} options={options as any} />;
}

// ─── Regional Stock Summary Bar ───────────────────────────────────────────────
interface RegionalProps {
    data: StockByRegion[];
}

export function RegionalStockBar({ data }: RegionalProps) {
    const chartData = {
        labels: data.map((d) => d.region),
        datasets: [
            {
                label: 'Rupturas',
                data: data.map((d) => d.ruptura),
                backgroundColor: '#ef4444dd',
                borderRadius: 4,
            },
            {
                label: 'Encalhes',
                data: data.map((d) => d.encalhe),
                backgroundColor: '#f59e0bdd',
                borderRadius: 4,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: LEGEND_BASE,
            tooltip: { ...TOOLTIP_BASE },
        },
        scales: {
            x: { ...SCALE_BASE, stacked: true },
            y: { ...SCALE_BASE, stacked: true },
        },
    };

    return <Bar data={chartData} options={options} />;
}
