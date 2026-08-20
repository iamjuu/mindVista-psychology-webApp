import React from 'react';

export default function ProfessionalCard({ doctor, onBookClick }) {
  if (!doctor) return null;

  const isAyurveda =
    doctor.professionalType === 'AYURVEDA_DOCTOR' ||
    (doctor.specialization || '').toLowerCase().includes('ayurved') ||
    (doctor.specialization || '').toLowerCase().includes('bams');

  const disciplineLabel = isAyurveda ? 'Ayurveda' : 'Psychology';
  const price = doctor.consultation?.price || 599;
  const duration = doctor.consultation?.durationMinutes || 45;

  const avatarUrl = doctor.profilePicture
    ? (doctor.profilePicture.startsWith('http')
        ? doctor.profilePicture
        : `http://localhost:3000${doctor.profilePicture}`)
    : (isAyurveda
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDivxIcLhtgFVf2pHWMiIqEnpCIRZePgL6gYayVM0exMH48ZFLR_DzwF-io3GxwBDODxW5Uy-7ggT92W4zZ-pYXkCpgeviDqCX3JvAQKLUAx4CGDtP69XhAAeOg855PgbP0Y8MI6JJLxWnCdPDiyidnr7i31Wl_KBX-s8vgIjgSFLN5oXHiJLmpWGA00emhop4bsxFZ_HU3CKgKYpKAM9v3GKbCZR3sUQHg-UtEX-Pqto2itKonPKxZ9w'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYTsKI8oOPBi8bNALKgMRcR4ANfQQp4YUTRYlkNcmBjv2dqX_O2OsESPyWxEjFiq24Wlrx4hxfgZxGyL6jMiOgN_vjEfGWlKUwRcPtABwIF35TC2B35PS-_FvUYKwtBQdwa3VgK5ZfVmR-psg6UTKsOpLPYgtqYBtc-3bU4i_XPdd2jww6YOKBzu59k3XmLZAtKU_RDtXiFMLn0qFAjOb38nEiP8uTEXuOACIAT7CAEZKhABpB1h5otg');

  const defaultTags = isAyurveda ? ['Stress Management', 'Gut Health'] : ['Anxiety Relief', 'CBT Counseling'];
  const tags = (doctor.specialities && doctor.specialities.length > 0)
    ? doctor.specialities.slice(0, 2)
    : defaultTags;

  return (
    <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0px_4px_20px_rgba(44,62,45,0.05)] border border-surface-variant hover:shadow-[0px_12px_32px_rgba(44,62,45,0.08)] transition-all group flex flex-col h-full">
      {/* Header with Photo and Discipline Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-surface"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4a654e&color=fff&size=160`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-fixed rounded-full border-2 border-surface-container-lowest" />
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-bold ${
            isAyurveda
              ? 'bg-primary-fixed text-on-primary-fixed-variant'
              : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
          }`}
        >
          {disciplineLabel}
        </span>
      </div>

      {/* Doctor Name & Qualifications */}
      <h3 className="font-headline text-[20px] leading-tight text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors">
        {doctor.name}
      </h3>
      <p className="text-[14px] text-on-surface-variant mb-4">
        {doctor.specialization || (isAyurveda ? 'Ayurvedic Physician' : 'Clinical Psychologist')} • {(doctor.qualifications || []).join(', ') || (isAyurveda ? 'BAMS, MD' : 'M.Phil')}
      </p>

      {/* Focus Area Tags */}
      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="border border-outline-variant px-3 py-1 rounded-full text-[12px] text-on-surface-variant font-medium bg-surface-container-low"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Price & Book Action */}
      <div className="pt-4 border-t border-surface-variant flex justify-between items-center">
        <div className="font-headline font-bold text-lg text-primary">
          ₹{price} <span className="text-xs font-normal text-on-surface-variant">/ {duration} mins</span>
        </div>
        <button
          onClick={() => onBookClick(doctor)}
          className="text-secondary group-hover:bg-secondary-container group-hover:text-on-secondary-container px-4 py-2 rounded-full transition-colors text-[13px] font-bold"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}
