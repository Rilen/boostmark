export type ABCCurve = 'A' | 'B' | 'C';

export interface Product {
    id: string;
    name: string;
    region: string;
    category?: string;   // fabricante / fornecedor
    revenue: number;
    unitsSold: number;
    stock: number;
    avgStock: number;
    price: number;
    period: string;

    // ─── Campos estendidos do LayoutPadrao (relatório farmácia) ───────────
    codigoProduto?: string;
    cost?: number;
    unidadesDia?: number;
    diasEstoque?: number;
}

export interface ProductABC extends Product {
    curve: ABCCurve;
    revenueShare: number;
    cumulativeShare: number;
    stockTurnover: number;
}

export interface VolumeEffect {
    product: string;
    region: string;
    period: string;
    baseline: number;
    current: number;
    delta: number;
    deltaPercent: number;
}

export interface MixEffect {
    product: string;
    region: string;
    period: string;
    baselineShare: number;
    currentShare: number;
    delta: number;
    deltaPercent: number;
}

/** Série temporal agregada por período — para gráfico de tendência */
export interface TrendPoint {
    period: string;
    revenue: number;
    units: number;
    avgTurnover: number;
}

/** Snapshot de estoque agregado por região */
export interface StockByRegion {
    region: string;
    currentStock: number;
    avgStock: number;
    stockRatio: number;         // current / avg
    ruptura: number;            // qtd produtos em ruptura
    encalhe: number;            // qtd produtos em encalhe
}

export type AlertType = 'ruptura' | 'encalhe' | 'baixa_performance';
export type AlertSeverity = 'high' | 'medium' | 'low';

export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    product: string;
    region: string;
    period: string;
    message: string;
    recommendation: string;
    stockTurnover?: number;
    unitsSold?: number;
    stock?: number;
}

export interface KPISummary {
    totalRevenue: number;
    totalUnits: number;
    avgStockTurnover: number;
    abcCount: { A: number; B: number; C: number };
    abcPercent: { A: number; B: number; C: number };
    volumeEffectTotal: number;
    mixEffectTotal: number;
    activeAlerts: number;
    alerts: Alert[];
    // Deltas vs período anterior (undefined quando sem baseline)
    revenueDelta?: number;      // Δ% faturamento
    unitsDelta?: number;        // Δ% unidades
    turnoverDelta?: number;     // Δ absoluto giro
}

export interface FilterState {
    period: string;
    region: string;
    category: string;    // fabricante / fornecedor
    product: string;     // nome do produto
}

export interface LayoutPadraoMeta {
    empresa: string;
    periodo: string;
    lojas: string;
    dataExtracao: string;
}

export interface ParsedData {
    products: Product[];
    periods: string[];
    regions: string[];
    categories: string[];
    layoutPadraoMeta?: LayoutPadraoMeta;
}
