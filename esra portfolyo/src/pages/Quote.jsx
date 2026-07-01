import React, { useState } from 'react';

export default function Quote() {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Mimari Tasarım',
    budgetRange: '500k - 1M TL',
    scopeDescription: '',
    timeline: ''
  });

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

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      projectType: 'Mimari Tasarım',
      budgetRange: '500k - 1M TL',
      scopeDescription: '',
      timeline: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center text-md-start">
          <span className="text-uppercase font-monospace tracking-widest text-secondary fs-8">
            [ HİZMET TEKLİFİ ]
          </span>
          <h1 className="display-5 fw-light mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Yeni Bir Projeye Başlayın
          </h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '600px', lineHeight: '1.6', fontSize: '0.9rem' }}>
            Mimari veya endüstriyel ürün tasarım projeniz için bilgileri iletin, özel teklifimizi hazırlayalım.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-glass border-0 p-5 text-center shadow-md">
              <i className="bi bi-file-earmark-check text-success display-1 mb-4"></i>
              <h3 className="fw-bold text-uppercase mb-3">Talep Kaydınız Alındı</h3>
              <p className="text-secondary mb-4 fs-6">
                Sayın <strong>{formData.name}</strong> {formData.company && `(${formData.company})`}, <strong>{formData.projectType}</strong> kategorisindeki teklif talebiniz başarıyla kaydedilmiştir. En kısa sürede iletişime geçeceğiz.
              </p>
              <div>
                <button onClick={resetForm} className="btn btn-primary-sharp">
                  Yeni Talep Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className={`needs-validation ${validated ? 'was-validated' : ''}`}>
          <div className="row g-5">
            {/* Left Column: Form */}
            <div className="col-lg-7">
              <div className="card bg-glass border-0 p-4 p-md-5">
                <h4 className="fw-bold text-uppercase font-monospace fs-6 mb-4 pb-2 border-bottom text-secondary">
                  [ PROJE TALEBİ ]
                </h4>
                
                <div className="row g-4">
                  {/* Name */}
                  <div className="col-md-6">
                    <label htmlFor="nameInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sharp"
                      id="nameInput"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Örn: Esra Yılmaz"
                    />
                    <div className="invalid-feedback font-monospace fs-8">
                      Lütfen adınızı giriniz.
                    </div>
                  </div>

                  {/* Company */}
                  <div className="col-md-6">
                    <label htmlFor="companyInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Firma Adı
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sharp"
                      id="companyInput"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Örn: XYZ Tasarım Ofisi"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label htmlFor="emailInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      E-Posta Adresi *
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sharp"
                      id="emailInput"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Örn: contact@company.com"
                    />
                    <div className="invalid-feedback font-monospace fs-8">
                      Lütfen geçerli bir e-posta adresi giriniz.
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label htmlFor="phoneInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-sharp"
                      id="phoneInput"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Örn: 0555 123 4567"
                    />
                    <div className="invalid-feedback font-monospace fs-8">
                      Lütfen telefon numaranızı giriniz.
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="col-md-6">
                    <label htmlFor="projectTypeSelect" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Proje Kategorisi *
                    </label>
                    <select
                      className="form-select form-control-sharp"
                      id="projectTypeSelect"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Mimari Tasarım">Mimari Tasarım</option>
                      <option value="Ürün Tasarımı">Ürün Tasarımı</option>
                      <option value="Ambalaj Tasarımı">Ambalaj Tasarımı</option>
                      <option value="Kreatif Direktörlük">Kreatif Direktörlük</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="col-md-6">
                    <label htmlFor="budgetRangeSelect" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Öngörülen Bütçe *
                    </label>
                    <select
                      className="form-select form-control-sharp"
                      id="budgetRangeSelect"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      required
                    >
                      <option value="100k - 500k TL">100.000 TL - 500.000 TL</option>
                      <option value="500k - 1M TL">500.000 TL - 1.000.000 TL</option>
                      <option value="1M+ TL">1.000.000 TL ve Üzeri</option>
                    </select>
                  </div>

                  {/* Details */}
                  <div className="col-12">
                    <label htmlFor="scopeInput" className="form-label font-monospace text-uppercase fs-8 text-secondary">
                      Proje Kapsamı ve Detayları *
                    </label>
                    <textarea
                      className="form-control form-control-sharp"
                      id="scopeInput"
                      name="scopeDescription"
                      rows="5"
                      value={formData.scopeDescription}
                      onChange={handleChange}
                      required
                      placeholder="Lütfen projenizin hedefleri ve detaylarını açıklayınız..."
                    ></textarea>
                    <div className="invalid-feedback font-monospace fs-8">
                      Lütfen proje detaylarını belirtiniz.
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary-sharp w-100 py-3 text-uppercase tracking-wider">
                      TALEP GÖNDER
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Block */}
            <div className="col-lg-5">
              <div className="card border-0 bg-transparent h-100 d-flex flex-column justify-content-between">
                {/* Visual card displaying interior room matching the 4th column visual */}
                <div 
                  className="border mb-4" 
                  style={{ 
                    backgroundImage: 'url(/assets/prefabricated_cabin.png)', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    height: '240px' 
                  }}
                ></div>
                
                <div className="card bg-glass border p-4 flex-grow-1">
                  <h5 className="fw-bold text-uppercase font-monospace fs-7 mb-3 text-secondary">[ SÜREÇ PRENSİPLERİ ]</h5>
                  <ul className="list-unstyled fs-7 text-secondary p-0 m-0" style={{ lineHeight: '1.8' }}>
                    <li className="mb-3 border-bottom pb-2">
                      <strong className="text-dark">Hızlı Geri Dönüş:</strong> İletilen tüm talepler mimari ekibimiz tarafından incelenip 48 saat içinde özel analiz raporuyla yanıtlanır.
                    </li>
                    <li className="mb-3 border-bottom pb-2">
                      <strong className="text-dark">Bütçe Uyum Garantisi:</strong> Projelerimizi, teklif aşamasında mutabık kaldığımız bütçe sınırları dahilinde parametrik analizlerle kurguluyoruz.
                    </li>
                    <li>
                      <strong className="text-dark">Sürdürülebilirlik:</strong> Tasarımlarımızda biyo-bozunur ambalajlar ve geri dönüştürülebilir yapısal beton modülleri önceliklendiriyoruz.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
