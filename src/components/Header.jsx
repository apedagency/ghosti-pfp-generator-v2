import { useState } from 'react';
import { Menu, X, Ghost } from 'lucide-react';
import CopyTooltip from './CopyTooltip';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Generator', href: '#generator' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Dexscreener', href: 'https://dexscreener.com', external: true },
    { label: 'Twitter', href: 'https://twitter.com', external: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2C2D30]/80 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between md:justify-center">
          <div className="flex items-center gap-2 md:hidden">
            <Ghost className="w-6 h-6 text-[#3ddad7]" />
            <span className="font-bold text-white">Ghosti</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="nav-link text-gray-300 hover:text-[#3ddad7] transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3ddad7] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
            <CopyTooltip text="apedagency">
              Contract Address
            </CopyTooltip>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#3ddad7] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fadeDown">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="text-gray-300 hover:text-[#3ddad7] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div onClick={() => setIsMenuOpen(false)}>
                <CopyTooltip text="apedagency">
                  Contract Address
                </CopyTooltip>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
