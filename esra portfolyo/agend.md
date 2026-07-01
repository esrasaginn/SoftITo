# 🗓️ Proje Yol Haritası (agend.md)
**Proje:** Esra Sağın - Interactive Bootstrap Portfolio

---

## 🚀 FAZ 1: Altyapı ve Veri Mimarisi

src/
├── assets/                 # Mimari renderlar, çizimler ve logolar
├── components/             # Tekrar kullanılabilir UI elemanları
│   ├── Navbar.jsx          # Bootstrap d-flex ve responsive menü
│   ├── Footer.jsx          # Sosyal linkler ve telif alanı
│   ├── ProjectCard.jsx     # Glassmorphic stil ve hover efektli kartlar
│   └── TimelineItem.jsx    # Deneyim ve eğitim kronolojisi elemanı
├── pages/                  # Sayfa bileşenleri (Routes)
│   ├── Home.jsx            # Karşılama, Bienal projesi ve yetenek barları
│   ├── Projects.jsx        # Kategori filtreli portfolyo galerisi
│   ├── ProjectDetail.jsx   # Süreç ve malzeme detayları sayfası
│   ├── Experience.jsx      # İnteraktif kronolojik zaman tüneli
│   └── Contact.jsx         # Bootstrap onay mekanizmalı iletişim formu
├── store/                  # Redux Toolkit Merkezi
│   ├── index.js            # Store yapılandırması
│   ├── portfolioSlice.js   # Proje çekme ve detay state'i
│   └── experienceSlice.js  # Deneyim ve eğitim verileri state'i
├── App.jsx                 # Route tanımlamaları ve ana yerleşim (Layout)
├── custom.css              # Custom Bootstrap ve cam (glassmorphic) efektleri
└── main.jsx                # Bootstrap importları ve uygulamanın başlatılması

### Gün 1: Kurulum ve Bootstrap Entegrasyonu
- [x] Vite ile React projesinin ayağa kaldırılması.
- [x] `bootstrap` ve `bootstrap-icons` paketlerinin yüklenmesi.
- [x] `src/custom.css` dosyasının oluşturulması, mimari renk paletinin (Safir & Terracotta) CSS Variables olarak tanımlanması.

### Gün 2: Mock Veritabanı ve Redux Store Yapılandırması
- [ ] LinkedIn ve Behance verilerini simüle eden `db.json` dosyasının hazırlanması.
- [ ] Redux Toolkit ile `portfolioSlice` ve `experienceSlice` dosyalarının yazılması.
- [ ] `fetchProjects` ve `fetchExperienceData` async thunk eylemlerinin axios ile kodlanması.

### Gün 3: Yönlendirme (Routing) ve Layout Mimari
- [ ] `react-router-dom` entegrasyonunun tamamlanması.
- [ ] Responsive Bootstrap `Navbar` ve `Footer` bileşenlerinin yazılması.
- [ ] Sayfalar arası geçişlerin (Home, Projects, Experience, Contact) rotalarının bağlanması.

---

## 🎨 FAZ 2: Görsel Arayüz ve UI Bileşenleri

### Gün 4: Home (Karşılama) Sayfası Geliştirme
- [ ] Çok yönlü tasarımcı kimliğini vurgulayan Hero alanının tasarımı.
- [ ] Londra Tasarım Bienali (Levh-i Mahfuz) projesi için özel ".card" enstalasyon vurgusu.
- [ ] Bootstrap `.progress` barları ile dinamik yetenek gösterim alanı.

### Gün 5: Portfolyo Galerisi (Projects Sayfası)
- [ ] Kategori filtreleme buton grubunun (`.btn-group`) oluşturulması (Mimari, Ürün, Ambalaj).
- [ ] `.row-cols-1 .row-cols-md-3` yapısında responsive grid mimarisinin kurulması.
- [ ] Cam efekti (`.bg-glass`) ve mikro etkileşim (`.scale-hover`) sınıflarının kartlara uygulanması.

### Gün 6: Proje Detay Sayfası (`/projects/:id`)
- [ ] Seçilen projenin ID'ye göre Redux store'dan çekilmesi.
- [ ] Malzeme bilgisi, üretim süreci ve Melek Zeynep Studio kalite kontrol detaylarının listeleneceği detaylı görünüm.

### Gün 7: İnteraktif Zaman Tüneli (Experience Sayfası)
- [ ] Eğitim ve kurumsal iş deneyimlerinin (Arzum, İSTON, Ezel Kozmetik) dikey bir Bootstrap timeline yapısında kodlanması.

---

## 🧪 FAZ 3: Form Yönetimi, Optimizasyon ve Teslim

### Gün 8: İletişim Sayfası ve Doğrulama
- [ ] Bootstrap `.needs-validation` kontrollü, mesaj gönderme simülasyonu yapan form yapısı.
- [ ] Sosyal medya (LinkedIn, Behance) yönlendirme linklerinin ikonlarla bağlanması.

### Gün 9: Koyu Mod (Dark Mode) ve UI Cilalama
- [ ] Global light/dark mode state mekanizmasının kurulması ve CSS değişkenleriyle senkronize edilmesi.
- [ ] Tarayıcı uyumluluk testleri ve Bootstrap grid kırılma noktalarının (responsive) kontrolü.
