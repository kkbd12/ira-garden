import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import NoticeIcon from './icons/NoticeIcon';
import GalleryIcon from './icons/GalleryIcon';
import AdminIcon from './icons/AdminIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';

// Define types for nav items
interface NavSubItem {
  id: Page;
  label: string;
}

interface NavItem {
  label: string;
  icon: React.ReactElement;
  id?: Page;
  children?: NavSubItem[];
}


interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    { id: 'home', label: 'হোম', icon: <HomeIcon /> },
    { id: 'notice', label: 'নোটিশ বোর্ড', icon: <NoticeIcon /> },
    { id: 'gallery', label: 'ফটো গ্যালারী', icon: <GalleryIcon /> },
    { 
      id: 'login', // For highlighting group
      label: 'অ্যাডমিন', 
      icon: <AdminIcon />,
      children: [
        { id: 'login', label: 'অ্যাডমিন প্যানেল' },
      ]
    },
  ];

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  
  const handlePageSelect = (page: Page) => {
    setCurrentPage(page);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const getButtonClasses = (item: NavItem, isMobile: boolean = false) => {
    const baseClasses = isMobile 
      ? "flex items-center gap-3 px-3 py-2 rounded-md font-medium w-full text-left"
      : "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5";
    
    // Check if the current page matches the item's ID or any of its children's IDs.
    // Also handles the special case where 'admin' page should highlight the 'login' group.
    const isActive = currentPage === item.id || 
                   (item.id === 'login' && currentPage === 'admin') ||
                   (item.children && item.children.some(child => child.id === currentPage)) ||
                   (item.children && currentPage === 'admin' && item.children.some(child => child.id === 'login'));
                   
    if (isActive) {
      return `${baseClasses} bg-teal-600 text-white shadow-md`;
    }
    return `${baseClasses} ${isMobile ? 'text-gray-700 hover:bg-gray-100' : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`;
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-20" ref={navRef}>
      <div className="container mx-auto flex justify-between items-center p-3">
        {/* Site Title on Mobile */}
        <div className="md:hidden">
            <span className="font-bold text-xl text-teal-700">ইরা গার্ডেন</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center items-center gap-4 flex-grow">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() => handleToggleDropdown(item.label)}
                    className={`${getButtonClasses(item)} w-full justify-between`}
                    style={{minWidth: '140px'}}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDownIcon className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      {item.children.map(child => (
                        <a
                          key={child.id}
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageSelect(child.id); }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handlePageSelect(item.id as Page)}
                  className={getButtonClasses(item)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
             {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleToggleDropdown(item.label)}
                      className={`${getButtonClasses(item, true)} w-full justify-between`}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronDownIcon className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-8 mt-1 space-y-1">
                        {item.children.map(child => (
                          <a
                            key={child.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageSelect(child.id); }}
                            className="block w-full text-left px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-teal-50"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handlePageSelect(item.id as Page)}
                    className={getButtonClasses(item, true)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
