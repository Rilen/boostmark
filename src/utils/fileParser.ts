import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Product, ParsedData } from '../types';
import { ALL_PERIODS, ALL_REGIONS } from '../data/mockData';

// ─── LayoutPadrao Detection & Parsing ────────────────────────────────────────
//
// Estrutura do LayoutPadrao.xlsx (relatório "Mais Vendidos Por Quantidade"):
//
//   R0  – Nome da empresa + timestamp
//   R1  – "Mais Vendidos Por Quantidade"
//   R2  – "Período de DD/MM/AAAA à DD/MM/AAAA"
//   R3  – "Referente As Lojas: 1, 2, 3, ..."
//   R4  – Cabeçalho: [Produto, Descrição, , Valor Total, Qtd. Vendida,
//                      Forn. Últ. Compra, , Custo Últ. Comp., Est. Atual,
//                      Un. dia, Dias est., , Fabricante, ]
//   R5+ – Dados (até linha "Total")
//
// Índice das colunas relevantes:
//   0  = Código do produto (id externo)
//   1  = Descrição (name)
//   3  = Valor Total (revenue)
//   4  = Qtd. Vendida (unitsSold)
//   7  = Custo Últ. Comp. (price/cost)
//   8  = Est. Atual (stock)
//   9  = Un./dia (velocidade de saída – usamos para avgStock estimado)
//   10 = Dias de estoque (= stock / unidades_dia)
//   12 = Fabricante (category)
//
// "Região" e "Período" são extraídos do cabeçalho do relatório ou definidos
//  pela loja/período informados nas linhas de metadado.

const LAYOUT_PADRAO_HEADER_INDICATORS = ['produto', 'descrição', 'valor total', 'qtd. vendida'];

interface LayoutPadraoMeta {
    empresa: string;
    periodo: string;
    lojas: string;
    dataExtracao: string;
}

function detectLayoutPadrao(rows: unknown[][]): boolean {
    // Check row 4 (header row) for the characteristic columns
    const headerRow = rows[4] as string[];
    if (!headerRow || headerRow.length < 4) return false;
    const normalized = headerRow.map((c) => String(c).toLowerCase().trim());
    return LAYOUT_PADRAO_HEADER_INDICATORS.every((indicator) =>
        normalized.some((col) => col.includes(indicator))
    );
}

function extractLayoutPadraoMeta(rows: unknown[][]): LayoutPadraoMeta {
    const empresa = String(rows[0]?.[0] ?? '').trim();
    const dataStr = String(rows[0]?.[11] ?? '').trim();
    const periodoRaw = String(rows[2]?.[0] ?? '').trim();
    const lojasRaw = String(rows[3]?.[0] ?? '').trim();
    return { empresa, periodo: periodoRaw, lojas: lojasRaw, dataExtracao: dataStr };
}

