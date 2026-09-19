import React from 'react';

const variants = {
  primary: 'bg-kobicha hover:bg-[#866141] text-white shadow-sm border border-kobicha',
  secondary: 'bg-taupe hover:bg-[#382f27] text-white border border-taupe shadow-sm',
  outline: 'bg-white hover:bg-buff/20 text-bistre border border-chamoisee/40 hover:border-kobicha',
  ghost: 'bg-transparent hover:bg-buff/20 text-bistre',
  danger: 'bg-status-danger hover:bg-[#8e3f35] text-white border border-status-danger shadow-sm',
  success: 'bg-status-success hover:bg-[#5a683f] text-white border border-status-success shadow-sm',
  buff: 'bg-buff/30 hover:bg-buff/50 text-bistre border border-buff font-semibold'
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs rounded-lg font-medium',
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
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
