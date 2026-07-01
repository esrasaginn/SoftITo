import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  // Prestijli görünmesi için kategoriye göre farklı bir geometrik/blueprint tasarımı oluştur
  const getCategoryHeaderStyle = (category) => {
    let backgroundStyle = '';
    
    if (category === 'Mimari Tasarım') {
      backgroundStyle = `
        linear-gradient(rgba(32, 46, 63, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(32, 46, 63, 0.08) 1px, transparent 1px),
        linear-gradient(rgba(244, 130, 28, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244, 130, 28, 0.15) 1px, transparent 1px)
      `;
      return {
        background: backgroundStyle,
        backgroundSize: '15px 15px, 15px 15px, 60px 60px, 60px 60px',
        backgroundColor: 'rgba(32, 46, 63, 0.05)',
        height: '140px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative'
      };
    } else if (category === 'Ürün Tasarımı') {
      backgroundStyle = `
        radial-gradient(circle, transparent 20%, rgba(32, 46, 63, 0.03) 21%, transparent 22%),
        radial-gradient(circle, transparent 40%, rgba(32, 46, 63, 0.03) 41%, transparent 42%),
        radial-gradient(circle, transparent 60%, rgba(244, 130, 28, 0.08) 61%, transparent 62%),
        linear-gradient(to right, rgba(32, 46, 63, 0.05) 50%, transparent 50%),
        linear-gradient(to bottom, rgba(32, 46, 63, 0.05) 50%, transparent 50%)
      `;
      return {
        background: backgroundStyle,
        backgroundPosition: 'center',
        backgroundColor: 'rgba(32, 46, 63, 0.05)',
        height: '140px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative'
      };
    } else {
      // Ambalaj Tasarımı
      backgroundStyle = `
        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(32, 46, 63, 0.04) 10px, rgba(32, 46, 63, 0.04) 11px),
        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(244, 130, 28, 0.08) 10px, rgba(244, 130, 28, 0.08) 11px)
      `;
      return {
        background: backgroundStyle,
        backgroundColor: 'rgba(32, 46, 63, 0.05)',
        height: '140px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative'
      };
    }
  };

  const getHeaderStyle = () => {
    if (project.image) {
      return {
        backgroundImage: `url(${project.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '180px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative'
      };
    }
    return getCategoryHeaderStyle(project.category);
  };

  return (
    <div className="col">
      <div className="card h-100 bg-glass scale-hover border-0">
        {/* Dinamik Mimari Grafik Başlığı */}
        <div style={getHeaderStyle()} className="d-flex align-items-center justify-content-center">
          <div className="position-absolute bottom-0 start-0 p-2">
            <span className="badge text-uppercase tracking-widest text-white" style={{ backgroundColor: 'var(--color-terracotta)', fontSize: '0.65rem', fontWeight: 700 }}>
              {project.category}
            </span>
          </div>
          {/* CAD çizgilerini temsil eden hafif artı işareti - yalnızca görsel yoksa gösterilir */}
          {!project.image && (
            <div className="text-secondary opacity-50 fw-light select-none text-center px-3" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
              [ SCALE 1:10 / {project.details?.year || '2025'} ]
            </div>
          )}
        </div>
        
        <div className="card-body d-flex flex-column p-4">
          <h4 className="card-title fw-bold fs-5 text-uppercase tracking-tight mb-2">
            {project.title}
          </h4>
          
          <div className="mb-3 text-secondary fs-7" style={{ fontFamily: 'monospace' }}>
            {project.client_studio && (
              <div className="mb-1">
                <i className="bi bi-building me-1"></i> {project.client_studio}
              </div>
            )}
            {project.role && (
              <div>
                <i className="bi bi-person me-1"></i> {project.role}
              </div>
            )}
          </div>
          
          <p className="card-text text-secondary fs-7 mb-4 flex-grow-1 text-truncate-3">
            {project.description}
          </p>
          
          <div className="mt-auto">
            <Link to={`/projects/${project.id}`} className="btn btn-outline-terracotta w-100">
              Detayları İncele
            </Link>
          </div>
        </div>
      </div>
      
      {/* Satır kısaltmalarını destekleyen yerleşik stiller */}
      <style>{`
        .text-truncate-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
