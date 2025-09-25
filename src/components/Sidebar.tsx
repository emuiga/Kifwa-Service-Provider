'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  PieChart,
  Users,
  History,
  ChevronDown,
  ChevronRight,
  Ship,
  Wallet,
  ChevronLeft,
  Menu,
  X,
  Building2,
  Building
} from 'lucide-react';
import Image from 'next/image';
import KifwaLogo from "../../public/optimized/Header navigation.png";

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  submenu?: {
    label: string;
    href: string;
    permission?: string;
  }[];
  permission?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Building2,
    label: 'Clearing Agents',
    submenu: [
      {
        label: 'Create Agent',
        href: '/clearing-agents/create',
      },
      {
        label: 'View Existing',
        href: '/clearing-agents/view',
      },
      {
        label: 'Manage Users',
        href: '/clearing-agents/manage-users',
      },
    ],
  },
  {
    icon: Users,
    label: 'User Management',
    href: '/user-management/users',
  },
  {
    icon: History,
    label: 'Audit',
    href: '/audit',
  },
  {
    icon: FileText,
    label: 'Marine Insurance',
    submenu: [
      {
        label: 'Insured',
        href: '/marine-insurance/insured',
      },
      {
        label: 'Uninsured',
        href: '/marine-insurance/uninsured',
      },
    ],
  },
  {
    icon: Ship,
    label: 'Custom Bonds',
    submenu: [
      {
        label: 'Application',
        href: '/bonds/application',
      },
      {
        label: 'Review',
        href: '/bonds/review',
      },
      {
        label: 'Procedure',
        href: '/bonds/procedure',
      },
    ],
  },
  {
    icon: Wallet,
    label: 'Wallet',
    href: '/wallet',
  },
  {
    icon: Building,
    label: 'Insurance Companies',
    href: '/insurance-companies',
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname() ?? '';
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('User Management');

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      
      // Set sidebar state based on screen size
      if (isMobileView) {
        // On mobile, start closed
        setIsOpen(false);
      } else {
        // On desktop, start open
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.paddingLeft = isOpen ? '256px' : '64px';
    if (isMobile) {
      document.body.style.paddingLeft = '0';
    }
    return () => {
      document.body.style.paddingLeft = '0';
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed z-50 w-8 h-8
            bg-white rounded-full
            hover:bg-blue-50 hover:text-blue-600
            border border-gray-200 shadow-sm
            flex items-center justify-center
            transition-all duration-300
            transform -translate-x-1/2
            ${isOpen ? 'left-64' : 'left-16'}
            top-24
          `}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r z-40
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}
          ${isMobile && !isOpen && '-translate-x-full'}
        `}
      >
        <nav className="p-4 text-sm">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <div className="mb-1">
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                    className={`
                      flex items-center justify-between w-full p-2 rounded-lg
                      ${item.submenu.some(subItem => pathname?.startsWith(subItem.href))
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
                      <item.icon className="h-5 w-5" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (
                      openSubmenu === item.label ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isOpen && openSubmenu === item.label && (
                    <div className="ml-10 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            block p-2 rounded-lg
                            ${pathname?.startsWith(subItem.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-600 hover:bg-gray-50'
                            }
                          `}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href ?? '#'}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg mb-1
                    ${pathname?.startsWith(item.href ?? '')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Toggle and Overlay */}
      {isMobile && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              fixed top-20 z-50 
              p-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition-colors
              ${isOpen ? 'left-[270px]' : 'left-4'}
            `}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {isOpen && (
            <div 
              className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30"
              onClick={() => setIsOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;