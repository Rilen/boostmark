import type { FilterState } from '../../types';
import { Calendar, MapPin } from 'lucide-react';

interface FiltersProps {
    periods: string[];
    regions: string[];
    filters: FilterState;
    onChange: (f: FilterState) => void;
}

export function Filters({ periods, regions, filters, onChange }: FiltersProps) {
    return (
        <div className="filters">
            <div className="filter-group">
                <label><Calendar size={13} /> Período</label>
                <select
                    value={filters.period}
                    onChange={(e) => onChange({ ...filters, period: e.target.value })}
                >
                    <option value="all">Todos os períodos</option>
                    {periods.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label><MapPin size={13} /> Região</label>
                <select
                    value={filters.region}
                    onChange={(e) => onChange({ ...filters, region: e.target.value })}
                >
                    <option value="all">Todas as regiões</option>
                    {regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
