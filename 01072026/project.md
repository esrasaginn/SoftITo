## 1. Genel Proje Bilgileri
- **Proje Adı:** `Mini CRM`
- **Kısa Açıklama:** `Müşteri ilişkilerini yöneten modern bir dashboard uygulaması.`
- **Hedef Kitle:** `Küçük işletme sahipleri ve freelance çalışanlar.`

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)

Antigravity'nin modern ve göz alıcı bir tasarım oluşturabilmesi için aşağıdaki renk paletini ve stil yönergelerini belirleyin.

### Renk Paleti (Harmonious Palette)
Tasarımda doğrudan standart kırmızı/mavi kullanmak yerine modern HSL renklerini tercih edin.

- **Primary (Ana Renk - Örn. Marka Kimliği, Butonlar):**
  - HSL: `hsl(217, 91%, 56%)` (Kurumsal Mavi / Royal Blue)
  - Kullanım Alanı: Navigasyon barı, ana butonlar, aktif menü elemanları, odaklanılan kartlar.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsl(173, 80%, 40%)` (Canlı Turkuaz / Teal)
  - Kullanım Alanı: Bildirimler, badge'ler, dikkat çekici etiketler.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode: `hsl(210, 40%, 98%)` (Çok açık gri-mavi)
  - Dark Mode: `hsl(222, 47%, 11%)` (Koyu lacivert-siyah)
- **Neutral Text (Yazı Renkleri):**
  - Light Mode: `hsl(217, 19%, 27%)` (Koyu Gri)
  - Dark Mode: `hsl(210, 40%, 98%)` (Beyaza yakın)
- **Semantic Colors (Durum Renkleri):**
  - Success (Başarı): `hsla(111, 100%, 50%, 1.00)` (Yeşil)
  - Warning (Uyarı): `hsl(38, 92%, 50%)` (Sarı)
  - Error (Hata): `hsl(350, 89%, 60%)` (Kırmızı)

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Inter` veya `Inter` (Google Fonts'tan otomatik çekilecek)
- **Başlıklar (Headings):** `font-semibold` veya `font-bold`
- **Gövde Metni (Body):** `font-normal` ve `antialiased`

### UI Özellikleri ve Efektler
- **Modern MUI Kartları:** Paper ve Card bileşenlerinde yumuşak border-radius (border-radius: 12px) ve ince border kullanımı (border: '1px solid', borderColor: 'divider').
- **Gölgeler (Shadows):** Butonlar ve kartlar için yumuşak gölgeler (boxShadow: '0px 4px 20px rgba(99, 102, 241, 0.05)').
- **Mikro Etkileşimler:** Butonlarda ve liste satırlarında transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-2px)' } hover ve tıklama efektleri.

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)

Uygulamanızda yer alacak sayfaları ve bunların alt bileşenlerini listeleyin.

- **`/login` (Giriş Sayfası):**
  - Bileşenler: MUI Card içinde şık login formu, kullanıcı adı/şifre doğrulama simülasyonu, yüklenme (loading) animasyonu.
- **`/` (Dashboard / Ana Sayfa):**
  - Bileşenler: Toplam Müşteri, Aktif Müşteri, Pasif Müşteri gibi hızlı istatistik kartları (MUI Grid & Card). Son eklenen 5 müşterinin listesi, müşteri durum dağılımını gösteren görsel bar/chart simülasyonu.
- **`/customers` (Müşteriler Sayfası):**
  - Bileşenler: Arama Barı ve Filtreleme araçları (Aktif/Pasif durumuna göre süzme).
  Yeni Müşteri Ekle butonu (MUI Dialog/Modal tetikler).
  Müşterileri listelemek için MUI Table veya şık kart tasarımları.
  Satır içi "Düzenle" (MUI Dialog açar) ve "Sil" (MUI onay Dialog'u açar) aksiyon butonları.

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

JSON Server kullanarak ayağa kaldıracağımız yerel API'nin veri yapısını burada tanımlayın.

```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "password": "password123",
      "fullName": "CRM Yöneticisi",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
    }
  ],
  "customers": [
    {
      "id": "101",
      "name": "Can Alkan",
      "company": "Piksel Tasarım",
      "email": "can@pikselyazilim.com",
      "phone": "+90 555 123 45 67",
      "status": "active",
      "createdAt": "2026-06-28T10:00:00.000Z"
    },
    {
      "id": "102",
      "name": "Selin Kaya",
      "company": "Nova Finans",
      "email": "selin@novafinans.com",
      "phone": "+90 532 987 65 43",
      "status": "inactive",
      "createdAt": "2026-06-29T14:30:00.000Z"
    }
  ]
}
```

---

## 5. Global State Yönetimi (Redux Toolkit)

Uygulamada kullanılacak global slice (state) yapılarını ve içerdikleri anahtar değerleri listeleyin.

### 1. `authSlice`
- **State Yapısı:**
  ```javascript
  {
  isAuthenticated: false,
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  loginUser({ username, password }) -> GET /users?username=...&password=... (Eşleşme varsa kullanıcıyı state'e kaydeder ve isAuthenticated true yapar).
  logoutUser() -> Kullanıcıyı çıkış yaptırır, state'i sıfırlar ve localStorage temizliği yapar.


### 2. `customersSlice`
- **State Yapısı:**
  ```javascript
  {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchQuery: '',
  statusFilter: 'all' // 'all' | 'active' | 'inactive'
  }
  ```
- **Async Thunk Eylemleri:**
   - `fetchCustomers()` -> `GET /customers`
  - `addCustomer(customerData)` -> `POST /customers`
  - `updateCustomer({ id, data })` -> `PUT /customers/:id`
  - `deleteCustomer(id)` -> `DELETE /customers/:id`
  - `setSearchQuery(query)` -> Arama terimini günceller.
  - `setStatusFilter(status)` -> Filtreyi günceller.

---

## 6. Antigravity Geliştirme Sırası ve Talimatları

Antigravity'nin bu `project.md` dosyasını okuyarak sırasıyla hangi adımları yapmasını bekliyoruz?

1. **Adım 1: Klasör Yapısını İncele ve Ayarla**:
   - src/ klasörünün altında components/, pages/, store/, hooks/ ve theme/ dizinlerini oluştur.
2. **Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır**:
   - @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, @reduxjs/toolkit, react-redux, react-router-dom, axios paketlerini yükle.
   - src/theme/index.js dosyasını oluşturarak yukarıda belirtilen HEX renklerine sahip özel MUI Theme yapısını oluştur.
3. **Adım 3: Store ve Slice Dosyalarını Oluştur**:
   - `store/index.js` dosyasını oluştur ve store'u uygulamaya bağla.
   - authSlice.js ve customersSlice.js dosyalarını async thunk'ları ile birlikte yaz.
4. **Adım 4: JSON Server Kurulumu**:
   - Proje kökünde `db.json` dosyasını oluştur ve doldur.
   - Projenin `package.json` dosyasına `"server": "json-server --watch db.json --port 5000"` scriptini ekle.
5. **Adım 5: Sayfaları ve Yönlendirmeleri (Routing) Tasarla**:
   Giriş yapmamış kullanıcıların diğer sayfalara geçmesini engelleyen ProtectedRoute mekanizmasını yaz.
   /login, / (Dashboard) ve /customers sayfalarını, modern ve responsive MUI bileşenlerini kullanarak tasarla.
   Müşteri ekleme/düzenleme formları için şık MUI Dialog bileşenlerini entegre et.
