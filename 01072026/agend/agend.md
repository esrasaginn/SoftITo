Mini CRM (CustomerFlow) - Proje Ajandası ve Yol Haritası

Bu belge, projenin sıfırdan canlıya alınma sürecindeki aşamaları, sprint planlarını ve günlük takip rutinlerini içerir. Projenin 10 iş günü içerisinde tamamlanması hedeflenmektedir.

Proje Takvimi ve Yol Haritası

Faz 1: Altyapı ve Kurulum

Aşama 1.1: React + Vite proje şablonunun oluşturulması.

Aşama 1.2: Gerekli kütüphanelerin kurulması (@mui/material, @reduxjs/toolkit, react-router-dom, axios, vb.).

Aşama 1.3: Folder structure (Klasör yapısı) düzeninin kurulması (components, pages, store, theme).

Aşama 1.4: src/theme/index.js dosyasında kurumsal mavi (#2563eb) ve canlı turkuaz (#0d9488) renk paletini içeren custom Material UI temasının tasarlanması.

Aşama 1.5: Mock veritabanı için db.json dosyasının hazırlanması ve JSON Server yapılandırması.

Faz 2: Kimlik Doğrulama ve Güvenlik

Aşama 2.1: Redux Toolkit authSlice durum yönetiminin oluşturulması.

Aşama 2.2: /login sayfası arayüzünün Material UI Card, TextField ve Button kullanılarak tasarlanması.

Aşama 2.3: API üzerinden (veya mock) kullanıcı adı ve şifre doğrulama simülasyonunun yazılması.

Aşama 2.4: ProtectedRoute bileşeninin yazılması ve yetkisiz kullanıcıların Dashboard'a erişmesinin engellenmesi.

Faz 3: Dashboard (Özet Paneli) Tasarımı

Aşama 3.1: Genel layout yapısının (Sidebar ve Header içeren ana şablon) kurulması.

Aşama 3.2: İstatistik kartlarının (Masaüstü ve Mobil uyumlu) kodlanması:

Toplam Müşteri Sayısı

Aktif Müşteri Sayısı

Pasif Müşteri Sayısı

Aşama 3.3: Son eklenen 5 müşteriyi listeleyen mini tablonun eklenmesi.

Aşama 3.4: Müşteri durum dağılımını gösteren basit bir görsel grafik/bar simülasyonunun yerleştirilmesi.

Faz 4: Müşteri Yönetimi - CRUD İşlemleri

Aşama 4.1: Redux Toolkit customersSlice durum yönetiminin oluşturulması (fetch, add, update, delete thunk'ları).

Aşama 4.2: /customers sayfasında responsive Table (Masaüstü) ve Card (Mobil) listeleme yapısının kurulması.

Aşama 4.3: "Yeni Müşteri Ekle" ve "Müşteri Düzenle" işlemleri için ortak veya ayrı MUI Dialog formlarının geliştirilmesi.

Aşama 4.4: "Müşteri Sil" işlemi için kullanıcı dostu bir onay modalı tasarlanması.

Faz 5: Filtreleme ve Arama Mekanizması

Aşama 5.1: Müşteri arama çubuğunun (Search Bar) debounce mekanizmasıyla entegre edilmesi.

Aşama 5.2: Duruma göre (Aktif/Pasif) hızlı filtreleme butonlarının eklenmesi.

Aşama 5.3: Arama ve filtreleme durumlarının Redux state'ine bağlanarak tablonun anlık güncellenmesi.

Faz 6: Test, İyileştirme ve Kapanış

Aşama 6.1: Manuel testlerin yapılması (CRUD senaryoları, login-logout akışları).

Aşama 6.2: Mobil duyarlılık (responsive) kontrolleri ve MUI kırılma noktalarının (breakpoints) optimize edilmesi.

Aşama 6.3: Kod temizliği, kullanılmayan import'ların kaldırılması ve projenin teslime hazır hale getirilmesi.

Günlük Rutinler ve Takip

Proje geliştirme sürecinde aşağıdaki zaman yönetim metodolojisi uygulanacaktır:

Daily Standup (Her Gün - 10 Dk): Dün ne yapıldı? Bugün ne yapılacak? Karşılaşılan bir engel var mı?

Sprint Review (Sprint Sonu - 30 Dk): Tamamlanan modüllerin canlı gösterimi ve müşteri geribildirimlerinin alınması.