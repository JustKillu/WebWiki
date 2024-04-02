import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';


const manifestForPlugin = {
  name: 'Web Wiki ',
  short_name: 'Weiki',
  description: 'Una aplicación Wiki para informacion',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: "#FFDAB9",
  icons: [
    {
      src: "/image1.png",
      sizes: "144x144",
      type: "image/png",
      purpose: "any"
    }
  ],
  screenshots: [ 
    {
      src: "/image.png",
      sizes: "1270x720",
      type: "image/png",
      form_factor:"wide"
    },
    {
      src: "/image.png", 
      sizes: "1279x720",
      type: "image/png",
    }
  ]
};

export default defineConfig({
  server: {
   
  },
  plugins: [
    react(),
    VitePWA({
      manifest: manifestForPlugin
    })
  ],
});
