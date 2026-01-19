// components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Home,
  ChevronDown,
  Zap,
  BarChart3,
  Gift,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/"
    },
    {
      title: "Properti",
      icon: Building2,
      href: "/properties",
      active: pathname === "/properties"
    },
    {
      title: "Penyewa",
      icon: Users,
      href: "/tenants",
      active: pathname === "/tenants"
    },
    {
      title: "Pembayaran",
      icon: DollarSign,
      href: "/payments",
      active: pathname === "/payments"
    },
    {
      title: "Laporan",
      icon: FileText,
      href: "/reports",
      active: pathname === "/reports"
    },
    {
      title: "Admin",
      icon: LayoutDashboard,
      submenu: [
        { title: "Dashboard Admin", href: "/admin" },
        { title: "Properti", href: "/admin/properties" },
        { title: "Pengguna", href: "/admin/users" },
        { title: "Assets", href: "/admin/assets" },
        { title: "Unit Harian", href: "/admin/daily-unit" },
        { title: "Unit Bulanan", href: "/admin/monthly-unit" },
        { title: "Performa Unit", href: "/admin/unit-performance" },
        { title: "Monitoring Harga", href: "/admin/price-monitoring" },
        {
          title: "Merchant Voucher",
          submenu: [
            { title: "Dashboard", href: "/admin/merchant-voucher/dashboard" },
            { title: "Voucher", href: "/admin/merchant-voucher/voucher" },
            { title: "Merchant", href: "/admin/merchant-voucher/merchant" },
            { title: "Pelanggan", href: "/admin/merchant-voucher/customer" },
            { title: "Klaim", href: "/admin/merchant-voucher/claims" },
          ]
        },
        {
          title: "Pricing",
          submenu: [
            { title: "Tools Scraping", href: "/admin/pricing/scraping-tools" },
            { title: "Ringkasan Scraping", href: "/admin/pricing/scraping-summary" },
          ]
        }
      ]
    }
  ];

  const bottomMenuItems = [
    {
      title: "Pengaturan",
      icon: Settings,
      href: "/settings"
    },
    {
      title: "Keluar",
      icon: LogOut,
      href: "/logout"
    }
  ];

  const toggleSubmenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">KosManager</h1>
                <p className="text-xs text-gray-500">Manajemen Kos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          expandedMenu === item.title
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedMenu === item.title ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedMenu === item.title && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.submenu.map((subitem: any) => (
                            <div key={subitem.title}>
                              {subitem.submenu ? (
                                <div>
                                  <button
                                    onClick={() => toggleSubmenu(`${item.title}-${subitem.title}`)}
                                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                  >
                                    <span>{subitem.title}</span>
                                    <ChevronDown
                                      className={`w-3 h-3 transition-transform ${
                                        expandedMenu === `${item.title}-${subitem.title}` ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                  {expandedMenu === `${item.title}-${subitem.title}` && (
                                    <div className="pl-4 space-y-1 mt-1">
                                      {subitem.submenu.map((nested: any) => (
                                        <Link
                                          key={nested.href}
                                          href={nested.href}
                                          onClick={onClose}
                                          className={`block px-4 py-2 rounded-lg text-xs transition-all ${
                                            pathname === nested.href
                                              ? "bg-blue-100 text-blue-600 font-semibold"
                                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                          }`}
                                        >
                                          {nested.title}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  href={subitem.href}
                                  onClick={onClose}
                                  className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                                    pathname === subitem.href
                                      ? "bg-blue-100 text-blue-600 font-semibold"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                  }`}
                                >
                                  {subitem.title}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        item.active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-1">
              {bottomMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@kosmanager.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}