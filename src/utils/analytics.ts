import type {
    Product,
    ProductABC,
    ABCCurve,
    VolumeEffect,
    MixEffect,
    TrendPoint,
    StockByRegion,
    Alert,
    KPISummary,
    AlertType,
    AlertSeverity,
} from '../types';

// ─── ABC Curve Analysis (dinâmico por receita acumulada) ──────────────────────
export function computeABC(products: Product[]): ProductABC[] {
    // Agrega por nome quando há multiplas regiões no mesmo período
    const byName = new Map<string, Product>();
    products.forEach((p) => {
        const existing = byName.get(p.name);
        if (!existing || p.revenue > existing.revenue) {
            byName.set(p.name, p);
        }
    });

    const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);

    // Classifica por receita acumulada dos nomes únicos
    const sortedNames = [...byName.values()].sort((a, b) => b.revenue - a.revenue);
    let cumulativeRevenue = 0;
    const curveMap = new Map<string, ABCCurve>();
    sortedNames.forEach((p) => {
        cumulativeRevenue += p.revenue;
        // Classifica baseado na acumulada ANTES de adicionar esse produto
        const priorPercent = (cumulativeRevenue - p.revenue) / (totalRevenue || 1);
        if (priorPercent < 0.8) curveMap.set(p.name, 'A');
        else if (priorPercent < 0.95) curveMap.set(p.name, 'B');
        else curveMap.set(p.name, 'C');
    });

    // Aplica a curva a todos os registros (incluindo regionais)
    let cumulative = 0;
    return [...products]
        .sort((a, b) => b.revenue - a.revenue)
        .map((p) => {
            const revenueShare = totalRevenue > 0 ? p.revenue / totalRevenue : 0;
            cumulative += revenueShare;
            const stockTurnover = p.avgStock > 0 ? p.unitsSold / p.avgStock : 0;
            return {
                ...p,
                curve: curveMap.get(p.name) ?? 'C',
                revenueShare: revenueShare * 100,
                cumulativeShare: cumulative * 100,
                stockTurnover,
            };
        });
}

export function getABCDistribution(products: ProductABC[]) {
    const uniqueByName = new Map<string, ABCCurve>();
    products.forEach((p) => {
        if (!uniqueByName.has(p.name)) uniqueByName.set(p.name, p.curve);
    });

    const count = { A: 0, B: 0, C: 0 };
    uniqueByName.forEach((curve) => count[curve]++);
    const total = uniqueByName.size || 1;

    return {
        count,
        percent: {
            A: (count.A / total) * 100,
            B: (count.B / total) * 100,
            C: (count.C / total) * 100,
        },
    };
}

// ─── Volume & Mix Effects ─────────────────────────────────────────────────────
export function computeVolumeEffect(
    baseline: Product[],
    current: Product[]
): VolumeEffect[] {
    const result: VolumeEffect[] = [];
    const baseMap = new Map<string, Product>();
    baseline.forEach((p) => baseMap.set(`${p.name}|${p.region}`, p));

    current.forEach((p) => {
        const key = `${p.name}|${p.region}`;
        const base = baseMap.get(key);
        if (!base) return;

        const delta = p.unitsSold - base.unitsSold;
        const deltaPercent = base.unitsSold > 0 ? (delta / base.unitsSold) * 100 : 0;

        result.push({
            product: p.name,
            region: p.region,
            period: p.period,
            baseline: base.unitsSold,
            current: p.unitsSold,
            delta,
            deltaPercent,
        });
    });

    return result;
}

