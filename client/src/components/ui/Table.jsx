import React from 'react';

export const Table = ({
  columns = [],
  data = [],
  keyField = '_id',
  emptyMessage = 'No records found',
  onRowClick,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-800 ${className}`}>
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} className={`px-4 py-3 ${col.headerClassName || ''}`}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors hover:bg-slate-800/40 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className={`px-4 py-3.5 ${col.className || ''}`}>
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
