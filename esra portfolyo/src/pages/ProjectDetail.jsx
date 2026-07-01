import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, clearCurrentProject } from '../store/portfolioSlice';

export default function ProjectDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject: project, status, error } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch]);

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      {/* Geri Dön Butonu */}
      <div className="mb-4">
        <Link to="/projects" className="text-decoration-none text-secondary hover-terracotta font-monospace fs-7 text-uppercase tracking-wider">
          <i className="bi bi-chevron-left me-1"></i> [ Galeriye Dön ]
        </Link>
      </div>

      {/* Yükleme ve Hata Durumları */}
      {status === 'loading' && (
        <div className="d-flex justify-content-center my-5 py-5">
          <div className="spinner-border text-secondary" role="status" style={{ borderRightColor: 'var(--color-terracotta)' }}>
            <span className="visually-hidden">Proje yükleniyor...</span>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="alert alert-danger font-monospace py-4 border-2" role="alert">
          <h5 className="fw-bold mb-2">HATA OLUŞTU</h5>
          <p className="mb-0">
            {typeof error === 'object' ? (error.message || error.error || JSON.stringify(error)) : error}
          </p>
        </div>
      )}

      {status === 'succeeded' && project && (
        <div className="row g-5">
          {/* Ana Bilgiler */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge text-uppercase tracking-widest text-dark py-1.5 px-3" style={{ backgroundColor: 'var(--color-terracotta)', fontSize: '0.7rem', fontWeight: 700 }}>
                {project.category}
              </span>
              {project.exhibition && (
                <span className="badge text-uppercase tracking-widest border border-secondary text-secondary py-1.5 px-3 font-monospace" style={{ fontSize: '0.7rem' }}>
                  Sergilenmiş
                </span>
              )}
            </div>
            
            <h1 className="architect-heading text-uppercase display-5 fw-extrabold mb-4">
              {project.title}
            </h1>
            
            <h5 className="text-secondary fw-semibold text-uppercase font-monospace fs-7 mb-4">[ PROJE AÇIKLAMASI ]</h5>
            <p className="lead fs-6 text-secondary mb-5" style={{ lineHeight: '1.8' }}>
              {project.description}
            </p>
            
            {project.exhibition && (
              <div className="p-4 mb-4 border border-secondary border-opacity-25 bg-glass">
                <h6 className="fw-bold text-uppercase tracking-wider mb-2" style={{ color: 'var(--color-terracotta)', fontSize: '0.8rem' }}>
                  Sergileme Alanı / Etkinlik
                </h6>
                <p className="text-secondary fs-7 mb-0 font-monospace">
                  <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {project.exhibition}
                </p>
              </div>
            )}
          </div>

          {/* Teknik Özellikler Tablosu (Blueprint Detayları) */}
          <div className="col-lg-5">
            <div className="card bg-glass border-0 p-4 shadow-md">
              <h4 className="fw-bold text-uppercase font-monospace fs-6 mb-4 pb-2 border-bottom text-secondary">
                [ TEKNİK ŞARTNAME & DETAYLAR ]
              </h4>
              
              <div className="table-responsive">
                <table className="table table-borderless fs-7 mb-0 text-secondary align-middle">
                  <tbody>
                    <tr className="border-bottom border-secondary border-opacity-10">
                      <td className="fw-bold text-uppercase py-3 ps-0 font-monospace" style={{ width: '40%' }}>Proje Ofisi:</td>
                      <td className="py-3 font-monospace">{project.client_studio || 'Esra Sağın Stüdyo'}</td>
                    </tr>
                    <tr className="border-bottom border-secondary border-opacity-10">
                      <td className="fw-bold text-uppercase py-3 ps-0 font-monospace">Rol / Görev:</td>
                      <td className="py-3 font-monospace">{project.role}</td>
                    </tr>
                    {project.details?.year && (
                      <tr className="border-bottom border-secondary border-opacity-10">
                        <td className="fw-bold text-uppercase py-3 ps-0 font-monospace">İmalat Yılı:</td>
                        <td className="py-3 font-monospace">{project.details.year}</td>
                      </tr>
                    )}
                    {project.details?.dimensions && (
                      <tr className="border-bottom border-secondary border-opacity-10">
                        <td className="fw-bold text-uppercase py-3 ps-0 font-monospace">Boyutlar:</td>
                        <td className="py-3 font-monospace">{project.details.dimensions}</td>
                      </tr>
                    )}
                    {project.details?.materials && (
                      <tr className="border-bottom border-secondary border-opacity-10">
                        <td className="fw-bold text-uppercase py-3 ps-0 font-monospace">Malzemeler:</td>
                        <td className="py-3 font-monospace" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {project.details.materials}
                        </td>
                      </tr>
                    )}
                    {project.details?.process && (
                      <tr>
                        <td className="fw-bold text-uppercase py-3 ps-0 font-monospace">Üretim Metodu:</td>
                        <td className="py-3 font-monospace" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {project.details.process}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hover bağlantı rengini destekleyen yerleşik stil */}
      <style>{`
        .hover-terracotta:hover {
          color: var(--color-terracotta) !important;
        }
      `}</style>
    </div>
  );
}
