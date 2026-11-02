import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PlantIdentifier from './pages/PlantIdentifier.jsx';
import logo from './lib/branding.js';

export default function App() {
  useEffect(() => {
    let favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }

    favicon.type = 'image/png';
    favicon.href = logo;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plant-identifier" element={<PlantIdentifier />} />
    </Routes>
  );
}