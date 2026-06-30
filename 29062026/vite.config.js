// Vite yapılandırma fonksiyonunu içe aktarır
import { defineConfig } from 'vite'
// Vite için React eklentisini içe aktarır
import react from '@vitejs/plugin-react'
// Vite için Tailwind CSS eklentisini içe aktarır
import tailwindcss from '@tailwindcss/vite'

// Vite yapılandırmasını dışa aktarır ve tanımlar
export default defineConfig({
  // Kullanılacak eklentileri listeleyen dizi
  plugins: [
    // React eklentisini etkinleştirir
    react(),
    // Tailwind CSS eklentisini etkinleştirir
    tailwindcss()
  ],
})

