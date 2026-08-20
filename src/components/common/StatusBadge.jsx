import React from 'react';

const STATUS_CONFIG = {
  // Appointment statuses
  PENDING_PAYMENT: { label: 'Pending Payment', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  confirmed: { label: 'Confirmed', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  COMPLETED: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  completed: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  declined: { label: 'Declined', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  NO_SHOW: { label: 'No Show', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },

  // Payment statuses
  PAID: { label: '₹599 Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  FAILED: { label: 'Payment Failed', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },

  // Prescription statuses
  DRAFT: { label: 'Draft', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  PUBLISHED: { label: 'Prescription Ready', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

export default function StatusBadge({ status, className = '' }) {
  const norm = (status || '').toUpperCase();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[norm] || {
    label: status || 'Unknown',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {config.label}
    </span>
  );
}