export function computeMixEffect(
    baseline: Product[],
    current: Product[]
): MixEffect[] {
    const result: MixEffect[] = [];

    const baseTotal = baseline.reduce((s, p) => s + p.revenue, 0) || 1;
    const currentTotal = current.reduce((s, p) => s + p.revenue, 0) || 1;

    const baseMap = new Map<string, Product>();
    baseline.forEach((p) => baseMap.set(`${p.name}|${p.region}`, p));

    current.forEach((p) => {
        const key = `${p.name}|${p.region}`;
        const base = baseMap.get(key);
        if (!base) return;

        const baselineShare = (base.revenue / baseTotal) * 100;
        const currentShare = (p.revenue / currentTotal) * 100;
        const delta = currentShare - baselineShare;
        const deltaPercent = baselineShare > 0 ? (delta / baselineShare) * 100 : 0;

        result.push({
            product: p.name,
            region: p.region,
            period: p.period,
            baselineShare,
            currentShare,
            delta,
            deltaPercent,
        });
    });

    return result;
}

// ─── Trend Analysis (série temporal) ─────────────────────────────────────────
export function computeTrend(allProducts: Product[], periods: string[]): TrendPoint[] {
    return periods.map((period) => {
        const ps = allProducts.filter((p) => p.period === period);
        const revenue = ps.reduce((s, p) => s + p.revenue, 0);
        const units = ps.reduce((s, p) => s + p.unitsSold, 0);
        const valid = ps.filter((p) => p.avgStock > 0);
        const avgTurnover = valid.length
            ? valid.reduce((s, p) => s + p.unitsSold / p.avgStock, 0) / valid.length
            : 0;
        return { period, revenue, units, avgTurnover };
    });
}

// ─── Stock by Region ──────────────────────────────────────────────────────────
export function computeStockByRegion(products: ProductABC[]): StockByRegion[] {
    const regionMap = new Map<string, {
        curr: number; avg: number; ruptura: number; encalhe: number;
    }>();

    products.forEach((p) => {
        const entry = regionMap.get(p.region) ?? { curr: 0, avg: 0, ruptura: 0, encalhe: 0 };
        entry.curr += p.stock;
        entry.avg += p.avgStock;

        const ratio = p.avgStock > 0 ? p.stock / p.avgStock : 1;
        if (ratio <= 0.15) entry.ruptura++;
        if (ratio >= 3.5) entry.encalhe++;

        regionMap.set(p.region, entry);
    });

    return [...regionMap.entries()]
        .map(([region, d]) => ({
            region,
            currentStock: d.curr,
            avgStock: d.avg,
            stockRatio: d.avg > 0 ? d.curr / d.avg : 1,
            ruptura: d.ruptura,
            encalhe: d.encalhe,
        }))
        .sort((a, b) => a.stockRatio - b.stockRatio); // mais críticos primeiro
}

