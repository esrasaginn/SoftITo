import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../store/portfolioSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { items: projects, status: projectsStatus } = useSelector((state) => state.portfolio);

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
  }, [projectsStatus, dispatch]);

  // Izgarayı oluşturmak için üretilen 4 proje öğesini seç
  const featured = projects.filter(p => p.image);

  return (
    <div className="pb-0">
      {/* 1. Geniş Karşılama (Hero) Görsel Alanı */}
      <section className="position-relative py-0 overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        {/* Tasarıma uyumlu gün batımı mimari villa arka plan görseli */}
        <div className="position-absolute top-0 start-0 w-100 h-100 z-0" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(/assets/luxury_villa_dusk.png)',
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
        </div>
        
        <div className="container position-relative z-3 my-5 py-5 text-white">
          <div className="row">
            <div className="col-lg-7 bg-dark bg-opacity-75 p-5 border-start border-3" style={{ borderLeftColor: 'var(--color-terracotta) !important' }}>
              <h1 className="display-4 fw-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.2' }}>
                Mekânın Ruhunu Şekillendiren Modern Dokunuşlar.
              </h1>
              <p className="lead fs-6 text-white-50 mb-5" style={{ lineHeight: '1.8' }}>
                Yapısal rasyonalizm ile modern estetiği buluşturan, insan odaklı mekân tasarımları. Çevresiyle diyalog kuran prestijli mimari çözümler.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/projects" className="btn btn-primary-sharp border-white bg-white text-dark">
                  Çalışmalarımızı Keşfedin
                </Link>
                <Link to="/contact" className="btn btn-secondary-sharp border-white text-white">
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Estetik ve Fonksiyonun Mimari Buluşması */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="row mb-5 py-3 border-bottom">
            <div className="col-md-8">
              <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
                [ YAKLAŞIMIMIZ ]
              </span>
              <h2 className="display-6 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Estetik ve Fonksiyonun Mimari Buluşması.
              </h2>
            </div>
            <div className="col-md-4 d-flex align-items-end justify-content-md-end mt-3 mt-md-0">
              <p className="text-secondary fs-7 mb-0">
                Tasarımın her ölçeğinde konseptten anahtar teslim imalata kadar tutarlı bir süreç.
              </p>
            </div>
          </div>
          
          <div className="row g-4 text-start">
            <div className="col-md-4 border-end border-opacity-10 pe-md-4">
              <span className="text-secondary font-monospace fs-7 mb-2 d-block">01 / KONSEPT PLANLAMA</span>
              <h3 className="h5 fw-bold text-uppercase tracking-wide mb-3">Mimari Rasyonalizm</h3>
              <p className="text-secondary fs-7 mb-0" style={{ lineHeight: '1.7' }}>
                Arazi ve çevre verilerini parametrik analizlerle harmanlayarak fonksiyonel yerleşim planları ve strüktürel formlar üretiyoruz.
              </p>
            </div>
            <div className="col-md-4 border-end border-opacity-10 px-md-4">
              <span className="text-secondary font-monospace fs-7 mb-2 d-block">02 / İÇ MİMARİ & DETAY</span>
              <h3 className="h5 fw-bold text-uppercase tracking-wide mb-3">Detay Hassasiyeti</h3>
              <p className="text-secondary fs-7 mb-0" style={{ lineHeight: '1.7' }}>
                Malzemelerin dürüstlüğünü vurgulayan, brutalist beton dokuları, ahşap sıcaklığı ve metal birleşim detaylarını lüks bir uyumla işliyoruz.
              </p>
            </div>
            <div className="col-md-4 ps-md-4">
              <span className="text-secondary font-monospace fs-7 mb-2 d-block">03 / KENTSEL TASARIM</span>
              <h3 className="h5 fw-bold text-uppercase tracking-wide mb-3">Çevresel Bütünlük</h3>
              <p className="text-secondary fs-7 mb-0" style={{ lineHeight: '1.7' }}>
                Kent mobilyaları, modüler donatılar ve kamusal alan canlandırma projeleriyle yapıları çevreleriyle kopmaz bağlarla bağlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seçilmiş Eserler Izgara Düzeni */}
      <section className="py-5 bg-light bg-opacity-50">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center text-md-start">
              <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
                [ PORTFOLYO ]
              </span>
              <h2 className="display-6 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Seçilmiş Eserler
              </h2>
            </div>
          </div>
          
          <div className="row g-4">
            {featured.slice(0, 4).map((project, idx) => (
              <div key={project.id} className="col-md-6">
                <div className="card border-0 bg-transparent h-100 scale-hover">
                  <div 
                    style={{ 
                      backgroundImage: `url(${project.image})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      height: idx % 2 === 0 ? '450px' : '360px' // Şablonla uyumlu asimetrik yükseklikler!
                    }}
                    className="border"
                  ></div>
                  <div className="pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="font-monospace text-uppercase tracking-widest text-secondary fs-8 mb-1 d-block">
                          {project.category}
                        </span>
                        <h4 className="fw-semibold text-uppercase fs-6 m-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {project.title}
                        </h4>
                      </div>
                      <Link to={`/projects/${project.id}`} className="btn btn-sm btn-outline-indigo text-uppercase tracking-wider">
                        İncele
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tam Genişlikte Siyah Ortaklık/CTA Bandı */}
      <section className="black-cta-banner py-5 text-center border-top border-bottom">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="text-uppercase tracking-widest font-monospace fs-8 mb-3 d-block text-secondary">
                [ ORTAKLIK VE PROJELER ]
              </span>
              <h2 className="display-5 text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sıradaki Başyapıtınızı Beraber Kurgulayalım.
              </h2>
              <p className="text-secondary fs-6 mb-5" style={{ maxStyleWidth: '500px', margin: '0 auto', lineHeight: '1.8' }}>
                Tasarım detaylarında mükemmelliği arayan, çevreyle diyalog kuran ve prestij katan projeleriniz için bizimle iletişime geçin.
              </p>
              <Link to="/quote" className="btn btn-primary-sharp bg-white text-dark border-white py-3 px-5 text-uppercase tracking-wider">
                TEKLİF ALIN
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
