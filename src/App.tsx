import * as React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/SideBar/SideBar';
import Hero from './components/Hero/Hero';
import Rooms from './components/Rooms/Rooms';
import Services from './components/Services/Services';
import Where from './components/Where/Where';
import Info from './components/Info/Info';
import Footer from './components/Footer/Footer';
import Gallery from './components/Gallery/Gallery';

const SUPPORTED_LANGS = ['it', 'en'];

function LangSync() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return null;
}

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Rooms />
      <Services />
      <Where />
      <Info />
      <Footer />
    </>
  );
}

function LangLayout() {
  const { lang } = useParams<{ lang: string }>();

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/it/" replace />;
  }

  return (
    <ChakraProvider theme={theme}>
      <LangSync />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Navigate to={`/${lang}/`} replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/it/" replace />} />
          <Route path="/gallery" element={<Navigate to="/it/gallery" replace />} />
          <Route path="/:lang/*" element={<LangLayout />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
