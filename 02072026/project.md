# Proje Başlatma Rehberi (React + Vite + Bootstrap 5 + JSON Server + Redux Toolkit)

Bu şablon, Yemeksepeti Varyasyonu (FoodFlow) projesinin tüm mimari, tasarım, sayfa yönlendirmeleri, veri modelleri ve state yönetim detaylarını belirlemek amacıyla hazırlanmıştır.

---

## 1. Genel Proje Bilgileri
- **Proje Adı:** `[Örn: Yemeksepeti Varyasyonu (FoodFlow)]`
- **Kısa Açıklama:** `[Örn: Müşterilerin restoranlardan yemek siparişi verebildiği, restoran işletmelerinin menülerini yönetebildiği ve sistem yöneticisinin (Admin) tüm ekosistemi gelişmiş veri tablolarıyla (Data Table) izleyebildiği çok rollü bir yemek siparişi platformu.]`
- **Hedef Kitle:** `[Örn: Son tüketiciler (Müşteriler), Restoran Sahipleri (İşletmeler) ve Sistem Yöneticileri (Admin).]`

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)

Antigravity'nin modern ve göz alıcı bir tasarım oluşturabilmesi için aşağıdaki renk paletini ve stil yönergelerini belirleyin.

### Renk Paleti (Harmonious Palette)
Tasarımda doğrudan standart kırmızı/mavi kullanmak yerine modern HSL renklerini tercih edin.

- **Primary (Ana Renk - Lezzetli Kızıl-Kırmızı / Marka Kimliği):**
  - HEX: #ba181b (Kızıl Kırmızı) 
  - Kullanım Alanı: Navbar arka planı, ana aksiyon butonları, sepeti onayla eylemleri.
- **Secondary (İkinci Renk - İştah Açıcı Turuncu / Vurgu):**
  - HEX: #FF6F00 (İştah Açıcı Turuncu) 
  - Kullanım Alanı: Kampanyalar, indirim badge'leri, popüler restoran vurguları.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode: #F8F9FA (Temiz Bootstrap Açık Gri) 
  - Dark Mode: #121212 (Koyu Gece Modu / OLED Siyahı)
- **Neutral Text (Yazı Renkleri):**
  - Light Mode: #212529 (Koyu Antrasit) 
  - Dark Mode: #E9ECEF (Yumuşak Beyaz)
