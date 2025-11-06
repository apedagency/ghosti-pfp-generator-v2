import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Generator from './components/Generator';
import Gallery from './components/Gallery';

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleImageGenerated = (imageData) => {
    setGeneratedImages((prev) => [imageData, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#1a1b1e] relative">
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <Generator onImageGenerated={handleImageGenerated} />
        <Gallery images={generatedImages} />
      </div>
    </div>
  );
}

export default App;
