import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants, setSelectedRestaurant } from '../../store/restaurantSlice';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: restaurants, status } = useSelector((state) => state.restaurants);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // İkonları ve etiketleri eşleştirmek için standart kategori yapılandırması
  const standardCuisineConfig = {
    'kebap & türk mutfağı': { name: 'Kebap & Türk', icon: 'bi-fire' },
    'burger & fast food': { name: 'Burger', icon: 'bi-egg-fried' },
    'italyan & pizza': { name: 'Pizza', icon: 'bi-pie-chart' },
    'tatlı & kahve': { name: 'Tatlı & Kahve', icon: 'bi-cup-hot' },
    'uzak doğu & sushi': { name: 'Uzak Doğu', icon: 'bi-translate' }
  };

  // Veritabanından benzersiz aktif mutfak türlerini çek
  const activeCuisines = Array.from(new Set(
    restaurants
      .filter(r => r.isActive)
      .map(r => r.cuisine)
  ));

  // Kategori listesini dinamik olarak oluştur
  const categories = [
    { id: 'all', name: 'Tümü', icon: 'bi-grid' },
    ...activeCuisines.map(cuisine => {
      const lower = cuisine.toLowerCase();
      const matchedKey = Object.keys(standardCuisineConfig).find(key => lower.includes(key) || key.includes(lower));
      if (matchedKey) {
        return {
          id: cuisine,
          name: standardCuisineConfig[matchedKey].name,
          icon: standardCuisineConfig[matchedKey].icon
        };
      }
      // Kullanıcı tanımlı özel kategori detaylarını döndür
      return {
        id: cuisine,
        name: cuisine,
        icon: 'bi-shop' // varsayılan özel restoran kategorisi ikonu
      };
    })
  ];

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleRestaurantClick = (restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleBannerClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setTimeout(() => {
      const element = document.getElementById('restaurant-list');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Filtreler: Arama Terimi, Seçilen Kategori ve restoran AKTİF olmalı!
  const filteredRestaurants = restaurants.filter((r) => {
    // Müşterilere sadece aktif olan restoranları göster
    if (!r.isActive) return false;

    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-4">
      {/* Kahraman (Hero) Bölümü */}
      <div className="bg-brand-primary text-white rounded-3 p-3 mb-4 shadow-sm position-relative overflow-hidden">
        <div className="position-relative z-1 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h3 className="fw-bold m-0 fs-4">Lezzet Kapınızda!</h3>
          <div style={{ maxWidth: '350px', width: '100%' }}>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-0 text-muted py-2">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Restoran veya mutfak ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ outline: 'none' }}
              />
            </div>
          </div>
        </div>
        {/* Arka Plan Dekorasyonları */}
        <div className="position-absolute end-0 bottom-0 opacity-10 fs-1 text-warning" style={{ fontSize: '4rem', transform: 'rotate(15deg)', marginRight: '20px' }}>
          <i className="bi bi-egg-fried"></i>
        </div>
      </div>

      {/* Kampanya Banner Sliderı */}
      <div id="campaignCarousel" className="carousel slide mb-5 rounded-3 overflow-hidden shadow-sm" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#campaignCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#campaignCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#campaignCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#campaignCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#campaignCarousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div className="carousel-inner">
          <div 
            className="carousel-item active" 
            style={{ height: '340px', cursor: 'pointer' }}
            onClick={() => handleBannerClick('all')}
            title="Kampanyalı Restoranları İncele"
          >
            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&h=400&q=80" className="d-block w-100 h-100 object-fit-cover" alt="İlk Siparişe Özel" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div className="carousel-caption d-md-block text-start start-0 ps-5 pb-5">
              <span className="badge bg-brand-secondary fw-bold mb-3 fs-6">Süper Fırsat</span>
              <h1 className="fw-bold text-white mb-2 display-6">İlk Siparişinize Özel %50 İndirim!</h1>
              <p className="lead text-white-50 mb-3">Kampanya kodu <strong className="text-white">FOOD50</strong> ile sepetinizde anında indirim kazanın.</p>
              <span className="badge bg-light text-dark fw-semibold py-2 px-3"><i className="bi bi-eye-fill me-1"></i>Restoranları Gör</span>
            </div>
          </div>
          <div 
            className="carousel-item" 
            style={{ height: '340px', cursor: 'pointer' }}
            onClick={() => handleBannerClick('Kebap')}
            title="Kebap Restoranlarını İncele"
          >
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&h=400&q=80" className="d-block w-100 h-100 object-fit-cover" alt="Bedava Teslimat" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div className="carousel-caption d-md-block text-start start-0 ps-5 pb-5">
              <span className="badge bg-brand-secondary fw-bold mb-3 fs-6">Bedava Teslimat</span>
              <h1 className="fw-bold text-white mb-2 display-6">Kebap Lezzetlerinde Gönderim Ücretsiz!</h1>
              <p className="lead text-white-50 mb-3">Belirli kebap salonlarında yapacağınız 150 TL ve üzeri siparişlerde kurye ücreti sıfır.</p>
              <span className="badge bg-light text-dark fw-semibold py-2 px-3"><i className="bi bi-eye-fill me-1"></i>Restoranları Gör</span>
            </div>
          </div>
          <div 
            className="carousel-item" 
            style={{ height: '340px', cursor: 'pointer' }}
            onClick={() => handleBannerClick('Pizza')}
            title="Pizza Restoranlarını İncele"
          >
            <img src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&h=400&q=80" className="d-block w-100 h-100 object-fit-cover" alt="Gece Lezzetleri" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div className="carousel-caption d-md-block text-start start-0 ps-5 pb-5">
              <span className="badge bg-brand-secondary fw-bold mb-3 fs-6">Gece Fırsatı</span>
              <h1 className="fw-bold text-white mb-2 display-6">Gece Acıkanlara Özel Kampanyalar</h1>
              <p className="lead text-white-50 mb-3">Saat 22:00'den sonra seçili pizza restoranlarında %25 indirim sizi bekliyor.</p>
              <span className="badge bg-light text-dark fw-semibold py-2 px-3"><i className="bi bi-eye-fill me-1"></i>Restoranları Gör</span>
            </div>
          </div>
          <div 
            className="carousel-item" 
            style={{ height: '340px', cursor: 'pointer' }}
            onClick={() => handleBannerClick('Tatlı')}
            title="Tatlı & Kahve Restoranlarını İncele"
          >
            <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&h=400&q=80" className="d-block w-100 h-100 object-fit-cover" alt="Tatlı Fırsatı" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div className="carousel-caption d-md-block text-start start-0 ps-5 pb-5">
              <span className="badge bg-brand-secondary fw-bold mb-3 fs-6">Tatlı Şöleni</span>
              <h1 className="fw-bold text-white mb-2 display-6">Tatlı ve Kahve Siparişlerine 30 TL İndirim!</h1>
              <p className="lead text-white-50 mb-3">Tatlı krizlerine özel, kampanya kodu <strong className="text-white">TATLI30</strong> ile anında indirim kazanın.</p>
              <span className="badge bg-light text-dark fw-semibold py-2 px-3"><i className="bi bi-eye-fill me-1"></i>Restoranları Gör</span>
            </div>
          </div>
          <div 
            className="carousel-item" 
            style={{ height: '340px', cursor: 'pointer' }}
            onClick={() => handleBannerClick('Uzak Doğu')}
            title="Uzak Doğu Restoranlarını İncele"
          >
            <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&h=400&q=80" className="d-block w-100 h-100 object-fit-cover" alt="Sushi Fırsatı" style={{ objectFit: 'cover', filter: 'brightness(0.5)' }} />
            <div className="carousel-caption d-md-block text-start start-0 ps-5 pb-5">
              <span className="badge bg-brand-secondary fw-bold mb-3 fs-6">Uzak Doğu Rüzgarı</span>
              <h1 className="fw-bold text-white mb-2 display-6">Sushi ve Noodle Menülerinde 1 Alana 1 Bedava!</h1>
              <p className="lead text-white-50 mb-3">En seçkin Uzak Doğu lezzetlerinde geçerli muhteşem kampanya başladı.</p>
              <span className="badge bg-light text-dark fw-semibold py-2 px-3"><i className="bi bi-eye-fill me-1"></i>Restoranları Gör</span>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#campaignCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Önceki</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#campaignCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Sonraki</span>
        </button>
      </div>

      {/* Kategori Filtre Butonları */}
      <div className="mb-4" id="restaurant-list">
        <h4 className="fw-bold mb-3">Mutfak Kategorileri</h4>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-2 transition-all ${
                selectedCategory === cat.id
                  ? 'btn-brand-primary scale-hover'
                  : 'btn-light border text-dark'
              }`}
              type="button"
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restoran Listesi Bölümü */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="fw-bold m-0">Popüler Restoranlar</h4>
          <span className="badge bg-light border text-dark py-2 px-3 fw-semibold">
            {filteredRestaurants.length} Restoran Listeleniyor
          </span>
        </div>

        {status === 'loading' && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-3 text-muted">Restoranlar listeleniyor...</p>
          </div>
        )}

        {status === 'succeeded' && filteredRestaurants.length === 0 && (
          <div className="text-center py-5 border rounded bg-white">
            <i className="bi bi-shop-window text-muted display-4"></i>
            <h5 className="fw-bold mt-3 text-secondary">Aramanızla eşleşen restoran bulunamadı.</h5>
            <p className="text-muted">Arama kelimenizi değiştirmeyi veya farklı bir kategori seçmeyi deneyin.</p>
          </div>
        )}

        {status === 'succeeded' && filteredRestaurants.length > 0 && (
          <div className="row g-4">
            {filteredRestaurants.map((res) => (
              <div key={res.id} className="col-md-6 col-lg-4">
                <div
                  onClick={() => handleRestaurantClick(res)}
                  className="card h-100 shadow-sm border-0 overflow-hidden cursor-pointer scale-hover"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative" style={{ height: '200px' }}>
                    <img
                      src={res.image}
                      alt={res.name}
                      className="w-100 h-100 object-fit-cover"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 bg-white dark:bg-dark shadow-sm m-2 px-2 py-1 rounded d-flex align-items-center gap-1">
                      <i className="bi bi-star-fill text-warning small"></i>
                      <span className="fw-bold small">{res.rating}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-truncate mb-1">{res.name}</h5>
                    <p className="card-text text-muted text-truncate mb-0">
                      <i className="bi bi-egg-fried me-1 text-brand-secondary"></i>
                      {res.cuisine}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
                    <button className="btn btn-outline-brand-primary btn-sm w-100 fw-semibold">
                      Menüyü Gör <i className="bi bi-arrow-right-short ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
