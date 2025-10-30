
import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import NoticeIcon from './icons/NoticeIcon';
import GalleryIcon from './icons/GalleryIcon';
import AdminIcon from './icons/AdminIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

// Define types for nav items
interface NavSubItem {
  id: Page;
  label: string;
}

interface NavItem {
  label: string;
  // FIX: Replaced JSX.Element with React.ReactElement to fix 'Cannot find namespace JSX' error.
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
  
  const handleSubItemClick = (page: Page) => {
    setCurrentPage(page);
    setOpenDropdown(null);
  };

  const getButtonClasses = (item: NavItem) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5";
    
    // Check if the current page matches the item's ID or any of its children's IDs.
    // Also handles the special case where 'admin' page should highlight the 'login' group.
    const isActive = currentPage === item.id || 
                   (item.id === 'login' && currentPage === 'admin') ||
                   (item.children && item.children.some(child => child.id === currentPage)) ||
                   (item.children && currentPage === 'admin' && item.children.some(child => child.id === 'login'));
                   
    if (isActive) {
      return `${baseClasses} bg-teal-600 text-white shadow-md`;
    }
    return `${baseClasses} bg-white text-gray-700 hover:bg-gray-100 hover:text-teal-600`;
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-20" ref={navRef}>
      <div className="container mx-auto flex justify-center items-center p-3 gap-4">
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubItemClick(child.id);
                        }}
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
                onClick={() => setCurrentPage(item.id as Page)}
                className={getButtonClasses(item)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;