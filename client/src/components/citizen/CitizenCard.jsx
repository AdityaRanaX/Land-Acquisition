import React from 'react';

export const CitizenCard = ({ children, className = '', title, subtitle, action }) => (
  <section className={`citizen-card ${className}`}>
    {(title || subtitle || action) && (
      <div className="citizen-card-header">
        <div>
          {title && <h2 className="citizen-section-title">{title}</h2>}
          {subtitle && <p className="citizen-section-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="citizen-card-body">{children}</div>
  </section>
);

export const CitizenPageHeader = ({ title, subtitle, children }) => (
  <header className="citizen-page-header">
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
    {children}
  </header>
);

export const CitizenStatus = ({ status }) => {
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`citizen-status citizen-status-${statusClass}`}>{status}</span>;
};

export default CitizenCard;
