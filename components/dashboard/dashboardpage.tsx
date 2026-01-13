// components/dashboard/dashboardpage.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Building2,
  ArrowRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import { propertyService, formatRupiah } from "@/lib/services/propertyService";

interface Stats {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const properties = await propertyService.getAllProperties();
        
        // Calculate total properties
        const totalProperties = properties.length;
        
        // Calculate total tenants (mock: assume each room in active properties has a tenant)
        const totalTenants = properties.reduce((sum, prop) => {
          if (prop.status === "Aktif") {
            return sum + Math.floor((prop.jumlah_kamar ?? 0) * 0.85); // Assume 85% occupancy
          }
          return sum;
        }, 0);
        
        // Calculate total rooms and available rooms
        const totalRooms = properties.reduce((sum, prop) => sum + (prop.jumlah_kamar ?? 0), 0);
        const occupiedRooms = totalTenants;
        const availableRooms = totalRooms - occupiedRooms;
        
        // Calculate monthly revenue
        const monthlyRevenue = properties.reduce((sum, prop) => {
          if (prop.status === "Aktif") {
            const occupiedUnits = Math.floor((prop.jumlah_kamar ?? 0) * 0.85);
            return sum + (occupiedUnits * (prop.harga_per_bulan ?? 0));
          }
          return sum;
        }, 0);

        const newStats: Stats[] = [
          {
            title: "Total Properti",
            value: totalProperties,
            change: "+2 bulan ini",
            icon: Building2,
            color: "bg-blue-500",
            trend: "up"
          },
          {
            title: "Total Penyewa",
            value: totalTenants,
            change: `+${Math.ceil(totalTenants * 0.15)} bulan ini`,
            icon: Users,
            color: "bg-green-500",
            trend: "up"
          },
          {
            title: "Pendapatan Bulan Ini",
            value: formatRupiah(monthlyRevenue),
            change: "+15% dari bulan lalu",
            icon: DollarSign,
            color: "bg-purple-500",
            trend: "up"
          },
          {
            title: "Kamar Tersedia",
            value: availableRooms,
            change: `dari ${totalRooms} total kamar`,
            icon: Home,
            color: "bg-orange-500",
            trend: "neutral"
          }
        ];

        setStats(newStats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const quickActions = [
    {
      title: "Kelola Properti",
      description: "Tambah, edit, atau hapus properti kos",
      icon: Building2,
      href: "/properties",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Manajemen Penyewa",
      description: "Kelola data penyewa dan kontrak",
      icon: Users,
      href: "/tenants",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Laporan Keuangan",
      description: "Lihat pendapatan dan pengeluaran",
      icon: FileText,
      href: "/reports",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Pembayaran",
      description: "Cek status pembayaran sewa",
      icon: DollarSign,
      href: "/payments",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    }
  ];

  const recentActivities = [
    {
      title: "Pembayaran Diterima",
      description: "Kos Mawar Indah - Budi Santoso",
      time: "2 jam yang lalu",
      type: "payment"
    },
    {
      title: "Penyewa Baru",
      description: "Kos Melati - Andi Wijaya",
      time: "5 jam yang lalu",
      type: "tenant"
    },
    {
      title: "Properti Ditambahkan",
      description: "Kos Anggrek Premium",
      time: "1 hari yang lalu",
      type: "property"
    }
  ];

  const upcomingPayments = [
    {
      tenant: "Siti Nurhaliza",
      property: "Kos Mawar Indah",
      amount: "Rp 1.500.000",
      dueDate: "28 Des 2024",
      status: "pending"
    },
    {
      tenant: "Ahmad Dahlan",
      property: "Kos Melati",
      amount: "Rp 1.200.000",
      dueDate: "30 Des 2024",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Manajemen Kos
          </h1>
          <p className="text-gray-600">
            Selamat datang kembali! Berikut ringkasan bisnis kos Anda hari ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-24" />
                <div className="h-8 bg-gray-200 rounded mb-2 w-16" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend === "up" && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} rounded-xl p-6 border-2 hover:shadow-lg transition-all hover:scale-105 group`}
              >
                <action.icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-80 mb-4">{action.description}</p>
                <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all">
                  <span>Buka</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Aktivitas Terbaru
              </h2>
              <Link
                href="/activities"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === "payment"
                      ? "bg-green-100"
                      : activity.type === "tenant"
                      ? "bg-blue-100"
                      : "bg-purple-100"
                  }`}>
                    {activity.type === "payment" && (
                      <DollarSign className="w-5 h-5 text-green-600" />
                    )}
                    {activity.type === "tenant" && (
                      <Users className="w-5 h-5 text-blue-600" />
                    )}
                    {activity.type === "property" && (
                      <Building2 className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Pembayaran Mendatang
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-orange-200 bg-orange-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {payment.tenant}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {payment.property}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-200">
                    <p className="font-bold text-gray-900">
                      {payment.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Jatuh tempo: {payment.dueDate}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    2 pembayaran akan jatuh tempo minggu ini
                  </p>
                  <Link
                    href="/payments"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                  >
                    Kelola Pembayaran →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Mulai Kelola Properti Anda
              </h2>
              <p className="text-blue-100 mb-4">
                Tambahkan properti pertama Anda dan mulai mengelola bisnis kos dengan lebih efisien.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Tambah Properti
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden md:block">
              <Building2 className="w-32 h-32 text-blue-400 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}