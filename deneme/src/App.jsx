import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { depo } from './store/store';
import GirisSayfasi from './components/GirisSayfasi';
import AdminPaneli from './components/AdminPaneli';

// Ana uygulama içeriğini yöneten bileşen
const UygulamaIcerigi = () => {
  // Redux mağazasından giriş yapılıp yapılmadığını kontrol ediyoruz
  const { girisYapildi } = useSelector((durum) => durum.yetkilendirme);

  return girisYapildi ? <AdminPaneli /> : <GirisSayfasi />;
};

function App() {
  return (
    <Provider store={depo}>
      <UygulamaIcerigi />
    </Provider>
  );
}

export default App;
