import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/portfolioSlice';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';

export default function Projects() {
  const dispatch = useDispatch();
  const { items: projects, status, error } = useSelector((state) => state.portfolio);
  const [activeCategory, setActiveCategory] = useState('Hepsi');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const categories = ['Hepsi', 'Mimari Tasarım', 'Ürün Tasarımı', 'Ambalaj Tasarımı'];

  const filteredProjects = activeCategory === 'Hepsi'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Large spotlight project at the bottom (e.g. Levh-i Mahfuz)
  const spotlightProject = projects.find(p => p.id === "1");

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
            [ PORTFOLYO GALERİSİ ]
          </span>
          <h1 className="display-5 fw-light mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Projelerimiz
          </h1>
          <p className="text-secondary mb-0 mx-auto" style={{ maxWidth: '500px', lineHeight: '1.6', fontSize: '0.9rem' }}>
            Mimari rasyonalizm, ergonomik ürünler ve lüks ambalaj detaylarının bir araya geldiği seçkin eserler arşivimiz.
          </p>
        </div>
      </div>

      {/* Category Filter - Inline Editorial Text Style */}
      <div className="row mb-5 justify-content-center">
        <div className="col-auto">
          <div className="d-flex flex-wrap gap-3 gap-md-4 justify-content-center font-monospace uppercase fs-8">
            {categories.map((cat, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-muted opacity-50 select-none">/</span>}
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`btn p-0 border-0 bg-transparent text-uppercase tracking-wider fw-semibold ${activeCategory === cat ? 'text-dark fw-bold border-bottom border-dark' : 'text-secondary'}`}
                  style={{
                    fontSize: '0.75rem',
                    borderRadius: '0px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {status === 'loading' && (
        <div className="d-flex justify-content-center my-5 py-5">
          <div className="spinner-border text-secondary" role="status" style={{ borderRightColor: 'var(--color-terracotta)' }}>
            <span className="visually-hidden">Yükleniyor...</span>
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

      {/* Asymmetrical Masonry-style Grid */}
      {status === 'succeeded' && (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center text-secondary py-5 bg-glass p-5 border">
              <i className="bi bi-folder2-open display-4 mb-3 d-block"></i>
              <span className="font-monospace">[ BU KATEGORİDE PROJE BULUNMADI ]</span>
            </div>
          ) : (
            <div className="row g-4 align-items-start">
              {filteredProjects.map((project, idx) => (
                <div key={project.id} className={idx % 3 === 0 ? "col-lg-8" : "col-lg-4"}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}

          {/* Full-width visual banner at the bottom (representing the 3rd mockup column wide visual) */}
          {spotlightProject && activeCategory === 'Hepsi' && (
            <div className="row mt-5 pt-4">
              <div className="col-12">
                <div className="card bg-glass border-0 overflow-hidden position-relative" style={{ height: '360px' }}>
                  <div 
                    style={{ 
                      backgroundImage: `url(${spotlightProject.image})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      filter: 'brightness(70%)',
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      zIndex: 0
                    }}
                  ></div>
                  <div className="card-body position-relative z-3 d-flex flex-column justify-content-end p-4 p-md-5 text-white h-100">
                    <span className="badge text-uppercase tracking-widest text-dark bg-white mb-2 py-1.5 px-3 align-self-start font-monospace fs-8">
                      ÖNE ÇIKAN ENSTALASYON
                    </span>
                    <h3 className="display-6 fw-bold text-uppercase mb-2 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {spotlightProject.title}
                    </h3>
                    <p className="text-white-50 fs-7 mb-4 max-w-500">
                      Somerset House, Galleri 1'de sergilenen Parametrik Mimari ve Akustik Enstalasyon Projesi.
                    </p>
                    <Link to={`/projects/${spotlightProject.id}`} className="btn btn-primary-sharp border-white bg-white text-dark align-self-start">
                      Süreci Keşfedin
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <style>{`
        .max-w-500 {
          max-width: 500px;
        }
      `}</style>
    </div>
  );
}
