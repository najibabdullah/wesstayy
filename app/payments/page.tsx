"use client";

import { useState } from "react";
import { 
  Search,
  Filter,
  Download,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Building2,
  CreditCard,
  MoreVertical,
  Eye,
  Check,
  X
} from "lucide-react";

export default function PaymentsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Summary stats
  const stats = [
    {
      title: "Total Pembayaran Bulan Ini",
      value: "Rp 72,5 Jt",
      icon: DollarSign,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pembayaran Selesai",
      value: "45",
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Menunggu Pembayaran",
      value: "8",
      icon: Clock,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Terlambat",
      value: "3",
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  // Payment data
  const payments = [
    {
      id: "PAY001",
      tenant: "Budi Santoso",
      property: "Kos Mawar Indah",
      room: "Kamar 101",
      amount: 1500000,
      dueDate: "28 Des 2024",
      paidDate: "27 Des 2024",
      status: "paid",
      method: "Transfer Bank",
      period: "Desember 2024"
    },
    {
      id: "PAY002",
      tenant: "Siti Nurhaliza",
      property: "Kos Mawar Indah",
      room: "Kamar 205",
      amount: 1500000,
      dueDate: "28 Des 2024",
      paidDate: null,
      status: "pending",
      method: "-",
      period: "Desember 2024"
    },
    {
      id: "PAY003",
      tenant: "Ahmad Dahlan",
      property: "Kos Melati",
      room: "Kamar 102",
      amount: 1200000,
      dueDate: "30 Des 2024",
      paidDate: null,
      status: "pending",
      method: "-",
      period: "Desember 2024"
    },
    {
      id: "PAY004",
      tenant: "Rina Wati",
      property: "Kos Anggrek Premium",
      room: "Kamar 301",
      amount: 1800000,
      dueDate: "25 Des 2024",
      paidDate: "25 Des 2024",
      status: "paid",
      method: "Transfer Bank",
      period: "Desember 2024"
    },
    {
      id: "PAY005",
      tenant: "Andi Wijaya",
      property: "Kos Melati",
      room: "Kamar 103",
      amount: 1200000,
      dueDate: "20 Des 2024",
      paidDate: null,
      status: "overdue",
      method: "-",
      period: "Desember 2024"
    },
    {
      id: "PAY006",
      tenant: "Dewi Lestari",
      property: "Kos Mawar Indah",
      room: "Kamar 104",
      amount: 1500000,
      dueDate: "15 Des 2024",
      paidDate: "14 Des 2024",
      status: "paid",
      method: "E-Wallet",
      period: "Desember 2024"
    },
    {
      id: "PAY007",
      tenant: "Rudi Hartono",
      property: "Kos Anggrek Premium",
      room: "Kamar 202",
      amount: 1800000,
      dueDate: "22 Des 2024",
      paidDate: null,
      status: "overdue",
      method: "-",
      period: "Desember 2024"
    },
    {
      id: "PAY008",
      tenant: "Linda Kusuma",
      property: "Kos Melati",
      room: "Kamar 201",
      amount: 1200000,
      dueDate: "10 Des 2024",
      paidDate: "09 Des 2024",
      status: "paid",
      method: "Transfer Bank",
      period: "Desember 2024"
    }
  ];

  const tabs = [
    { id: "all", label: "Semua", count: payments.length },
    { id: "paid", label: "Lunas", count: payments.filter(p => p.status === "paid").length },
    { id: "pending", label: "Pending", count: payments.filter(p => p.status === "pending").length },
    { id: "overdue", label: "Terlambat", count: payments.filter(p => p.status === "overdue").length }
  ];

  const getStatusBadge = (status: "paid" | "pending" | "overdue") => {
    const statusConfig = {
      paid: {
        label: "Lunas",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle
      },
      pending: {
        label: "Pending",
        className: "bg-orange-100 text-orange-700",
        icon: Clock
      },
      overdue: {
        label: "Terlambat",
        className: "bg-red-100 text-red-700",
        icon: XCircle
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: string | number | bigint) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(amount));
  };

  const filteredPayments = payments.filter(payment => {
    const matchesTab = selectedTab === "all" || payment.status === selectedTab;
    const matchesSearch = 
      payment.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manajemen Pembayaran
              </h1>
              <p className="text-gray-600">
                Kelola pembayaran sewa dari seluruh penyewa
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari penyewa, properti, atau ID pembayaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID / Penyewa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Properti & Kamar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr 
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {payment.tenant}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.property}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.room}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {payment.period}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.dueDate}
                      </div>
                      {payment.paidDate && (
                        <div className="text-xs text-green-600">
                          Dibayar: {payment.paidDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      {payment.method !== "-" && (
                        <div className="text-xs text-gray-500">
                          {payment.method}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(payment.status as "paid" | "pending" | "overdue")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {payment.status === "pending" || payment.status === "overdue" ? (
                          <>
                            <button 
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Konfirmasi Pembayaran"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Batalkan"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Opsi Lainnya"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada pembayaran ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Pending Payments Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-900 mb-2">
                  Pembayaran Menunggu Konfirmasi
                </h3>
                <p className="text-sm text-orange-700 mb-4">
                  Ada 8 pembayaran yang menunggu untuk dikonfirmasi. Segera periksa dan konfirmasi pembayaran yang masuk.
                </p>
                <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                  Lihat Detail →
                </button>
              </div>
            </div>
          </div>

          {/* Overdue Alert */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-500 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Pembayaran Terlambat
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  3 pembayaran sudah melewati tanggal jatuh tempo. Hubungi penyewa untuk mengingatkan pembayaran.
                </p>
                <button className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Kirim Pengingat →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}