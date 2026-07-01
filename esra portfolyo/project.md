Proje Başlatma Rehberi (Esra Sağın - Interactive Bootstrap Portfolio)Bu şablon, Esra Sağın'ın multidisipliner (Mimarlık + Ürün Tasarımı) tasarım portfolyosunu React, Bootstrap 5, Redux Toolkit ve JSON Server kullanarak hayata geçirmek ve Antigravity'nin projeyi sıfırdan kurmasını sağlamak amacıyla güncellenmiştir.  

1. Genel Proje BilgileriProje Adı: Esra Sağın Architecture & Product Design Portfolio   Kısa Açıklama: Mimarlık, endüstriyel ürün tasarımı ve kreatif direktörlük projelerini sergileyen; kategori filtreleme, interaktif zaman tüneli ve dinamik iletişim formunu barındıran modern bir Bootstrap web portfolyosu.  Hedef Kitle: Mimarlık ofisleri, tasarım ajansları, jüri ve mülakat geliştiricileri.  

2. Tasarım Sistemi ve Görsel Kimlik (Design System)Tasarımcının kurumsal ve mimari estetiğini yansıtacak biçimde, Bootstrap'in esnek yapısı özel CSS sınıflarıyla birleştirilerek yarı saydam cam efektleri ve koyu mod öncelikli bir arayüz kurgulanmıştır.Renk Paleti (Custom Bootstrap Theme)Bootstrap temasına eklenecek ve _variables.scss veya kök CSS içinde tanımlanacak renk değerleri:Primary (Ana Renk - Mimari Safir):HEX: #202E3F (hsl(215, 30%, 18%))Kullanım Alanı: Navbar arka planı, ana butonlar, kart çerçeveleri.Secondary (İkinci Renk - Terracotta Vurgusu):HEX: #F4821C (hsl(32, 90%, 55%))Kullanım Alanı: Ödüller, bienal vurguları, aktif filtre butonları.Neutral Background (Arka Planlar):Light Mode: #FAFAFA (hsl(0, 0%, 98%))Dark Mode: #161B22 (hsl(220, 20%, 10%))Neutral Text (Yazı Renkleri):Light Mode: #2B3541 (hsl(220, 15%, 20%))Dark Mode: #F2F2F2 (hsl(0, 0%, 95%))Tipografi ve UI Özellikleri (Bootstrap Sınıfları)Yazı Tipi: Inter (Google Fonts) Başlıklar: .fw-bold veya .fw-semibold Glassmorphic Kartlar (Özel Sınıf): .bg-glass { backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.15); } Mikro Etkileşimler: Bootstrap .transition sınıfına ek olarak hover durumunda .scale-hover { transition: transform 0.3s ease; } .scale-hover:hover { transform: scale(1.02); }.

3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)Uygulama, Bootstrap'in responsive .container ve .row / .col grid mimarisi üzerine kurulacaktır:/ (Home / Özet & Karşılama):Bileşenler: Hero alanı, Londra Tasarım Bienali projesinin öne çıkarıldığı büyük bir .card (Kritik Başarı kartı), Bootstrap .progress barları ile yetenek gösterimi.  /projects (Portfolyo / Galeri):Bileşenler: Buton grupları (.btn-group) ile kategori filtreleri (Mimari, Ürün, Ambalaj Tasarımı), responsive grid (.row-cols-1 .row-cols-md-3) yapısında proje kartları.  /projects/:id (Proje Detay):Bileşenler: Üretim süreci, kalite kontrol detayları, malzeme bilgileri (örn: Melek Zeynep Studio süreçleri).  /experience (Kariyer & Eğitim Kronolojisi):Bileşenler: Esra Sağın Mimarlık Bürosu, Ezel Kozmetik, Arzum ve İSTON deneyimlerinin dikey bir Bootstrap timeline yapısında sergilenmesi.  /contact (İletişim & Mesaj):Bileşenler: Behance ve LinkedIn ikonları (Bootstrap Icons), .form-control ve .needs-validation entegrasyonlu, Redux ile yönetilen mesaj gönderme formu.  

4. Veri Modeli ve Veritabanı Şeması (db.json)JSON{
  "profile": {
    "name": "Esra Sağın",
    "title": "Architect & Industrial Product Designer",
    "location": "İstanbul, Türkiye",
    "email": "esrasaginn@gmail.com",
    "behance": "www.behance.net/esrasagin",
    "linkedin": "www.linkedin.com/in/esra-sağin-79a495195"
  },
  "projects": [
    {
      "id": "1",
      "title": "The Recursion Project: Levh-i Mahfuz",
      "category": "Mimari Tasarım",
      "client_studio": "Melek Zeynep Studio",
      "exhibition": "2025 Londra Tasarım Bienali Türkiye Pavyonu, Somerset House",
      "role": "Mimar - Kalite Kontrol ve Üretim Süreci Desteği",
      "featured": true,
      "description": "Somerset House, 1 Numaralı Galeri'de sergilenen enstalasyon projesi."
    },
    {
      "id": "2",
      "title": "Kreatif Direktörlük ve Ambalaj Tasarımları",
      "category": "Ambalaj Tasarımı",
      "client_studio": "Ezel Kozmetik",
      "role": "Creative Director",
      "featured": false,
      "description": "Kozmetik ürün gamı için modern ambalaj ve ürün tasarımları."
    }
  ],
  "experiences": [
    {
      "id": "exp1",
      "company": "Esra SAĞIN MİMARLIK BÜROSU",
      "role": "Mimar",
      "period": "Nisan 2025 - Present"
    },
    {
      "id": "exp2",
      "company": "Arzum Elektrikli Ev Aletleri",
      "role": "Tasarım Stajyeri",
      "period": "Haziran 2018 - Ekim 2018"
    }
  ],
  "education": [
    {
      "institution": "Medipol Üniversitesi",
      "degree": "Lisans Derecesi, Mimarlık",
      "years": "2016-2021"
    },
    {
      "institution": "Medipol Üniversitesi",
      "degree": "Lisans Derecesi, Endüstri Ürünleri Tasarımı - Bölüm 3.sü",
      "years": "2015 - 2019"
    }
  ]
}
5. Global State Yönetimi (Redux Toolkit)1. portfolioSliceState: items: [], currentProject: null, status: 'idle', error: nullActions:fetchProjects() -> GET /projectsfetchProjectById(id) -> GET /projects/:id2. experienceSliceState: data: [], education: [], status: 'idle'Actions:fetchExperienceData() -> GET /experiences ve GET /education verilerini paralel çeker.

6. Antigravity Geliştirme Sırası ve TalimatlarıAdım 1: Klasör Yapısı: src/ altında components/, pages/, store/ dizinlerini ayarla.Adım 2: Bağımlılıklar ve Konfigürasyon:@reduxjs/toolkit, react-redux, react-router-dom, axios, bootstrap, bootstrap-icons paketlerini yükle.src/index.js (veya main.jsx) içerisine import 'bootstrap/dist/css/bootstrap.min.css'; ve import 'bootstrap-icons/font/bootstrap-icons.css'; satırlarını ekle. Custom renkler için bir src/custom.css dosyası bağla.Adım 3: Store ve Slice Dosyaları: Portfolyo ve kronoloji thunk'larını yazıp merkezi store'a bağla.Adım 4: JSON Server Kurulumu: LinkedIn ve Behance verilerini barındıran db.json dosyasını oluştur ve port 5000 üzerinde ayağa kaldır.Adım 5: Bootstrap UI Geliştirme: Grid sistemini, .navbar, .card ve .modal bileşenlerini kullanarak tasarımı tamamla.