function parsePeriodoLabel(periodoStr: string): string {
    // "Período de 04/03/2026 à 07/03/2026" → "Mar/26"
    const match = periodoStr.match(/(\d{2})\/(\d{2})\/(\d{4})/g);
    if (!match || match.length === 0) return periodoStr;
    const lastDate = match[match.length - 1]; // end date
    const [, mm, yy] = lastDate.match(/(\d{2})\/(\d{2})\/(\d{4})/) ?? [];
    if (!mm || !yy) return periodoStr;
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(mm) - 1]}/${yy.slice(2)}`;
}

function parseLojaLabel(lojasStr: string): string {
    // "Referente As Lojas: 1, 2, 3" → "Loja 1-3" or "Todas as Lojas"
    const match = lojasStr.match(/Lojas?:\s*(.+)/i);
    if (!match) return 'Geral';
    const lojas = match[1].trim();
    const ids = lojas.split(',').map((s) => s.trim());
    if (ids.length === 1) return `Loja ${ids[0]}`;
    return `Lojas ${ids[0]}-${ids[ids.length - 1]}`;
}

function parseLayoutPadraoRows(rows: unknown[][], meta: LayoutPadraoMeta): Product[] {
    const products: Product[] = [];
    const periodo = parsePeriodoLabel(meta.periodo);
    const region = parseLojaLabel(meta.lojas);

    // Data rows start at index 5 (after header at index 4)
    for (let i = 5; i < rows.length; i++) {
        const row = rows[i] as (string | number)[];

        // Stop at "Total" row or empty rows
        const firstCell = String(row[0] ?? '').trim().toLowerCase();
        if (firstCell === 'total' || firstCell === '' || firstCell === 'undefined') continue;

        // Skip rows where code is not numeric
        const code = String(row[0] ?? '').trim();
        if (!code || isNaN(Number(code))) continue;

        const name = String(row[1] ?? '').trim();
        if (!name) continue;

        const revenue = parseFloat(String(row[3])) || 0;
        const unitsSold = parseFloat(String(row[4])) || 0;
        const cost = parseFloat(String(row[7])) || 0;  // Custo Últ. Compra
        const stock = parseFloat(String(row[8])) || 0;  // Est. Atual
        const unidadesDia = parseFloat(String(row[9])) || 0; // Un./dia (saída diária)
        const diasEstoque = parseFloat(String(row[10])) || 0; // Dias de estoque
        const manufacturer = String(row[12] ?? '').trim() || 'Desconhecido';

        // Derived fields:
        // avgStock: se temos unidades/dia e período de 3 dias → média no período
        // Usamos diasEstoque * unidadesDia como proxy do estoque médio histórico
        // Fallback: avg = stock * 1.2 se não tiver unidades/dia
        const avgStock = unidadesDia > 0 && diasEstoque > 0
            ? Math.round(unidadesDia * diasEstoque)
            : stock > 0 ? Math.round(stock * 1.2) : 1;

        // price: receita / qtd ou custo se receita não disponível
        const price = unitsSold > 0 ? revenue / unitsSold : cost || 1;

        products.push({
            id: `${code}-${region}-${periodo}-${i}`,
            name,
            region,
            category: manufacturer,
            revenue,
            unitsSold,
            stock,
            avgStock,
            price,
            period: periodo,
            // Extended fields stored in optional properties:
            unidadesDia,
            diasEstoque,
            cost,
            codigoProduto: code,
        } as Product);
    }

    return products;
}

// ─── Generic Column Mapping (fallback for custom layouts) ─────────────────────

const REQUIRED_GENERIC_COLS = ['name', 'region', 'revenue', 'unitssold', 'stock', 'avgstock', 'price', 'period'];

function normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[\s_\-\.]/g, '');
}

function mapGenericRow(row: Record<string, string>): Product | null {
    const normalized: Record<string, string> = {};
    Object.keys(row).forEach((k) => {
        normalized[normalizeKey(k)] = row[k];
    });

    for (const col of REQUIRED_GENERIC_COLS) {
        if (normalized[col] === undefined || normalized[col] === '') return null;
    }

    return {
        id: `${normalized['name']}-${normalized['region']}-${normalized['period']}-${Math.random()}`,
        name: normalized['name'],
        region: normalized['region'],
        category: normalized['category'] || undefined,
        revenue: parseFloat(normalized['revenue']) || 0,
        unitsSold: parseFloat(normalized['unitssold']) || 0,
        stock: parseFloat(normalized['stock']) || 0,
        avgStock: parseFloat(normalized['avgstock']) || 0,
        price: parseFloat(normalized['price']) || 0,
        period: normalized['period'],
    };
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

export async function parseCSV(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const products: Product[] = [];
                results.data.forEach((row) => {
                    const p = mapGenericRow(row);
                    if (p) products.push(p);
                });
                const periods = [...new Set(products.map((p) => p.period))];
                const regions = [...new Set(products.map((p) => p.region))];
                const categories = [...new Set(products.map((p) => p.category).filter(Boolean) as string[])];
                resolve({ products, periods, regions, categories });
            },
            error: (err) => reject(err),
        });
    });
}

// ─── XLSX Parser ──────────────────────────────────────────────────────────────

export async function parseXLSX(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Try each sheet; prefer the one with recognizable data
                for (const sheetName of workbook.SheetNames) {
                    const sheet = workbook.Sheets[sheetName];

                    // Read as raw array for layout detection
                    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
                        header: 1,
                        defval: '',
                    });

                    // ── LayoutPadrao detection ──────────────────────────────────────
                    if (detectLayoutPadrao(rawRows)) {
                        const meta = extractLayoutPadraoMeta(rawRows);
                        const products = parseLayoutPadraoRows(rawRows, meta);
                        if (products.length > 0) {
                            const periods = [...new Set(products.map((p) => p.period))];
                            const regions = [...new Set(products.map((p) => p.region))];
                            const categories = [...new Set(products.map((p) => p.category).filter(Boolean) as string[])];
                            resolve({ products, periods, regions, categories, layoutPadraoMeta: meta } as ParsedData & { layoutPadraoMeta: LayoutPadraoMeta });
                            return;
                        }
                    }

                    // ── Generic column-header layout ────────────────────────────────
                    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
                        defval: '',
                    });
                    const products: Product[] = [];
                    rows.forEach((row) => {
                        const p = mapGenericRow(row);
                        if (p) products.push(p);
                    });
                    if (products.length > 0) {
                        const periods = [...new Set(products.map((p) => p.period))];
                        const regions = [...new Set(products.map((p) => p.region))];
                        const categories = [...new Set(products.map((p) => p.category).filter(Boolean) as string[])];
                        resolve({ products, periods, regions, categories });
                        return;
                    }
                }

                reject(new Error('Nenhum dado reconhecido no arquivo. Verifique o formato.'));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// ─── Unified entry point ──────────────────────────────────────────────────────

export async function parseFile(file: File): Promise<ParsedData> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') return parseCSV(file);
    if (ext === 'xlsx' || ext === 'xls') return parseXLSX(file);
    throw new Error('Formato não suportado. Use CSV ou XLSX.');
}

// ─── Template CSV download ────────────────────────────────────────────────────

export function generateCSVTemplate(): string {
    const rows: string[] = ['name,region,category,revenue,unitsSold,stock,avgStock,price,period'];
    const names = ['Produto Alpha', 'Produto Beta'];
    const regions = ALL_REGIONS.slice(0, 2);
    const periods = ALL_PERIODS.slice(0, 2);

    names.forEach((name) => {
        regions.forEach((region) => {
            periods.forEach((period) => {
                const revenue = Math.round(Math.random() * 50000 + 5000);
                const price = Math.round(Math.random() * 50 + 10);
                const units = Math.round(revenue / price);
                const avg = Math.round(units * 1.2);
                const stock = Math.round(avg * 0.8);
                rows.push([name, region, 'Bebidas', revenue, units, stock, avg, price, period].join(','));
            });
        });
    });
    return rows.join('\n');
}

// ─── Exports for type ────────────────────────────────────────────────────────
export type { LayoutPadraoMeta };
