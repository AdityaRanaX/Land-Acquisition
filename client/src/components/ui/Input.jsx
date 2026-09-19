import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-bistre uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-status-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-chamoisee">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full bg-surface border ${
            error ? 'border-status-danger focus:border-status-danger focus:ring-status-danger' : 'border-chamoisee/35 focus:border-kobicha focus:ring-kobicha'
          } rounded-lg px-3.5 py-2 text-sm text-bistre placeholder-text-muted/60 transition-colors focus:outline-none focus:ring-1 ${
            Icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-status-danger mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
