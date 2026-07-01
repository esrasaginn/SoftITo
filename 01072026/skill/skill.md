Mini CRM (CustomerFlow) - Geliştirici Yetenek Matrisi (Skill Matrix)

Bu belge, CustomerFlow projesinde çalışacak frontend geliştiricinin sahip olması veya süreç boyunca edinmesi gereken teknik yetkinlikleri, kütüphaneleri ve en iyi uygulama (best practices) standartlarını listeler.

🛠️ Teknik Yetenek Matrisi

1. React & JavaScript (ES6+)

Functional Components & Hooks: useState, useEffect, useMemo ve useCallback hook'larının verimli kullanımı.

Custom Hooks: API çağrıları veya form yönetimini kolaylaştırmak için özel hook'lar yazabilme.

ES6+ Standartları: Destructuring, Arrow Functions, Array Methods (map, filter, reduce), Async/Await mimarisi.

2. State Yönetimi (Redux Toolkit)

Store Yapılandırması: configureStore ile merkezi veri deposunun kurulması.

Slices & Reducers: Modüler state tasarımı (authSlice, customersSlice).

Asenkron State Takibi (createAsyncThunk): API istek durumlarının (pending, fulfilled, rejected) yönetilmesi ve UI yüklenme (loading/error) durumlarının kontrolü.

3. Kullanıcı Arayüzü & Tasarım (Material UI - MUI)

Temalandırma (Theming): ThemeProvider kullanarak projenin kurumsal renklerine (Royal Blue ve Teal) uygun global tema oluşturulması.

MUI Grid Sistemi: Grid ve Box bileşenleriyle tamamen responsive (mobil uyumlu) ekran tasarımları yapabilmek.

Form Elemanları & Validasyon: TextField, Select, FormControl ve Button bileşenlerinin kullanımı.

Gelişmiş Bileşenler: Dialog (Modal), Table, Snackbar (Bildirimler), Avatar ve Skeleton (Yükleniyor animasyonları).

4. Yönlendirme (React Router DOM)

Route Yapılandırması: BrowserRouter, Routes, Route ve Maps kullanımı.

ProtectedRoute: Giriş yapmamış kullanıcıları otomatik olarak /login sayfasına yönlendiren ara yazılım (middleware) benzeri rota koruma mantığı.

5. API Entegrasyonu (Axios & JSON Server)

RESTful API İletişimi: Axios instance oluşturma, istek ve yanıtları yönetme.

CRUD Entegrasyonu: Müşteri verilerini uzaktaki/yereldeki bir API'ye kaydetme, güncelleme ve silme protokollerine hakimiyet.

En İyi Uygulamalar (Best Practices)

Temiz Kod Yazımı

Bileşenlerin maksimum 150-200 satırı geçmeyecek şekilde modüler parçalara (örneğin: CustomerTable, CustomerDialog, StatCard) bölünmesi.

Dosya ve klasör isimlerinin tutarlı olması (küçük harf veya CamelCase standartlarına uyum).

Responsive (Duyarlı) Tasarım

Mobil ekranlarda tabloların kaydırılabilir yapılması veya kart görünümüne (card layout) dönüştürülmesi.

Gereksiz boşlukların mobil cihazlarda padding ve margin değerlerinin MUI breakpoint'leri (xs, sm, md, lg) aracılığıyla azaltılarak optimize edilmesi.

Performans

Gereksiz render'ların önüne geçmek için state'lerin doğru yerde tutulması (global vs local state ayrımı).

Arama işlemlerinde her harf basışta istek atmak yerine debounce tekniklerinin uygulanması.