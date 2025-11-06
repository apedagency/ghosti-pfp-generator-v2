import { useState } from 'react';
import { Download, Sparkles, Shuffle } from 'lucide-react';
import { getRandomTheme } from '../utils/themes';

const Generator = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [previewImage, setPreviewImage] = useState('/base.png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const generateImage = async (stylePrompt) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: stylePrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setPreviewImage(data.imageUrl);
      setCurrentPrompt(stylePrompt);

      if (onImageGenerated) {
        onImageGenerated({
          imageUrl: data.imageUrl,
          prompt: stylePrompt,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    generateImage(prompt);
  };

  const handleRandomStyle = () => {
    const randomTheme = getRandomTheme();
    setPrompt(randomTheme);
    generateImage(randomTheme);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `ghosti-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="generator" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Customize Your Ghosti
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[350px] aspect-square bg-[#1a1b1e] rounded-2xl overflow-hidden border border-white/10">
              {isGenerating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-[#3ddad7]/30 border-t-[#3ddad7] rounded-full animate-spin"></div>
                </div>
              ) : (
                <img
                  src={previewImage}
                  alt="Ghosti Preview"
                  className="w-full h-full object-contain transition-opacity duration-300"
                  onError={(e) => {
                    e.target.src = '/base.png';
                  }}
                />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Describe your Ghosti style
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. make Ghosti a space punk with neon visor"
                className="w-full px-4 py-3 bg-[#1a1b1e] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#3ddad7] transition-colors resize-none h-24"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-[#3ddad7] hover:to-[#2ab8b5] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>

              <button
                onClick={handleRandomStyle}
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-[#1a1b1e] hover:bg-[#25262a] text-purple-400 font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                Use Random Style
              </button>

              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#3ddad7] to-[#2ab8b5] hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Generator;
