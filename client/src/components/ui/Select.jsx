import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  required,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-bistre uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-status-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full bg-surface border ${
          error ? 'border-status-danger focus:border-status-danger' : 'border-chamoisee/35 focus:border-kobicha focus:ring-kobicha'
        } rounded-lg px-3.5 py-2 text-sm text-bistre transition-colors focus:outline-none focus:ring-1 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-bistre">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-status-danger mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
    </div>
  );
};

export default Select;
