import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="pb-5">
      {/* 1. Full-width Grayscale Map Banner Placeholder */}
      <section className="bg-light border-bottom overflow-hidden position-relative" style={{ height: '240px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
             style={{ 
               backgroundColor: '#E5E7EB',
               backgroundImage: 'radial-gradient(#C3C5C9 1px, transparent 1px), radial-gradient(#C3C5C9 1px, #E5E7EB 1px)',
               backgroundSize: '24px 24px',
               backgroundPosition: '0 0, 12px 12px',
               filter: 'grayscale(100%) brightness(95%)'
             }}>
          <div className="text-center font-monospace text-secondary fs-8 bg-white py-2 px-4 border shadow-sm select-none">
            <i className="bi bi-geo-alt-fill me-2"></i> BÜYÜKDERE CD. NO:120, LEVENT / İSTANBUL
          </div>
        </div>
      </section>

      <div className="container py-5">
        {/* 2. Contact Split Columns Section */}
        <section className="mb-5 py-4">
          <div className="row g-5">
            {/* Left Column: Contact Info */}
            <div className="col-lg-5">
              <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
                [ İLETİŞİM ]
              </span>
              <h1 className="display-5 fw-light mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bizimle İletişime Geçin
              </h1>
              <p className="text-secondary fs-7 mb-5" style={{ lineHeight: '1.7' }}>
                Projeleriniz hakkında konuşmak, iş ortaklığı teklifleri iletmek veya stüdyomuzu ziyaret etmek için aşağıdaki kanalları kullanabilirsiniz.
              </p>

              <div className="mb-4 pb-3 border-bottom">
                <div className="text-secondary fs-8 font-monospace text-uppercase mb-1">Ofis Adresi</div>
                <span className="fw-semibold fs-6" style={{ color: 'var(--text-primary)' }}>
                  Büyükdere Cd. No:120, Levent, Şişli / İstanbul
                </span>
              </div>
              
              <div className="mb-4 pb-3 border-bottom">
                <div className="text-secondary fs-8 font-monospace text-uppercase mb-1">Telefon</div>
                <a href="tel:+902125553456" className="text-decoration-none fw-semibold fs-6 text-dark hover-indigo">
                  +90 (212) 555 34 56
                </a>
              </div>

              <div className="mb-4">
                <div className="text-secondary fs-8 font-monospace text-uppercase mb-1">E-Posta</div>
                <a href="mailto:contact@estructura.com" className="text-decoration-none fw-semibold fs-6 text-dark hover-indigo">
                  contact@estructura.com
                </a>
              </div>
            </div>

            {/* Right Column: Quick Form */}
            <div className="col-lg-7">
              <div className="card bg-glass border-0 p-4 p-md-5">
                <h4 className="fw-bold text-uppercase font-monospace fs-6 mb-4 pb-2 border-bottom text-secondary">
                  [ HIZLI İRTİBAT FORMU ]
                </h4>
                
                {submitted ? (
                  <div className="text-center py-4">
                    <i className="bi bi-envelope-check text-success display-4 mb-3 d-block"></i>
                    <h5 className="fw-bold text-uppercase mb-2">Mesajınız İletildi</h5>
                    <p className="text-secondary fs-7 mb-0">
                      Bizimle iletişime geçtiğiniz için teşekkür ederiz. Mesajınız alınmıştır ve 24 saat içinde yanıtlanacaktır.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className={`needs-validation ${validated ? 'was-validated' : ''}`}>
                    <div className="row g-4">
                      {/* Name */}
                      <div className="col-md-6">
                        <label htmlFor="nameInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">Ad Soyad *</label>
                        <input
                          type="text"
                          className="form-control form-control-sharp"
                          id="nameInput"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Örn: Esra Sağın"
                        />
                        <div className="invalid-feedback font-monospace fs-8">Lütfen adınızı giriniz.</div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label htmlFor="emailInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">E-Posta Adresi *</label>
                        <input
                          type="email"
                          className="form-control form-control-sharp"
                          id="emailInput"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Örn: contact@estructura.com"
                        />
                        <div className="invalid-feedback font-monospace fs-8">Lütfen geçerli bir e-posta giriniz.</div>
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <label htmlFor="messageInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">Mesajınız *</label>
                        <textarea
                          className="form-control form-control-sharp"
                          id="messageInput"
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Lütfen mesajınızı veya iş birliği detaylarını buraya yazınız..."
                        ></textarea>
                        <div className="invalid-feedback font-monospace fs-8">Lütfen mesajınızı yazınız.</div>
                      </div>

                      <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-primary-sharp w-100 py-3 text-uppercase tracking-wider">
                          GÖNDER
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Bottom Showcase (3 portrait cards side by side matching page 5 bottom mockup) */}
        <section className="py-4 border-top">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="border overflow-hidden grayscale-hover" style={{ height: '220px' }}>
                <div style={{ backgroundImage: 'url(/assets/levh_i_mahfuz.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100%' }}></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border overflow-hidden grayscale-hover" style={{ height: '220px' }}>
                <div style={{ backgroundImage: 'url(/assets/ezel_packaging.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100%' }}></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border overflow-hidden grayscale-hover" style={{ height: '220px' }}>
                <div style={{ backgroundImage: 'url(/assets/prefabricated_cabin.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100%' }}></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .grayscale-hover {
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }
        .grayscale-hover:hover {
          filter: grayscale(0%);
        }
        .hover-blueblack:hover, .hover-indigo:hover {
          color: var(--color-terracotta) !important;
        }
      `}</style>
    </div>
  );
}