// ─── Stock Turnover ───────────────────────────────────────────────────────────
export function computeAvgTurnover(products: Product[]): number {
    const valid = products.filter((p) => p.avgStock > 0);
    if (!valid.length) return 0;
    return valid.reduce((s, p) => s + p.unitsSold / p.avgStock, 0) / valid.length;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
const RUPTURA_STOCK_THRESHOLD = 0.15;
const RUPTURA_SALES_PERCENTILE = 0.6;
const ENCALHE_STOCK_THRESHOLD = 3.5;
const ENCALHE_SALES_PERCENTILE = 0.3;

export function generateAlerts(products: ProductABC[]): Alert[] {
    const alerts: Alert[] = [];

    const allSales = products.map((p) => p.unitsSold).sort((a, b) => a - b);
    const p30 = allSales[Math.floor(allSales.length * ENCALHE_SALES_PERCENTILE)] ?? 0;
    const p60 = allSales[Math.floor(allSales.length * RUPTURA_SALES_PERCENTILE)] ?? 0;

    const avgTurnover = computeAvgTurnover(products);

    products.forEach((p) => {
        const stockRatio = p.avgStock > 0 ? p.stock / p.avgStock : 1;

        if (p.unitsSold >= p60 && stockRatio <= RUPTURA_STOCK_THRESHOLD) {
            alerts.push({
                id: `ruptura-${p.id}`,
                type: 'ruptura' as AlertType,
                severity: 'high' as AlertSeverity,
                product: p.name,
                region: p.region,
                period: p.period,
                message: `Risco de ruptura: estoque crítico (${Math.round(stockRatio * 100)}% do médio)`,
                recommendation: `Reposição urgente em ${p.region}. Considere ação de Push no PDV.`,
                stockTurnover: p.stockTurnover,
                unitsSold: p.unitsSold,
                stock: p.stock,
            });
        }

        if (p.unitsSold <= p30 && stockRatio >= ENCALHE_STOCK_THRESHOLD) {
            alerts.push({
                id: `encalhe-${p.id}`,
                type: 'encalhe' as AlertType,
                severity: 'medium' as AlertSeverity,
                product: p.name,
                region: p.region,
                period: p.period,
                message: `Encalhe detectado: estoque ${Math.round(stockRatio)}x acima do médio`,
                recommendation: `Avalie promoção ou redistribuição para ${p.region}. Analise mix de preço.`,
                stockTurnover: p.stockTurnover,
                unitsSold: p.unitsSold,
                stock: p.stock,
            });
        }

        if (
            p.curve !== 'C' &&
            p.stockTurnover < avgTurnover * 0.5 &&
            !alerts.find((a) => a.product === p.name && a.region === p.region)
        ) {
            alerts.push({
                id: `perf-${p.id}`,
                type: 'baixa_performance' as AlertType,
                severity: 'low' as AlertSeverity,
                product: p.name,
                region: p.region,
                period: p.period,
                message: `Baixo giro (${p.stockTurnover.toFixed(2)}) vs. média (${avgTurnover.toFixed(2)})`,
                recommendation: `Produto Curva ${p.curve} com baixo desempenho em ${p.region}. Revise precificação e cross-selling.`,
                stockTurnover: p.stockTurnover,
                unitsSold: p.unitsSold,
                stock: p.stock,
            });
        }
    });

    return alerts.slice(0, 60);
}

// ─── Master KPI Summary ───────────────────────────────────────────────────────
export function computeKPIs(
    filtered: Product[],
    _allProducts: Product[],
    baselinePeriodProducts: Product[]
): KPISummary {
    const withABC = computeABC(filtered);
    const { count: abcCount, percent: abcPercent } = getABCDistribution(withABC);

    const totalRevenue = filtered.reduce((s, p) => s + p.revenue, 0);
    const totalUnits = filtered.reduce((s, p) => s + p.unitsSold, 0);
    const avgStockTurnover = computeAvgTurnover(filtered);

    const volumeEffects = computeVolumeEffect(baselinePeriodProducts, filtered);
    const mixEffects = computeMixEffect(baselinePeriodProducts, filtered);

    const volumeEffectTotal =
        volumeEffects.reduce((s, v) => s + v.delta, 0) / (volumeEffects.length || 1);
    const mixEffectTotal =
        mixEffects.reduce((s, m) => s + m.delta, 0) / (mixEffects.length || 1);

    // Deltas percentuais vs período anterior
    const baseRevenue = baselinePeriodProducts.reduce((s, p) => s + p.revenue, 0);
    const baseUnits = baselinePeriodProducts.reduce((s, p) => s + p.unitsSold, 0);
    const baseTurnover = computeAvgTurnover(baselinePeriodProducts);

    const revenueDelta = baseRevenue > 0 ? ((totalRevenue - baseRevenue) / baseRevenue) * 100 : undefined;
    const unitsDelta = baseUnits > 0 ? ((totalUnits - baseUnits) / baseUnits) * 100 : undefined;
    const turnoverDelta = baseTurnover > 0 ? avgStockTurnover - baseTurnover : undefined;

    const alerts = generateAlerts(withABC);

    return {
        totalRevenue,
        totalUnits,
        avgStockTurnover,
        abcCount,
        abcPercent,
        volumeEffectTotal,
        mixEffectTotal,
        activeAlerts: alerts.length,
        alerts,
        revenueDelta,
        unitsDelta,
        turnoverDelta,
    };
}
