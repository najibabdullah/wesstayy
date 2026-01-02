"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Transaction {
  id: number;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  tipe: string;
}

interface ChartDataPoint {
  bulan: number;
  pendapatan: number;
  pengeluaran: number;
}

interface Summary {
  total_pendapatan: number;
  total_pengeluaran: number;
  profit: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8000/api";

  useEffect(() => {
    Promise.all([
      fetch(`${API}/laporan/summary`).then((res) => res.json()),
      fetch(`${API}/laporan/chart`).then((res) => res.json()),
      fetch(`${API}/laporan/transaksi`).then((res) => res.json()),
    ])
      .then(([summaryData, chartData, transactionData]) => {
        setSummary(summaryData);
        setChartData(chartData);
        setTransactions(transactionData.data || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback data untuk demo
        setSummary({
          total_pendapatan: 1500000,
          total_pengeluaran: 0,
          profit: 1500000,
        });
        setChartData([{ bulan: 1, pendapatan: 1500000, pengeluaran: 0 }]);
        setTransactions([
          {
            id: 1,
            tanggal: "2025-01-15",
            kategori: "Penjualan",
            deskripsi: "Penjualan produk bulan ini",
            jumlah: 1500000,
            tipe: "pendapatan",
          },
        ]);
        setLoading(false);
      });
  }, []);

  const rupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Laporan Keuangan
              </h1>
              <p className="text-slate-600 text-lg">
                Ringkasan performa keuangan bisnis Anda
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                Data Terkini
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Pendapatan"
              value={summary.total_pendapatan}
              color="green"
              icon="💰"
              trend="+12%"
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={summary.total_pengeluaran}
              color="red"
              icon="💸"
              trend="-5%"
            />
            <SummaryCard
              title="Profit Bersih"
              value={summary.profit}
              color="blue"
              icon="📈"
              trend="+18%"
            />
          </div>
        )}

        {/* CHART */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Grafik Keuangan
            </h2>
            <p className="text-slate-600">
              Perbandingan pendapatan dan pengeluaran per bulan
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-100">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="bulan"
                  tickFormatter={(v) => bulan[v - 1]}
                  stroke="#64748b"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                  formatter={(v) => rupiah(v)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: "600", color: "#1e293b" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="pendapatan"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Pendapatan"
                />
                <Line
                  type="monotone"
                  dataKey="pengeluaran"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Pengeluaran"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Riwayat Transaksi
            </h2>
            <p className="text-slate-600">
              Daftar semua transaksi keuangan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Deskripsi
                  </th>
                  <th className="px-8 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((t, idx) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-8 py-5 text-slate-700 font-medium">
                        {new Date(t.tanggal).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {t.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-600">
                        {t.deskripsi}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`text-base font-bold ${
                            t.tipe === "pendapatan"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {t.tipe === "pendapatan" ? "+" : "-"}
                          {rupiah(t.jumlah)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-6xl opacity-50">📊</div>
                        <p className="text-lg font-medium">
                          Belum ada transaksi
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function SummaryCard({ title, value, color, icon, trend }) {
  const colorMap = {
    green: {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-600",
      iconBg: "bg-green-100",
    },
    red: {
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-600",
      iconBg: "bg-red-100",
    },
    blue: {
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
  };

  const config = colorMap[color];

  return (
    <div
      className={`bg-gradient-to-br ${config.bg} rounded-2xl p-6 shadow-sm border ${config.border} hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${config.iconBg} rounded-xl p-3 text-2xl`}>
          {icon}
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${config.iconBg} ${config.text}`}
        >
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${config.text}`}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value)}
      </p>
    </div>
  );
}