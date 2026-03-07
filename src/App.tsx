import { useState, useMemo } from 'react';
import { KPICards } from './components/KPICards/KPICards';
import {
  ABCDoughnut,
  ABCRevenueBar,
  VolumeEffectLine,
  MixEffectBar,
  StockTurnoverHeatmap,
} from './components/Charts/Charts';
import { AlertsPanel } from './components/AlertsPanel/AlertsPanel';
import { FileUpload } from './components/FileUpload/FileUpload';
import { Filters } from './components/Filters/Filters';
import { computeABC, computeVolumeEffect, computeMixEffect, computeKPIs } from './utils/analytics';
import { MOCK_PRODUCTS, ALL_PERIODS, ALL_REGIONS } from './data/mockData';
import type { Product, ParsedData, FilterState, LayoutPadraoMeta } from './types';
import { BarChart2, LayoutDashboard, Zap, Building2, Calendar, Store } from 'lucide-react';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'abc' | 'effects' | 'heatmap';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { id: 'abc', label: 'Curva ABC', icon: <BarChart2 size={15} /> },
  { id: 'effects', label: 'Volume & Mix', icon: <Zap size={15} /> },
  { id: 'heatmap', label: 'Giro / Heatmap', icon: <BarChart2 size={15} /> },
];

export default function App() {
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [periods, setPeriods] = useState<string[]>(ALL_PERIODS);
  const [regions, setRegions] = useState<string[]>(ALL_REGIONS);
  const [filters, setFilters] = useState<FilterState>({ period: 'all', region: 'all' });
  const [tab, setTab] = useState<Tab>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [layoutMeta, setLayoutMeta] = useState<LayoutPadraoMeta | null>(null);

  // ── Filter products ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (filters.period !== 'all' && p.period !== filters.period) return false;
      if (filters.region !== 'all' && p.region !== filters.region) return false;
      return true;
    });
  }, [allProducts, filters]);

  // Baseline = previous period or same set for relative comparisons
  const baselinePeriod = useMemo(() => {
    if (periods.length < 2) return filtered;
    const prevIdx = filters.period !== 'all'
      ? Math.max(0, periods.indexOf(filters.period) - 1)
      : 0;
    return allProducts.filter((p) => p.period === periods[prevIdx]);
  }, [allProducts, periods, filters.period, filtered]);

  const kpis = useMemo(() => computeKPIs(filtered, allProducts, baselinePeriod), [filtered, allProducts, baselinePeriod]);
  const abcProducts = useMemo(() => computeABC(filtered), [filtered]);
  const volumeEffects = useMemo(() => computeVolumeEffect(baselinePeriod, filtered), [baselinePeriod, filtered]);
  const mixEffects = useMemo(() => computeMixEffect(baselinePeriod, filtered), [baselinePeriod, filtered]);

  function handleData(data: ParsedData) {
    setAllProducts(data.products);
    setPeriods(data.periods);
    setRegions(data.regions);
    setFilters({ period: 'all', region: 'all' });
    setIsDemoMode(false);
    setLayoutMeta((data as ParsedData & { layoutPadraoMeta?: LayoutPadraoMeta }).layoutPadraoMeta ?? null);
  }

  function loadDemo() {
    setAllProducts(MOCK_PRODUCTS);
    setPeriods(ALL_PERIODS);
    setRegions(ALL_REGIONS);
    setFilters({ period: 'all', region: 'all' });
    setIsDemoMode(true);
    setLayoutMeta(null);
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

        {isDemoMode && (
          <div className="demo-badge">DEMO</div>
        )}
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
            {!isDemoMode && (
              <button className="btn-ghost mt-xs" onClick={loadDemo} style={{ width: '100%' }}>
                ↩ Carregar Demo
              </button>
            )}
          </section>

          <section className="sidebar-section">
            <h3 className="sidebar-title">Filtros</h3>
            <Filters
              periods={periods}
              regions={regions}
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
