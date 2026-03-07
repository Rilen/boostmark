import { useState, useMemo } from 'react';
import { KPICards } from './components/KPICards/KPICards';
import {
  ABCDoughnut,
  ABCRevenueBar,
  VolumeEffectLine,
  MixEffectBar,
  StockTurnoverHeatmap,
  TrendAnalysisChart,
  RegionalStockBar
} from './components/Charts/Charts';
import { AlertsPanel } from './components/AlertsPanel/AlertsPanel';
import { FileUpload } from './components/FileUpload/FileUpload';
import { Filters } from './components/Filters/Filters';
import {
  computeABC,
  computeVolumeEffect,
  computeMixEffect,
  computeKPIs,
  computeTrend,
  computeStockByRegion
} from './utils/analytics';
import type { Product, ParsedData, FilterState, LayoutPadraoMeta } from './types';
import { BarChart2, LayoutDashboard, Zap, Building2, Calendar, Store, UploadCloud, TrendingUp, PackageSearch } from 'lucide-react';
import logomarca from './data/logomarca.png';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'abc' | 'effects' | 'heatmap';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { id: 'abc', label: 'Curva ABC', icon: <BarChart2 size={15} /> },
  { id: 'effects', label: 'Volume & Mix', icon: <Zap size={15} /> },
  { id: 'heatmap', label: 'Giro / Heatmap', icon: <BarChart2 size={15} /> },
];

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onData }: { onData: (d: ParsedData) => void }) {
  return (
    <div className="empty-state">
      <div className="empty-state__card">
        <div className="empty-state__logo">
          <img src={logomarca} alt="BoostMark Logo" />
        </div>
        <div className="empty-state__icon">
          <UploadCloud size={48} strokeWidth={1.2} />
        </div>
        <h2 className="empty-state__title">Nenhum dado carregado</h2>
        <p className="empty-state__desc">
          Importe seu relatório de vendas para visualizar a análise sell-out completa —
          Curva ABC, Efeito Volume/Mix, Giro de Estoque e alertas automáticos.
        </p>
        <div className="empty-state__upload">
          <FileUpload onData={onData} />
        </div>
        <p className="empty-state__hint">
          Formatos aceitos: <strong>.xlsx</strong> (relatório PDV) e <strong>.csv</strong>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    period: 'all',
    region: 'all',
    category: 'all',
    product: ''
  });
  const [tab, setTab] = useState<Tab>('dashboard');
  const [layoutMeta, setLayoutMeta] = useState<LayoutPadraoMeta | null>(null);

  const hasData = allProducts.length > 0;

  // ── Filter products ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (filters.period !== 'all' && p.period !== filters.period) return false;
      if (filters.region !== 'all' && p.region !== filters.region) return false;
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.product && !p.name.toLowerCase().includes(filters.product.toLowerCase())) return false;
      return true;
    });
  }, [allProducts, filters]);

  // Baseline = período anterior ao selecionado
  const baselinePeriod = useMemo(() => {
    if (periods.length < 2) return filtered;
    const currentPeriodIdx = filters.period !== 'all' ? periods.indexOf(filters.period) : periods.length - 1;
    const prevIdx = Math.max(0, currentPeriodIdx - 1);

    return allProducts.filter((p) => {
      if (p.period !== periods[prevIdx]) return false;
      // Mantém filtros de região/categoria no baseline para comparação justa
      if (filters.region !== 'all' && p.region !== filters.region) return false;
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      return true;
    });
  }, [allProducts, periods, filters, filtered]);

  const kpis = useMemo(() => computeKPIs(filtered, allProducts, baselinePeriod), [filtered, allProducts, baselinePeriod]);
  const abcProducts = useMemo(() => computeABC(filtered), [filtered]);
  const volumeEffects = useMemo(() => computeVolumeEffect(baselinePeriod, filtered), [baselinePeriod, filtered]);
  const mixEffects = useMemo(() => computeMixEffect(baselinePeriod, filtered), [baselinePeriod, filtered]);

  // Dados agregados para novos gráficos
  const trendData = useMemo(() => computeTrend(allProducts, periods), [allProducts, periods]);
  const regionalStock = useMemo(() => computeStockByRegion(abcProducts), [abcProducts]);

  function handleData(data: ParsedData) {
    setAllProducts(data.products);
    setPeriods(data.periods);
    setRegions(data.regions);
    setCategories(data.categories || []);
    setFilters({ period: 'all', region: 'all', category: 'all', product: '' });
    setLayoutMeta((data as ParsedData & { layoutPadraoMeta?: LayoutPadraoMeta }).layoutPadraoMeta ?? null);
  }

  // ── Se não tiver dados, mostra o empty state centralizado ─────────────────
  if (!hasData) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="app-header__brand">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Boost<b>Mark</b></span>
            <span className="logo-tag">Sell-Out Intelligence</span>
          </div>
        </header>
        <EmptyState onData={handleData} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header__brand">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Boost<b>Mark</b></span>
          <span className="logo-tag">Sell-Out Intelligence</span>
        </div>

        <nav className="app-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── LayoutPadrao Info Banner ───────────────────────────────────── */}
      {layoutMeta && (
        <div className="layout-banner">
          <span className="layout-banner__item">
            <Building2 size={12} /> {layoutMeta.empresa || 'Empresa'}
          </span>
          <span className="layout-banner__sep">·</span>
          <span className="layout-banner__item">
            <Calendar size={12} /> {layoutMeta.periodo}
          </span>
          <span className="layout-banner__sep">·</span>
          <span className="layout-banner__item">
            <Store size={12} /> {layoutMeta.lojas}
          </span>
          {layoutMeta.dataExtracao && (
            <>
              <span className="layout-banner__sep">·</span>
              <span className="layout-banner__item muted">Extração: {layoutMeta.dataExtracao}</span>
            </>
          )}
        </div>
      )}

      {/* ── Layout ─────────────────────────────────────────────────────── */}
      <div className="app-layout">
        {/* Left Panel */}
        <aside className="app-sidebar">
          <section className="sidebar-section">
            <h3 className="sidebar-title">Importar Dados</h3>
            <FileUpload onData={handleData} />
          </section>

          <section className="sidebar-section">
            <h3 className="sidebar-title">Filtros</h3>
            <Filters
              periods={periods}
              regions={regions}
              categories={categories}
              filters={filters}
              onChange={setFilters}
            />
          </section>

          {/* Alert summary sidebar */}
          <section className="sidebar-section sidebar-alerts-mini">
            <h3 className="sidebar-title">
              Alertas
              <span className="badge-count">{kpis.activeAlerts}</span>
            </h3>
            <div className="alert-mini-grid">
              <div className="alert-mini ruptura">
                <span>{kpis.alerts.filter((a) => a.type === 'ruptura').length}</span>
                <label>Rupturas</label>
              </div>
              <div className="alert-mini encalhe">
                <span>{kpis.alerts.filter((a) => a.type === 'encalhe').length}</span>
                <label>Encalhes</label>
              </div>
              <div className="alert-mini perf">
                <span>{kpis.alerts.filter((a) => a.type === 'baixa_performance').length}</span>
                <label>Performance</label>
              </div>
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <main className="app-main">
          {tab === 'dashboard' && (
            <>
              <KPICards kpis={kpis} />

              <div className="charts-grid-2">
                <div className="chart-card">
                  <h4 className="chart-title">
                    <TrendingUp size={14} className="inline-icon" /> Tendência de Vendas (Histórico)
                  </h4>
                  <div className="chart-wrap chart-wrap--lg">
                    <TrendAnalysisChart trend={trendData} />
                  </div>
                </div>
                <div className="chart-card">
                  <h4 className="chart-title">
                    <PackageSearch size={14} className="inline-icon" /> Saúde de Estoque por Loja/Região
                  </h4>
                  <div className="chart-wrap chart-wrap--lg">
                    <RegionalStockBar data={regionalStock} />
                  </div>
                </div>
              </div>

              <div className="charts-grid-2">
                <div className="chart-card">
                  <h4 className="chart-title">Faturamento por Produto – Curva ABC</h4>
                  <div className="chart-wrap chart-wrap--lg">
                    <ABCRevenueBar products={abcProducts} />
                  </div>
                </div>
                <div className="chart-card">
                  <h4 className="chart-title">Distribuição ABC</h4>
                  <div className="chart-wrap chart-wrap--md">
                    <ABCDoughnut abcPercent={kpis.abcPercent} abcCount={kpis.abcCount} />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'abc' && (
            <div className="charts-grid-1">
              <div className="chart-card">
                <h4 className="chart-title">Ranking de Faturamento – Curva ABC (Top 15)</h4>
                <div className="chart-wrap chart-wrap--xl">
                  <ABCRevenueBar products={abcProducts} />
                </div>
              </div>
              <div className="chart-card">
                <h4 className="chart-title">Proporção Curva ABC</h4>
                <div className="chart-wrap chart-wrap--md">
                  <ABCDoughnut abcPercent={kpis.abcPercent} abcCount={kpis.abcCount} />
                </div>
              </div>
            </div>
          )}

          {tab === 'effects' && (
            <div className="charts-grid-1">
              <div className="chart-card">
                <h4 className="chart-title">Efeito Volume (Δ Unidades vs. Período Anterior)</h4>
                <div className="chart-wrap chart-wrap--lg">
                  <VolumeEffectLine effects={volumeEffects} />
                </div>
              </div>
              <div className="chart-card">
                <h4 className="chart-title">Efeito Mix (Δ Participação na Cesta)</h4>
                <div className="chart-wrap chart-wrap--lg">
                  <MixEffectBar effects={mixEffects} />
                </div>
              </div>
            </div>
          )}

          {tab === 'heatmap' && (
            <div className="charts-grid-1">
              <div className="chart-card">
                <h4 className="chart-title">Heatmap de Giro de Estoque – Produto × Região</h4>
                <StockTurnoverHeatmap products={abcProducts} />
              </div>
            </div>
          )}
        </main>

        {/* Right Panel – Alerts */}
        <aside className="app-alerts">
          <h3 className="sidebar-title">
            Central de Alertas
            <span className="badge-count">{kpis.activeAlerts}</span>
          </h3>
          <AlertsPanel alerts={kpis.alerts} />
        </aside>
      </div>
    </div>
  );
}
