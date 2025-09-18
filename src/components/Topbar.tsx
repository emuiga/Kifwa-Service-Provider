'use client';

import { Settings, Bell, ChevronDown, Wallet, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import KifwaLogo from "../../../public/Header navigation.png";

const getAvatarColor = (name: string) => {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100'];
  const textColors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-pink-600', 'text-yellow-600'];
  // Generate consistent color based on name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % colors.length;
  return `${colors[index]} ${textColors[index]}`;
};

interface TopbarProps {
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

const Topbar = ({ onSidebarToggle, isSidebarCollapsed }: TopbarProps = {}) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mock user info
  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@kifwa.com',
    given_name: 'John',
    family_name: 'Doe'
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (window.innerWidth >= 768) return; 
      
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else { 
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    window.addEventListener('touchmove', controlNavbar);
    window.addEventListener('touchend', () => setIsVisible(true));

    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('touchmove', controlNavbar);
      window.removeEventListener('touchend', () => setIsVisible(true));
    };
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Handle logout logic here
      console.log('Logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = () => {
    if (!userInfo) return '';
    if (userInfo.given_name && userInfo.family_name) {
      return `${userInfo.given_name.charAt(0)}${userInfo.family_name.charAt(0)}`.toUpperCase();
    }
    return userInfo.name?.slice(0, 2).toUpperCase() || '';
  };

  return (
    <div 
      className={`w-full bg-white border-b shadow-sm transition-transform duration-300 fixed top-0 left-0 z-50 ${
        !isVisible ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200" />
      
      <div className="h-16 px-6 flex items-center justify-between relative">
        <div className="flex items-center">
          <Image
            src="/optimized/kifwa-logo.png"
            alt="KIFWA Logo"
            width={140}
            height={56}
            priority
            className="h-10 w-auto"
          />
        </div>

        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-medium text-gray-900 whitespace-nowrap">
            Kifwa Service Provider
          </h1>
        </div>

        <div className="md:hidden">
          <button onClick={onSidebarToggle} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Wallet component can be added here if needed */}

          <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg outline-none"
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(userInfo.name)}`}>
                {getInitials()}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {userInfo && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                        {userInfo.name}
                      </div>
                      <div className="px-2 pb-1.5 text-xs text-gray-500">
                        {userInfo.email}
                      </div>
                    </>
                  )}
                  
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/dashboard/profile');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                  >
                    My Profile
                  </button>
                  
                  <div className="md:hidden border-t mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </button>
                  </div>

                  <div className="border-t border-gray-200 my-1" />

                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;