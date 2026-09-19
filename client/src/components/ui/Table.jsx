import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  keyField = '_id',
  emptyMessage = 'No records available in this view',
  onRowClick,
  className = '',
  sortable = true
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-chamoisee/25 bg-surface ${className}`}>
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-[#F6F2EA] text-xs font-semibold text-bistre uppercase tracking-wider border-b border-chamoisee/20">
          <tr>
            {columns.map((col, idx) => {
              const isColSortable = sortable && col.sortable !== false && col.key;
              const isCurrentSort = sortKey === col.key;
              return (
                <th
                  key={col.key || idx}
                  onClick={() => isColSortable && handleSort(col.key)}
                  className={`px-4 py-3.5 ${isColSortable ? 'cursor-pointer select-none hover:bg-buff/20 transition-colors' : ''} ${col.headerClassName || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.title}</span>
                    {isColSortable && (
                      <span className="text-chamoisee">
                        {isCurrentSort ? (
                          sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-kobicha" /> : <ArrowDown className="w-3.5 h-3.5 text-kobicha" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-chamoisee/15 bg-surface">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-text-muted text-xs">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors hover:bg-buff/15 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className={`px-4 py-3.5 text-xs ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