- **Semantic Colors (Durum Renkleri):**
  - Success (Sipariş Hazırlanıyor / Teslim Edildi): #198754 (Bootstrap Yeşili) 
  - Warning (Sipariş Alındı / Beklemede): #FFC107 (Bootstrap Sarısı)
  - Error (Sipariş İptal Edildi): #DC3545 (Bootstrap Kırmızısı)

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Roboto` veya `Inter` (Google Fonts'tan otomatik çekilecek)
- **Başlıklar (Headings):** `.fw-bold` veya `.fw-semibold`
- **Gövde Metni (Body):** `.fw-normal`

### UI Özellikleri ve Efektler (Bootstrap Sınıfları)
- Kart Tasarımları: Restoran ve yemek listelerinde yumuşak gölgeli .card .shadow-sm yapısı.
- Mikro Etkileşimler: Yemek kartlarında ve butonlarda üzerine gelindiğinde hafif büyüme efekti:
.scale-hover { transition: transform 0.2s ease-in-out; }
.scale-hover:hover { transform: scale(1.02); }
---

---

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)

Uygulama, Bootstrap'in responsive (`.container`, `.row`, `.col`) grid mimarisi üzerine inşa edilecek ve rol bazlı yönlendirilecektir:

### 🔐 1. Ortak Sayfalar (Public Routes)
- **`/login` (Giriş Ekranı):** Tek ekranda sekmeli (Tab) veya seçimli yapıyla Müşteri, İşletme veya Admin rollerinden biriyle giriş yapılan ekran.
- **`/register` (Kayıt Ekranı):** Müşteri veya yeni İşletme kaydı oluşturma formu.

### 🎓 2. Müşteri Sayfaları (role: `customer`)
- **`/` (Ana Sayfa):** Popüler restoranlar, mutfak kategorileri (Kebap, Pizza, Burger vb.) listesi, restoran filtreleme ve arama alanı.
- **`/restaurant/:id` (Restoran Detay & Menü):** Seçilen restoranın menüsü, yemek sepetine ekleme butonları ve restoran puanları.
- **`/cart` (Sepetim):** Sepetteki ürünlerin listesi, adet güncelleme, reduce ile hesaplanmış toplam tutar ve "Sipariş Ver" butonu.
- **`/my-orders` (Siparişlerim):** Geçmiş ve aktif siparişlerin durum takip ekranı.

### 👨‍🍳 3. İşletme / Restoran Paneli (role: `restaurant`)
- **`/restaurant/dashboard` (Restoran Özeti):** Günlük ciro, alınan toplam sipariş sayısı istatistik kartları.
- **`/restaurant/menu` (Menü Yönetimi):** Restoranın kendi yemeklerini listeleme, yeni yemek ekleme, fiyat güncelleme ve silme alanı (CRUD).
- **`/restaurant/orders` (Sipariş Yönetimi):** Gelen siparişleri "Onaylandı", "Yolda", "Teslim Edildi" olarak güncelleyebileceği interaktif yönetim tablosu.

### 👑 4. Sistem Admin Paneli (role: `admin`)
- **`/admin/dashboard` (Genel Sistem Özeti):** Toplam kayıtlı üye, toplam restoran sayısı ve platform genelindeki toplam kazanç grafikleri.
- **`/admin/restaurants` (Restoran Onay & Yönetim):** **Hocanın istediği Gelişmiş Data Table (Veri Tablosu) burada yer alacaktır.** Tüm restoranlar listelenir, arama ve sıralama yapılabilir, pasif/aktif durumları değiştirilebilir.
- **`/admin/users` (Kullanıcı Yönetimi):** Sistemdeki müşteri hesaplarının listelendiği, filtrelendiği ve yönetildiği ikinci bir Data Table alanı.

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

JSON Server altyapısı için kurgulanan ilişkisel e-ticaret/yemek şeması:

```json
{
  "users": [
    { "id": "1", "name": "Can Yılmaz", "email": "can@mail.com", "role": "customer" },
    { "id": "2", "name": "Gazi Kebap Salonu", "email": "gazi@kebap.com", "role": "restaurant" },
    { "id": "3", "name": "Esra Admin", "email": "admin@foodflow.com", "role": "admin" }
  ],
  "restaurants": [
    {
      "id": "r101",
      "userId": "2",
      "name": "Gazi Kebap Salonu",
      "cuisine": "Kebap & Türk Mutfağı",
      "rating": 4.8,
      "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4",
      "isActive": true
    }
  ],
  "menuItems": [
    {
      "id": "m1",
      "restaurantId": "r101",
      "name": "Adana Dürüm",
      "price": 180,
      "description": "Zırh kıyması, közlenmiş biber ve yeşillik ile"
    }
  ],
  "orders": [
    {
      "id": "o501",
      "customerId": "1",
      "restaurantId": "r101",
      "items": [
        { "menuItemId": "m1", "name": "Adana Dürüm", "quantity": 2, "price": 180 }
      ],
      "totalPrice": 360,
      "status": "preparing", 
      "date": "2026-07-02"
    }
  ]
}
```

## 5. Global State Yönetimi (Redux Toolkit)

Uygulamada kullanılacak global slice (state) yapılarını ve içerdikleri anahtar değerleri listeleyin.

### 1. `projectsSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    currentProject: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `fetchProjects()` -> `GET /projects`
  - `addProject(projectData)` -> `POST /projects`
  - `updateProject({ id, data })` -> `PATCH /projects/:id`
  - `deleteProject(id)` -> `DELETE /projects/:id`

### 2. `clientsSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    status: 'idle',
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `fetchClients()` -> `GET /clients`
  - `addClient(clientData)` -> `POST /clients`

