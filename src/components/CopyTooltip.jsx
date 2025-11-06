import { useState } from 'react';
import { Check } from 'lucide-react';

const CopyTooltip = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className="nav-link text-gray-300 hover:text-[#3ddad7] transition-all duration-300 relative group"
      >
        {children}
        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3ddad7] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
      </button>

      {isCopied && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-white text-[#2C2D30] rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 animate-popIn shadow-lg">
          <Check className="w-4 h-4" />
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyTooltip;
