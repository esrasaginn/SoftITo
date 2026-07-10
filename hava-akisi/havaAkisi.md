"Meteoroloji Tahmin ve Uyarı Yönetim Sistemi" (Proje adı: HavaAkışı) adında, web mimarisi güçlü ve görsel tasarımı büyüleyici bir React uygulaması geliştiriyorum.
Sitenin görsel tasarımı tamamen "Glassmorphism" (yarı saydam cam kartlar, bulanıklaştırılmış arka planlar) olacak. En büyük ayırt edici özelliği ise şu: Kullanıcı saatlik hava durumu tahmin grafiğinde farklı bir saati veya günü seçtiğinde, sitenin arka plan görseli o saatin durumuna (Gündüz/Gece) ve hava olayına göre pürüzsüzce değişecek; ekranda canlı canlı Yağmur, Şimşek/Yıldırım veya Güneş Parlaması gibi güzel animasyonlar oynayacak.
Gerçek zamanlı hava durumu verileri için "OpenWeatherMap API" (veya benzeri bir hava durumu API'si) kullanılacak. Kullanıcı rolleri (admin, editor, user), favori şehirler ve editörlerin manuel oluşturduğu renkli acil durum meteorolojik alarmları ise arka planda çalışan bir "JSON Server (db.json)" mimarisiyle yönetilecek. Sistemde 3 rol olacak: "admin", "editor" ve "user" (vatandaş).
Senden bu projenin tüm iskeletini, state yönetimini ve görsel motorunu tek bir mimaride kurmanı istiyorum. Lütfen aşağıda belirttiğim klasör dizinine sıkı sıkıya sadık kalarak, kritik bileşenlerin kaynak kodlarını eksiksiz, temiz ve modern React (Vite) + Bootstrap 5 standartlarında yazar mısın?

PROJE DOSYA DİZİNİ
hava-akisi/
├── public/
│ └── assets/
│ ├── backgrounds/
│ └── icons/ # Hava durumu ikonları
├── src/
│ ├── components/
│ │ ├── MainLayout.jsx # Dinamik Arka Planı ve Animasyonları taşıyan en dış katman
│ │ ├── WeatherCard.jsx # Cam efektli (Glassmorphic) ana hava durumu kartı
│ │ ├── HourlyForecastChart.jsx # Tıklanabilir sıcaklık ve saat grafik alanı
│ │ ├── ProtectedRoute.jsx # Rol tabanlı sayfa koruyucu (URL sızmalarını engeller)
│ │ ├── AlertBanner.jsx # Üstte soldan sağa kayan acil durum alarm bandı
│ │ └── VFX/
│ │ ├── SunEffect.jsx # parlama/dönme efektli güneş katmanı
│ │ ├── RainEffect.jsx # Ekranda aşağı akan pürüzsüz yağmur damlaları
│ │ └── LightningEffect.jsx# Şimşek çakma/anlık ekran flaşlama simülasyonu
│ ├── pages/
│ │ ├── Home.jsx # Arama ve ana portal
│ │ └── CityDetail.jsx # Detayların ve saat seçiminin yapıldığı sayfa
│ ├── store/
│ │ ├── index.js # Redux Store merkezi
│ │ └── slices/
│ │ ├── authSlice.js # Giriş/Çıkış ve Kullanıcı Rol yönetimi (admin/editor/user)
│ │ ├── weatherSlice.js # API verileri ve "Seçilen Aktif Saat/Hava Durumu" state'i
│ │ └── uiSlice.js # Arka plan ve aktif animasyon tetikleyici slice
│ ├── services/
│ │ └── weatherApi.js # Axios tabanlı OpenWeatherMap API servis entegrasyonu
│ ├── styles/
│ │ ├── glassmorphism.css # Şeffaf cam kart tasarımlarının CSS kodları
│ │ └── vfx.css # Yağmur, şimşek, güneş parlaması @keyframes animasyonları
│ ├── App.jsx # Rotalar ve sayfa koruma eşleşmeleri
│ └── main.jsx
├── db.json # Lokal ilişkisel mock veritabanı (kullanıcılar, alarmlar, favoriler)
└── package.json

önemli not: efektleri çeşitlendirebilirsin.

 SENDEN EKSİKSİZ KODLAMANI İSTEDİĞİM KRİTİK DOSYALAR:
styles/glassmorphism.css: backdrop-filter: blur(15px) ve background: rgba(255,255,255,0.1) içeren, ince beyaz sınırlı şık cam kart, buton ve girdi (input) sınıfları.
styles/vfx.css: Yağmur damlalarının aşağı akmasını, şimşeğin anlık opaklık (opacity) değiştirerek flaş patlaması yapmasını ve güneş ışığının pürüzsüzce parlamasını sağlayan CSS @keyframes animasyonları.
components/VFX/ (RainEffect, LightningEffect, SunEffect): Yukarıdaki CSS animasyonlarını çalıştıran hafif, harici kütüphane gerektirmeyen performanslı React bileşenleri.
store/slices/uiSlice.js & weatherSlice.js: Kullanıcı saatlik tahminde bir saate tıkladığında (Örn: Saat 22:00, Hava Durumu: Stormy), bu seçimi algılayıp currentBackground (Örn: 'night-storm') ve activeVFX (Örn: ['rain', 'lightning']) değerlerini güncelleyen Redux mimarisi.
components/MainLayout.jsx: Uygulamayı sarmalayan, Redux'taki uiSlice state'ini dinleyen, arka plan görselini transition: background 1s ease-in-out ile yumuşakça değiştiren ve o an aktif olması gereken VFX bileşenlerini ekranın arkasına dinamik olarak basan ana düzen bileşeni.
components/HourlyForecastChart.jsx: Şık bir sıcaklık trend çizgisine sahip olan, içindeki saat dilimlerine tıklandığında Redux'taki aktif saat/hava durumu state'ini güncelleyerek arka plan motorunu tetikleyen grafik alanı.
components/ProtectedRoute.jsx: Giriş yapan kullanıcının rolünü (admin, editor, user) kontrol eden, yetkisiz bir roldeki kullanıcının (Örn: Vatandaşın admin sayfasına girmesi) sayfaya erişmesini engelleyen güvenlik bileşeni.
Lütfen bu mimariyi birbiriyle tamamen entegre, hatasız, eksiksiz ve adımları belirterek tek parça halinde yaz. Kod bloklarında eksik veya "burayı siz doldurun" şeklinde geçiştirilmiş yerler bırakma.

tasarımda verdiğim referans görsellere bağlı kal.