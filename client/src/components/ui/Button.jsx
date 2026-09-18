import React from 'react';

const variants = {
  primary: 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 border border-sky-400/30',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 border border-emerald-400/30',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 border border-rose-400/30',
  warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 border border-amber-400/30',
  ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
  outline: 'bg-transparent hover:bg-slate-800/40 text-slate-300 border border-slate-700 hover:border-slate-500'
};

const sizes = {
  sm: 'px-2.5 py-1 text-xs rounded-md font-medium',
  md: 'px-4 py-2 text-sm rounded-lg font-medium',
  lg: 'px-5 py-2.5 text-base rounded-xl font-semibold'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
