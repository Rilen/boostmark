export type ABCCurve = 'A' | 'B' | 'C';

export interface Product {
    id: string;
    name: string;
    region: string;
    category?: string;
    revenue: number;
    unitsSold: number;
    stock: number;
    avgStock: number;
    price: number;
    period: string; // e.g. "2024-01" or "Jan/24"

    // ─── Campos estendidos do LayoutPadrao (relatório farmácia) ───────────
    /** Código interno do produto no sistema PDV */
    codigoProduto?: string;
    /** Custo da última compra (Custo Últ. Comp.) */
    cost?: number;
    /** Unidades vendidas por dia (Un./dia) */
    unidadesDia?: number;
    /** Dias de estoque disponível (Dias est. = Est. Atual / Un. dia) */
    diasEstoque?: number;
}

export interface ProductABC extends Product {
    curve: ABCCurve;
    revenueShare: number; // % of total revenue
    cumulativeShare: number;
    stockTurnover: number; // Giro = unitsSold / avgStock
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
    baselineShare: number; // % of basket in baseline
    currentShare: number;  // % of basket in current
    delta: number;
    deltaPercent: number;
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
}

export interface FilterState {
    period: string;
    region: string;
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
    /** Preenchido quando o arquivo é reconhecido como LayoutPadrao */
    layoutPadraoMeta?: LayoutPadraoMeta;
}
