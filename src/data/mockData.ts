import type { Product } from '../types';

const regions = ['Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'];
const categories = ['Bebidas', 'Snacks', 'Laticínios', 'Higiene', 'Limpeza'];
const periods = ['Jan/25', 'Fev/25', 'Mar/25', 'Abr/25', 'Mai/25', 'Jun/25'];

const productNames = [
    'Produto Alpha', 'Produto Beta', 'Produto Gamma', 'Produto Delta',
    'Produto Epsilon', 'Produto Zeta', 'Produto Eta', 'Produto Theta',
    'Produto Iota', 'Produto Kappa', 'Produto Lambda', 'Produto Mu',
    'Produto Nu', 'Produto Xi', 'Produto Omicron', 'Produto Pi',
    'Produto Rho', 'Produto Sigma', 'Produto Tau', 'Produto Upsilon',
];

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export function generateMockProducts(): Product[] {
    const rand = seededRandom(42);
    const products: Product[] = [];

    productNames.forEach((name, pi) => {
        regions.forEach((region, ri) => {
            periods.forEach((period, peri) => {
                const baseRevenueFactor = pi < 5 ? 8 : pi < 12 ? 4 : 1.5;
                const revenue = Math.round((rand() * 50000 + 10000) * baseRevenueFactor);
                const price = Math.round(rand() * 80 + 20);
                const unitsSold = Math.round(revenue / price);
                const avgStock = Math.round(unitsSold * (0.5 + rand() * 1.5));

                // Inject anomalies for interesting alerts
                let stock = Math.round(avgStock * (0.7 + rand() * 0.6));
                if (pi === 3 && ri === 1) stock = Math.round(unitsSold * 0.05); // ruptura
                if (pi === 14 && ri === 3) stock = Math.round(unitsSold * 5.0); // encalhe

                products.push({
                    id: `${pi}-${ri}-${peri}`,
                    name,
                    region,
                    category: categories[pi % categories.length],
                    revenue: pi === 3 && ri === 1 ? revenue * 0.15 : pi === 14 && ri === 3 ? revenue * 0.1 : revenue,
                    unitsSold: pi === 3 && ri === 1 ? Math.round(unitsSold * 0.1) : pi === 14 && ri === 3 ? Math.round(unitsSold * 0.08) : unitsSold,
                    stock,
                    avgStock,
                    price,
                    period,
                });
            });
        });
    });

    return products;
}

export const MOCK_PRODUCTS = generateMockProducts();
export const ALL_PERIODS = [...periods];
export const ALL_REGIONS = [...regions];
