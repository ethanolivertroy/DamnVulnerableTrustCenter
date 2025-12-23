'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  FolderIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  ServerIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  FlagIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketSquareIcon,
  RssIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href?: string;
  icon?: any;
  children?: NavItem[];
  badge?: string;
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Tests', href: '/tests', icon: BeakerIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  {
    name: 'Compliance',
    icon: ShieldCheckIcon,
    children: [
      { name: 'Frameworks', href: '/compliance' },
      { name: 'Controls', href: '/compliance/controls' },
      { name: 'Policies', href: '/policies' },
      { name: 'Documents', href: '/compliance/documents' },
      { name: 'Audits', href: '/compliance/audits' },
    ],
  },
  { name: 'Trust Center', href: '/trust', icon: BuildingOfficeIcon },
  { name: 'Risk', href: '/risk', icon: ExclamationTriangleIcon },
  { name: 'Vendor', href: '/vendor', icon: BuildingStorefrontIcon },
  { name: 'Assets', href: '/assets', icon: ServerIcon },
  { name: 'Personnel', href: '/personnel', icon: UserGroupIcon },
  { name: 'Integrations', href: '/integrations', icon: PuzzlePieceIcon },
];

const utilityNav: NavItem[] = [
  { name: 'CTF Challenges', href: '/ctf', icon: FlagIcon, badge: '12' },
  { name: 'Admin', href: '/admin', icon: Cog6ToothIcon },
  { name: 'API Demo', href: '/api-demo', icon: CodeBracketSquareIcon },
  { name: 'Chatbot', href: '/chatbot', icon: ChatBubbleLeftRightIcon },
  { name: 'Feeds', href: '/feeds', icon: RssIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Compliance']);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    logout();
  };

  const isParentActive = (item: NavItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return false;
  };

  // Sidebar content - shared between desktop and mobile
  const SidebarContent = () => (
    <>
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isParentActive(item)
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                  </div>
                  {expandedSections.includes(item.name) ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.includes(item.name) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href || '#'}
                        className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-red-100 text-red-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href || '#'}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            CTF & Utilities
          </p>
          {utilityNav.map((item) => (
            <Link
              key={item.name}
              href={item.href || '#'}
              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* CTF Warning */}
      <div className="p-4 bg-red-50 border-t border-red-200 mt-4">
        <div className="flex items-start gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-red-800">CTF Mode Active</p>
            <p className="text-xs text-red-700 mt-1">
              This instance contains intentional vulnerabilities for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              <span className="hidden sm:inline">Damn Vulnerable Trust Center</span>
              <span className="sm:hidden">DVTC</span>
            </span>
            <span className="hidden sm:inline px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">CTF Mode</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] items-center justify-center">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] justify-center"
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.username ? user.username[0].toUpperCase() : 'A'}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <UserCircleIcon className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Cog6ToothIcon className="w-4 h-4" />
                        Settings
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarContent />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl overflow-y-auto transform transition-transform">
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">DVTC</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
