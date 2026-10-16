import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { SuitesSection } from './components/SuitesSection';
import { DestinationSection } from './components/DestinationSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { AvailabilitySection } from './components/AvailabilitySection';
import { Footer } from './components/Footer';
import { MotionController } from './components/MotionController';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EB] text-[#1C1917]">
      <MotionController />
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#132A38] focus:text-[#F6F3EB] focus:rounded-xs"
      >
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="conteudo-principal" className="flex-1">
        <Hero />
        <AboutSection />
        <GallerySection />
        <SuitesSection />
        <DestinationSection />
        <AmenitiesSection />
        <AvailabilitySection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
