import React from 'react';

// Format currency in Indian Rupees format (e.g. ₹ 66,065)
function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

export default function StatCard({ label, value, subtext, isCurrency = false }) {
  const displayValue = isCurrency ? formatCurrency(value) : value.toLocaleString('en-IN');

  return (
    <article className="statCard" aria-label={label}>
      <h2 className="statLabel">{label}</h2>
      <div className="statValue">{displayValue}</div>
      {subtext && <div className="statSubtext">{subtext}</div>}
    </article>
  );
}
