import type {
    Product,
    ProductABC,
    ABCCurve,
    VolumeEffect,
    MixEffect,
    Alert,
    KPISummary,
    AlertType,
    AlertSeverity,
} from '../types';

// ─── ABC Curve Analysis ───────────────────────────────────────────────────────
export function computeABC(products: Product[]): ProductABC[] {
    const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);

    const sorted = [...products].sort((a, b) => b.revenue - a.revenue);

    let cumulative = 0;
    return sorted.map((p) => {
        const revenueShare = totalRevenue > 0 ? p.revenue / totalRevenue : 0;
        cumulative += revenueShare;

        let curve: ABCCurve;
        if (cumulative - revenueShare < 0.8) curve = 'A';
        else if (cumulative - revenueShare < 0.95) curve = 'B';
        else curve = 'C';

        const stockTurnover = p.avgStock > 0 ? p.unitsSold / p.avgStock : 0;

        return {
            ...p,
            curve,
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

// ─── Stock Turnover ───────────────────────────────────────────────────────────
export function computeAvgTurnover(products: Product[]): number {
    const valid = products.filter((p) => p.avgStock > 0);
    if (!valid.length) return 0;
    return valid.reduce((s, p) => s + p.unitsSold / p.avgStock, 0) / valid.length;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
const RUPTURA_STOCK_THRESHOLD = 0.15; // stock < 15% of avgStock
const RUPTURA_SALES_PERCENTILE = 0.6; // unitsSold above 60th percentile
const ENCALHE_STOCK_THRESHOLD = 3.5;  // stock > 3.5x avgStock
const ENCALHE_SALES_PERCENTILE = 0.3; // unitsSold below 30th percentile

export function generateAlerts(products: ProductABC[]): Alert[] {
    const alerts: Alert[] = [];

    const allSales = products.map((p) => p.unitsSold).sort((a, b) => a - b);
    const p30 = allSales[Math.floor(allSales.length * ENCALHE_SALES_PERCENTILE)];
    const p60 = allSales[Math.floor(allSales.length * RUPTURA_SALES_PERCENTILE)];

    const avgTurnover = computeAvgTurnover(products);

    products.forEach((p) => {
        const stockRatio = p.avgStock > 0 ? p.stock / p.avgStock : 1;

        // Ruptura: high sales + low stock
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

        // Encalhe: low sales + high stock
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

        // Baixa performance: below avg turnover and curve A/B
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

    return alerts.slice(0, 50); // cap for performance
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
        volumeEffects.reduce((s, v) => s + v.delta, 0) /
        (volumeEffects.length || 1);
    const mixEffectTotal =
        mixEffects.reduce((s, m) => s + m.delta, 0) / (mixEffects.length || 1);

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
    };
}
