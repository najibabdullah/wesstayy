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

// ✅ INTERFACE DISESUAIKAN DENGAN RESPONSE LARAVEL
interface Transaction {
  id: number;
  tipe: string; // "pendapatan" atau "pengeluaran"
  jumlah: number;
  tanggal: string; // Format: "YYYY-MM-DD"
  keterangan: string; // Di Laravel kamu pakai 'keterangan' bukan 'deskripsi'
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
  margin: number; // Tambahan dari API kamu
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ GANTI DENGAN URL BACKEND LARAVEL KAMU
  const API = "http://localhost:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ FETCH 3 ENDPOINT SEKALIGUS
        const [summaryRes, chartRes, transactionRes] = await Promise.all([
          fetch(`${API}/laporan/summary`),
          fetch(`${API}/laporan/chart`),
          fetch(`${API}/laporan/transaksi`),
        ]);

        // ✅ CEK APAKAH RESPONSE OK
        if (!summaryRes.ok || !chartRes.ok || !transactionRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const summaryData = await summaryRes.json();
        const rawChartData = await chartRes.json();
        const transactionData = await transactionRes.json();

        // ✅ GENERATE DATA UNTUK SEMUA BULAN (1-12)
        const completeChartData = generateCompleteMonthData(rawChartData);

        // ✅ SET DATA KE STATE
        setSummary(summaryData);
        setChartData(completeChartData);
        
        // Laravel paginate response ada di property 'data'
        setTransactions(transactionData.data || transactionData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FUNCTION BUAT GENERATE DATA SEMUA BULAN
  const generateCompleteMonthData = (apiData: ChartDataPoint[]) => {
    // Bikin array 12 bulan dengan nilai 0
    const allMonths: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
      bulan: i + 1,
      pendapatan: 0,
      pengeluaran: 0,
    }));

    // Merge dengan data dari API
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

  // ✅ HELPER FUNCTION FORMAT RUPIAH
  const rupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  // ✅ NAMA BULAN INDONESIA
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

  // ✅ LOADING STATE
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

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Pendapatan"
              value={summary.total_pendapatan}
              color="green"
              icon="💰"
            />
            <SummaryCard
              title="Total Pengeluaran"
              value={summary.total_pengeluaran}
              color="red"
              icon="💸"
            />
            <SummaryCard
              title="Profit Bersih"
              value={summary.profit}
              color="blue"
              icon="📈"
            />
            <SummaryCard
              title="Margin"
              value={summary.margin}
              color="purple"
              icon="📊"
              isPercentage
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

          {chartData.length > 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-100">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="bulan"
                    tickFormatter={(v) => bulan[v - 1] || `Bulan ${v}`}
                    stroke="#64748b"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
                  />
                  <Tooltip
                    formatter={(v) => rupiah(typeof v === "number" ? v : 0)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelFormatter={(v) => bulan[v - 1] || `Bulan ${v}`}
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
          ) : (
            <div className="text-center py-16 text-slate-500">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg font-medium">Belum ada data grafik</p>
            </div>
          )}
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
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Keterangan
                  </th>
                  <th className="px-8 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
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
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            t.tipe === "pendapatan"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.tipe === "pendapatan" ? "💰 Pendapatan" : "💸 Pengeluaran"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-600">
                        {t.keterangan || "-"}
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
                      colSpan={4}
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
  icon: string;
  isPercentage?: boolean;
}) {
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
    purple: {
      bg: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
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
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
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