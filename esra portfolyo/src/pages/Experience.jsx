import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExperienceData } from '../store/experienceSlice';
import TimelineItem from '../components/TimelineItem';

export default function Experience() {
  const dispatch = useDispatch();
  const { experiences, education, status, error } = useSelector((state) => state.experience);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExperienceData());
    }
  }, [status, dispatch]);

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col-12 text-center text-md-start">
          <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
            [ KRONOLOJİ VE GEÇMİŞ ]
          </span>
          <h1 className="architect-heading text-uppercase fw-bold mt-1 mb-3">
            Deneyim & Eğitim
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            Mimari proje yönetimi, endüstriyel tasarım süreçleri ve disiplinlerarası akademik eğitim geçmişi.
          </p>
        </div>
      </div>

      {/* Loading States */}
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

      {status === 'succeeded' && (
        <div className="row g-5">
          {/* Work Experiences */}
          <div className="col-lg-6">
            <h3 className="fw-bold text-uppercase fs-5 font-monospace mb-4 pb-2 border-bottom text-secondary">
              [ KURUMSAL / MESLEKİ DENEYİM ]
            </h3>
            
            {experiences.length === 0 ? (
              <p className="text-secondary font-monospace fs-7">Kayıtlı deneyim bilgisi bulunmamaktadır.</p>
            ) : (
              experiences.map((exp) => (
                <TimelineItem 
                  key={exp.id}
                  title={exp.role}
                  subtitle={exp.company}
                  period={exp.period}
                  description={exp.description}
                  tags={exp.skills}
                />
              ))
            )}
          </div>

          {/* Academic Background */}
          <div className="col-lg-6">
            <h3 className="fw-bold text-uppercase fs-5 font-monospace mb-4 pb-2 border-bottom text-secondary">
              [ AKADEMİK GEÇMİŞ ]
            </h3>
            
            {education.length === 0 ? (
              <p className="text-secondary font-monospace fs-7">Kayıtlı eğitim bilgisi bulunmamaktadır.</p>
            ) : (
              education.map((edu, index) => (
                <TimelineItem 
                  key={index}
                  title={edu.degree}
                  subtitle={edu.institution}
                  period={edu.years}
                  details={edu.details}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
