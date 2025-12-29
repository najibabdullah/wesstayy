"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  Wallet
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Data untuk grafik tren pendapatan
  const revenueData = [
    { month: "Jan", pendapatan: 65000000, pengeluaran: 12000000 },
    { month: "Feb", pendapatan: 68000000, pengeluaran: 15000000 },
    { month: "Mar", pendapatan: 70000000, pengeluaran: 13000000 },
    { month: "Apr", pendapatan: 69000000, pengeluaran: 14000000 },
    { month: "Mei", pendapatan: 71000000, pengeluaran: 16000000 },
    { month: "Jun", pendapatan: 72000000, pengeluaran: 15000000 },
    { month: "Jul", pendapatan: 73000000, pengeluaran: 17000000 },
    { month: "Agu", pendapatan: 71500000, pengeluaran: 14000000 },
    { month: "Sep", pendapatan: 72000000, pengeluaran: 15000000 },
    { month: "Okt", pendapatan: 73500000, pengeluaran: 16000000 },
    { month: "Nov", pendapatan: 72000000, pengeluaran: 15000000 },
    { month: "Des", pendapatan: 72500000, pengeluaran: 14000000 }
  ];

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Pendapatan",
      value: "Rp 859 Jt",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Total Pengeluaran",
      value: "Rp 176 Jt",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Profit Bersih",
      value: "Rp 683 Jt",
      change: "+15.3%",
      trend: "up",
      icon: Wallet,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Margin Profit",
      value: "79.5%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  // Data transaksi detail
  const transactions = [
    {
      id: "TRX001",
      date: "28 Des 2024",
      type: "Pendapatan",
      category: "Pembayaran Sewa",
      description: "Kos Mawar Indah - Budi Santoso",
      amount: 1500000,
      status: "completed"
    },
    {
      id: "TRX002",
      date: "27 Des 2024",
      type: "Pengeluaran",
      category: "Maintenance",
      description: "Perbaikan AC - Kos Melati",
      amount: -500000,
      status: "completed"
    },
    {
      id: "TRX003",
      date: "26 Des 2024",
      type: "Pendapatan",
      category: "Pembayaran Sewa",
      description: "Kos Anggrek - Siti Nurhaliza",
      amount: 1800000,
      status: "completed"
    },
    {
      id: "TRX004",
      date: "25 Des 2024",
      type: "Pengeluaran",
      category: "Utilitas",
      description: "Tagihan Listrik - Kos Mawar",
      amount: -800000,
      status: "completed"
    },
    {
      id: "TRX005",
      date: "24 Des 2024",
      type: "Pendapatan",
      category: "Pembayaran Sewa",
      description: "Kos Melati - Ahmad Dahlan",
      amount: 1200000,
      status: "completed"
    },
    {
      id: "TRX006",
      date: "23 Des 2024",
      type: "Pengeluaran",
      category: "Internet",
      description: "Tagihan Internet Bulanan",
      amount: -1200000,
      status: "completed"
    },
    {
      id: "TRX007",
      date: "22 Des 2024",
      type: "Pendapatan",
      category: "Pembayaran Sewa",
      description: "Kos Anggrek - Rina Wati",
      amount: 1500000,
      status: "completed"
    },
    {
      id: "TRX008",
      date: "21 Des 2024",
      type: "Pengeluaran",
      category: "Kebersihan",
      description: "Gaji Cleaning Service",
      amount: -2000000,
      status: "completed"
    }
  ];

  const formatCurrency = (amount: bigint | ValueType | undefined) => {
    const numericAmount = typeof amount === 'number' || typeof amount === 'bigint' ? amount : 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numericAmount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Laporan Keuangan
              </h1>
              <p className="text-gray-600">
                Analisis pendapatan dan pengeluaran bisnis kos Anda
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6 bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Periode:</span>
            </div>
            
            <div className="flex gap-2">
              {["week", "month", "quarter", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {period === "week" && "Minggu Ini"}
                  {period === "month" && "Bulan Ini"}
                  {period === "quarter" && "Kuartal"}
                  {period === "year" && "Tahun"}
                </button>
              ))}
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">{card.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tren Pendapatan & Pengeluaran
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Perbandingan bulanan tahun 2024
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value / 1000000}Jt`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pendapatan" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Pendapatan"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pengeluaran" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Pengeluaran"
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Comparison Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Perbandingan Bulanan
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Profit per bulan tahun 2024
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value / 1000000}Jt`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar 
                  dataKey="pendapatan" 
                  fill="#3b82f6" 
                  name="Pendapatan"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="pengeluaran" 
                  fill="#f59e0b" 
                  name="Pengeluaran"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Riwayat Transaksi
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detail transaksi keuangan terbaru
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Lihat Semua</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID Transaksi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {transaction.date}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "Pendapatan"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {transaction.type === "Pendapatan" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}