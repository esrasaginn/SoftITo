import React from 'react';

export default function TimelineItem({ title, subtitle, period, description, details, tags }) {
  return (
    <div className="position-relative mb-5 timeline-container">
      {/* Node indicator */}
      <div className="timeline-node"></div>
      
      <div className="card bg-glass border-0 p-4 shadow-sm">
        <div className="row align-items-center mb-3">
          <div className="col-lg-8">
            <h4 className="fw-bold text-uppercase tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h4>
            <div className="text-secondary fw-semibold fs-6" style={{ color: 'var(--color-safir)' }}>
              {subtitle}
            </div>
          </div>
          <div className="col-lg-4 text-lg-end mt-2 mt-lg-0">
            <span className="badge text-uppercase tracking-widest px-3 py-2 text-white font-monospace" style={{ backgroundColor: 'var(--color-terracotta)', fontSize: '0.75rem', fontWeight: 600 }}>
              {period}
            </span>
          </div>
        </div>
        
        {description && (
          <p className="text-secondary fs-7 mb-3" style={{ lineHeight: '1.6' }}>
            {description}
          </p>
        )}
        
        {details && (
          <div className="text-secondary fs-7 mb-3 border-start border-2 ps-3 font-monospace" style={{ borderLeftColor: 'var(--color-safir) !important' }}>
            {details}
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="badge font-monospace text-uppercase py-1.5 px-2.5 fs-8 text-secondary border border-secondary"
                style={{ background: 'transparent' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .fs-8 {
          font-size: 0.68rem;
        }
      `}</style>
    </div>
  );
}
