"use client";

import api from "@/lib/services/api";
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
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface Transaction {
  id: number;
  tipe: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  pembayaran_id?: number | null;
  created_at: string;
  updated_at: string;
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
  margin: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = "http://localhost:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching data from API...');

        const [summaryRes, chartRes, transactionRes] = await Promise.all([
          fetch(`${API}/laporan/summary`),
          fetch(`${API}/laporan/chart`),
          fetch(`${API}/laporan/transaksi`),
        ]);

        console.log('📡 Response status:', {
          summary: summaryRes.status,
          chart: chartRes.status,
          transaction: transactionRes.status
        });

        if (!summaryRes.ok || !chartRes.ok || !transactionRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const summaryData = await summaryRes.json();
        const rawChartData = await chartRes.json();
        const transactionData = await transactionRes.json();

        console.log('📊 Raw Chart Data dari API:', rawChartData);
        console.log('📈 Summary Data:', summaryData);
        console.log('📝 Transaction Data:', transactionData);

        const completeChartData = generateCompleteMonthData(rawChartData);
        
        console.log('📊 Complete Chart Data (after generate):', completeChartData);

        setSummary(summaryData);
        setChartData(completeChartData);
        setTransactions(transactionData.data || transactionData);

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCompleteMonthData = (apiData: ChartDataPoint[]) => {
    const allMonths: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
      bulan: i + 1,
      pendapatan: 0,
      pengeluaran: 0,
    }));

    apiData.forEach((data) => {
      const monthIndex = data.bulan - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex] = {
          bulan: data.bulan,
          pendapatan: data.pendapatan,
          pengeluaran: data.pengeluaran,
        };
      }
    });

    return allMonths;
  };

  const rupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-700 font-semibold mt-6 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Laporan Keuangan
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Ringkasan performa keuangan bisnis Anda
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Pendapatan"
              value={summary.total_pendapatan}
              color="green"
              icon={<TrendingUp className="w-7 h-7" />}
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={summary.total_pengeluaran}
              color="red"
              icon={<TrendingDown className="w-7 h-7" />}
            />
            <SummaryCard
              title="Profit Bersih"
              value={summary.profit}
              color="blue"
              icon={<DollarSign className="w-7 h-7" />}
            />
            <SummaryCard
              title="Margin"
              value={summary.margin}
              color="purple"
              icon={<Percent className="w-7 h-7" />}
              isPercentage
            />
          </div>
        )}

        {/* CHART */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Grafik Keuangan
              </h2>
            </div>
            <p className="text-gray-600 ml-13">
              Perbandingan pendapatan dan pengeluaran per bulan
            </p>
          </div>

          {chartData.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="bulan"
                    tickFormatter={(v) => bulan[v - 1] || `Bulan ${v}`}
                    stroke="#6b7280"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v) => rupiah(typeof v === "number" ? v : 0)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      padding: "16px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    labelFormatter={(v) => bulan[v - 1] || `Bulan ${v}`}
                    labelStyle={{ fontWeight: "700", color: "#111827", marginBottom: "8px" }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "24px" }}
                    iconType="circle"
                    iconSize={12}
                  />
                  <Line
                    type="monotone"
                    dataKey="pendapatan"
                    stroke="#22c55e"
                    strokeWidth={4}
                    dot={{ fill: "#22c55e", r: 7, strokeWidth: 3, stroke: "#fff" }}
                    activeDot={{ r: 9, strokeWidth: 3 }}
                    name="Pendapatan"
                  />
                  <Line
                    type="monotone"
                    dataKey="pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ fill: "#ef4444", r: 7, strokeWidth: 3, stroke: "#fff" }}
                    activeDot={{ r: 9, strokeWidth: 3 }}
                    name="Pengeluaran"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900">Belum ada data grafik</p>
              <p className="text-sm text-gray-500 mt-1">Data akan muncul setelah ada transaksi</p>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Riwayat Transaksi
              </h2>
            </div>
            <p className="text-gray-600 ml-13">Daftar semua transaksi keuangan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-semibold">
                            {new Date(t.tanggal).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
                            t.tipe === "pendapatan"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                              : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {t.tipe === "pendapatan" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {t.tipe === "pendapatan" ? "Pendapatan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-medium">
                        {t.keterangan || "-"}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`text-lg font-bold ${
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
                      colSpan={4}
                      className="px-8 py-16 text-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            Belum ada transaksi
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Transaksi akan muncul di sini setelah ada aktivitas keuangan
                          </p>
                        </div>
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

function SummaryCard({
  title,
  value,
  color,
  icon,
  isPercentage = false,
}: {
  title: string;
  value: number;
  color: "green" | "red" | "blue" | "purple";
  icon: React.ReactNode;
  isPercentage?: boolean;
}) {
  const colorMap = {
    green: {
      bg: "from-green-50 via-emerald-50 to-teal-50",
      border: "border-green-200",
      text: "text-green-600",
      iconBg: "from-green-500 to-emerald-600",
      iconColor: "text-white",
    },
    red: {
      bg: "from-red-50 via-rose-50 to-pink-50",
      border: "border-red-200",
      text: "text-red-600",
      iconBg: "from-red-500 to-rose-600",
      iconColor: "text-white",
    },
    blue: {
      bg: "from-blue-50 via-indigo-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-600",
      iconBg: "from-blue-500 to-indigo-600",
      iconColor: "text-white",
    },
    purple: {
      bg: "from-purple-50 via-violet-50 to-fuchsia-50",
      border: "border-purple-200",
      text: "text-purple-600",
      iconBg: "from-purple-500 to-violet-600",
      iconColor: "text-white",
    },
  };

  const config = colorMap[color];

  return (
    <div
      className={`bg-gradient-to-br ${config.bg} rounded-2xl p-6 shadow-lg border ${config.border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${config.iconBg} rounded-xl p-3 shadow-lg ${config.iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${config.text}`}>
        {isPercentage
          ? `${value.toFixed(2)}%`
          : new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(value)}
      </p>
    </div>
  );
}