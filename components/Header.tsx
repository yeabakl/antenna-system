
import React, { useState } from 'react';
import { CloseIcon } from './icons';

// Using inline SVG for menu icon as it's not in icons.tsx
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

// Using inline SVG for settings icon
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


interface HeaderProps {
  onNavigate: (page: string) => void;
  onOpenSettings: () => void;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenSettings, activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'training', label: 'Training' },
    { id: 'letters', label: 'Letters' },
    { id: 'reports', label: 'Reports' },
    { id: 'products', label: 'Products' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleNavigate('home')}>
                <span className="font-bold text-blue-400">Antenna</span> Manufacturing & Business Consultancy
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center">
             <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activePage === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
            <button
              onClick={onOpenSettings}
              className="ml-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label="Open settings"
            >
              <SettingsIcon />
            </button>
          </div>
          <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                    <CloseIcon className="h-6 w-6" />
                ) : (
                    <MenuIcon />
                )}
              </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navItems.map((item) => (
                      <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              activePage === item.id
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                          {item.label}
                      </button>
                  ))}
                   <button
                        onClick={() => { onOpenSettings(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        Settings
                    </button>
              </div>
          </div>
      )}
    </header>
  );
};

export default Header;