---

### 5. Global State Yönetimi (Redux Toolkit)

Uygulamanın veri tutarlılığını sağlamak amacıyla Redux Toolkit mimarisinde 4 temel slice (dilim) kullanılacaktır.

1. authSlice (Kimlik ve Rol Yönetimi)

State Yapısı:

{
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
}


Async Thunk Eylemleri:

loginUser(credentials) -> POST /login simülasyonu ile kimlik ve rol doğrulama.

logoutUser() -> State'i ve kullanıcı verilerini sıfırlayarak güvenli çıkış yapma.

2. restaurantSlice (Restoran İşlemleri)

State Yapısı:

{
  list: [],
  selectedRestaurant: null,
  status: 'idle',
  error: null
}


Async Thunk Eylemleri:

fetchRestaurants() -> GET /restaurants (Müşteri ve Admin listesi için)

addRestaurant(restaurantData) -> POST /restaurants (Yeni restoran başvurusu/ekleme)

updateRestaurantStatus({ id, isActive }) -> PATCH /restaurants/:id (Admin panelindeki Data Table üzerinden restoran durumunu değiştirme)

3. menuSlice (Menü ve Yemek Yönetimi)

State Yapısı:

{
  items: [],
  status: 'idle',
  error: null
}


Async Thunk Eylemleri:

fetchMenuByRestaurant(restaurantId) -> GET /menuItems?restaurantId=...

addMenuItem(itemData) -> POST /menuItems

deleteMenuItem(id) -> DELETE /menuItems/:id

4. cartSlice (Müşteri Sepet Yönetimi - Senkron)

State Yapısı:

{
  cartItems: [],
  totalAmount: 0
}


Reducers (Senkron):

addToCart(item) -> Sepete ürün ekler, eğer ürün zaten varsa miktarını artırır.

removeFromCart(id) -> Sepetten ürün eksiltir veya tamamen kaldırır.

clearCart() -> Sepeti tamamen sıfırlar.

Sepet Toplam Tutarı Hesabı: Toplam tutar, state güncellendiğinde JavaScript reduce metodu kullanılarak şu formülle dinamik hesaplanır:


$$Total = \sum (Price \times Quantity)$$

6. Geliştirme Sırası ve Talimatları

Adım 1: Klasör Yapısı Ayarı

src/ dizini altında aşağıdaki modüler yapıyı kurgulayın:

src/components/ (Yeniden kullanılabilir UI elemanları, ProtectedRoute.jsx vb.)

src/pages/ (Rol bazlı alt klasörlerle birlikte sayfalar: Customer/, Restaurant/, Admin/)

src/store/ (Redux Store ve Slices dosyaları)

Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır

Gerekli paketleri kurun: @reduxjs/toolkit, react-redux, react-router-dom, axios, bootstrap, bootstrap-icons.

main.jsx içerisine Bootstrap CSS ve Bootstrap Icons kütüphanelerini import edin:

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


Adım 3: Store ve Slice Yapısını Oluşturun

store/index.js dosyasında store'u konfigüre edin ve tüm reducer'ları bağlayın.

authSlice.js, restaurantSlice.js ve menuSlice.js dosyalarını asenkron thunk operasyonları ve extraReducers yapılarıyla beraber tamamlayın.

Adım 4: JSON Server Kurulumu

Proje kök dizininde db.json dosyasını oluşturun ve yukarıdaki şema ile doldurun.

package.json dosyasındaki scripts alanına aşağıdaki komutu ekleyin:

"server": "json-server --watch db.json --port 5000"


Adım 5: Sayfaları ve Bootstrap Data Table Yapılarını Geliştirin

react-router-dom kullanarak korumalı rotaları (ProtectedRoute) kurun.

Admin sayfalarında (/admin/restaurants ve /admin/users), Bootstrap sınıflarını (.table .table-striped .table-hover) kullanarak arama, sıralama ve sayfalama özelliklerine sahip dinamik bir Data Table bileşeni geliştirin.
