import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExperienceData } from '../store/experienceSlice';
import TimelineItem from '../components/TimelineItem';

export default function About() {
  const dispatch = useDispatch();
  const { experiences, education, status, error } = useSelector((state) => state.experience);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExperienceData());
    }
  }, [status, dispatch]);

  return (
    <div className="pb-0">
      <div className="container py-5">
        {/* 1. Giriş Alanı (Hakkımızda) */}
        <section className="mb-5 py-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
                [ BİYOGRAFİ & FELSEFE ]
              </span>
              <h1 className="display-5 fw-light mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.2' }}>
                Mimari Vizyonun Sessiz Otoritesi.
              </h1>
              
              {/* Soyut geometriyi temsil eden dikey görsel */}
              <div 
                className="border overflow-hidden mb-4 mb-lg-0" 
                style={{ 
                  backgroundImage: 'url(/assets/levh_i_mahfuz.png)', 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  height: '420px' 
                }}
              ></div>
            </div>
            
            <div className="col-lg-6 ps-lg-5">
              <h3 className="fw-bold text-uppercase fs-6 font-monospace text-secondary mb-3">[ HİKAYEMİZ ]</h3>
              <p className="text-secondary fs-6 mb-4" style={{ lineHeight: '1.8' }}>
                ESTRUCTURA Mimarlık, Esra Sağın tarafından malzemenin saf dürüstlüğü ve strüktürel zayıflığı ortadan kaldıran geometrik kararlılık üzerine kurulmuştur. İstanbul Medipol Üniversitesi Mimarlık ve Endüstri Ürünleri Tasarımı Çift Anadal Programını yüksek başarı dereceleriyle bitiren Esra Sağın, tasarıma disiplinlerarası bir derinlikle yaklaşmaktadır.
              </p>
              <p className="text-secondary fs-6 mb-4" style={{ lineHeight: '1.8' }}>
                Sergi tasarımından kentsel donatılara, tüketici elektroniği CMF kararlarından geniş ölçekli bina planlamasına kadar uzanan süreçte, lüks detay kontrolü ve malzeme uyumunu ana hedefimiz olarak kabul ediyoruz.
              </p>
              <p className="text-secondary fs-6 mb-0" style={{ lineHeight: '1.8' }}>
                Melek Zeynep Studio ile ortaklaşa yürüttüğümüz 2025 Londra Tasarım Bienali Türkiye Pavyonu "Levh-i Mahfuz" enstalasyonu, mekânsal algıyı sorgulayan parametrik ve akustik detay tecrübemizin zirvesini temsil etmektedir.
              </p>
            </div>
          </div>
        </section>

        {/* 2. İstatistikler / Kilometre Taşları Izgarası */}
        <section className="py-5 my-4 border-top border-bottom">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <h3 className="display-4 fw-light font-monospace text-dark" style={{ color: 'var(--text-primary) !important' }}>8+</h3>
              <span className="text-secondary text-uppercase fs-8 font-monospace tracking-wide">Yıllık Tasarım Deneyimi</span>
            </div>
            <div className="col-md-4">
              <h3 className="display-4 fw-light font-monospace text-dark" style={{ color: 'var(--text-primary) !important' }}>50+</h3>
              <span className="text-secondary text-uppercase fs-8 font-monospace tracking-wide">Tamamlanmış Proje</span>
            </div>
            <div className="col-md-4">
              <h3 className="display-4 fw-light font-monospace text-dark" style={{ color: 'var(--text-primary) !important' }}>12+</h3>
              <span className="text-secondary text-uppercase fs-8 font-monospace tracking-wide">Ulusal & Uluslararası Ödül</span>
            </div>
          </div>
        </section>

        {/* 3. Ekip ve Çözüm Ortakları Izgarası */}
        <section className="py-5 mb-5">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
                [ STRATEJİK EKİP ]
              </span>
              <h2 className="display-6 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tasarım Ekibimiz & Çözüm Ortaklarımız
              </h2>
            </div>
          </div>
          
          <div className="row g-4">
            {/* Esra */}
            <div className="col-md-4">
              <div className="card bg-glass border p-4 text-center">
                <div className="bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', filter: 'grayscale(100%)' }}>
                  <i className="bi bi-person-fill fs-1 text-secondary"></i>
                </div>
                <h4 className="fw-bold text-uppercase fs-6 mb-1">Esra Sağın</h4>
                <span className="text-secondary fs-8 font-monospace text-uppercase" style={{ color: 'var(--color-terracotta)' }}>Kurucu & Mimar</span>
                <p className="text-secondary fs-7 mt-3 mb-0">Multidisipliner Tasarım Lideri</p>
              </div>
            </div>

            {/* Melek Zeynep */}
            <div className="col-md-4">
              <div className="card bg-glass border p-4 text-center">
                <div className="bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', filter: 'grayscale(100%)' }}>
                  <i className="bi bi-house-door-fill fs-1 text-secondary"></i>
                </div>
                <h4 className="fw-bold text-uppercase fs-6 mb-1">Melek Zeynep Studio</h4>
                <span className="text-secondary fs-8 font-monospace text-uppercase">Sanat Çözüm Ortağı</span>
                <p className="text-secondary fs-7 mt-3 mb-0">Uluslararası Sergi & Bienal Partneri</p>
              </div>
            </div>

            {/* İSTON */}
            <div className="col-md-4">
              <div className="card bg-glass border p-4 text-center">
                <div className="bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', filter: 'grayscale(100%)' }}>
                  <i className="bi bi-cone-striped fs-1 text-secondary"></i>
                </div>
                <h4 className="fw-bold text-uppercase fs-6 mb-1">İSTON A.Ş.</h4>
                <span className="text-secondary fs-8 font-monospace text-uppercase">İmalat Çözüm Ortağı</span>
                <p className="text-secondary fs-7 mt-3 mb-0">Prekast & Kent Donatıları Üreticisi</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Zaman Çizelgesi (Özgeçmiş / Kronoloji) */}
        <section className="py-4 border-top">
          <div className="row mb-5">
            <div className="col-12 text-center text-md-start">
              <h3 className="fw-bold text-uppercase fs-5 font-monospace text-secondary mb-2">[ ÖZGEÇMİŞ & KRONOLOJİ ]</h3>
            </div>
          </div>

          {/* Yükleme Durumları */}
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
              {/* Deneyimler */}
              <div className="col-lg-6">
                <h4 className="fw-bold text-uppercase fs-6 font-monospace mb-4 pb-2 border-bottom text-secondary">
                  [ MESLEKİ DENEYİM ]
                </h4>
                {experiences.map((exp) => (
                  <TimelineItem 
                    key={exp.id}
                    title={exp.role}
                    subtitle={exp.company}
                    period={exp.period}
                    description={exp.description}
                    tags={exp.skills}
                  />
                ))}
              </div>

              {/* Eğitim */}
              <div className="col-lg-6">
                <h4 className="fw-bold text-uppercase fs-6 font-monospace mb-4 pb-2 border-bottom text-secondary">
                  [ AKADEMİK EĞİTİM ]
                </h4>
                {education.map((edu, index) => (
                  <TimelineItem 
                    key={index}
                    title={edu.degree}
                    subtitle={edu.institution}
                    period={edu.years}
                    details={edu.details}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 5. Tam Genişlikte Siyah Eylem (CTA) Bandı */}
      <section className="black-cta-banner py-5 text-center border-top">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Hayalinizdeki mekânı birlikte inşa edelim.
              </h2>
              <p className="text-secondary fs-7 mb-4" style={{ maxStyleWidth: '500px', margin: '0 auto', lineHeight: '1.8' }}>
                Fikirlerinizi projelendirmek, iş birliği yapmak veya detaylı sunum talep etmek için bize hemen yazın.
              </p>
              <Link to="/contact" className="btn btn-primary-sharp bg-white text-dark border-white py-3 px-5 text-uppercase tracking-wider">
                BİZE YAZIN
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
