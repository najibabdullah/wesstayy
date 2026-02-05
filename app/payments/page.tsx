"use client";

import { useEffect, useState } from "react";
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
  X,
  Plus,
  Trash2
} from "lucide-react";

interface Pembayaran {
  id: number;
  properti_id: number;
  penyewa_id: number | null;
  jumlah: number;
  tanggal_jatuh_tempo: string;
  metode_pembayaran: string;
  status: "pending" | "completed" | "failed";
  nomor_referensi: string | null;
  created_at: string;
  updated_at: string;
}

export default function PaymentsPage() {
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Pembayaran | null>(null);
  
  const [formData, setFormData] = useState({
    properti_id: "",
    penyewa_id: "",
    jumlah: "",
    tanggal_jatuh_tempo: "",
    metode_pembayaran: "transfer",
  });

  const API = "http://localhost:8000/api";

  const fetchPembayaran = async () => {
    try {
      setLoading(true);
      
      let url = `${API}/pembayaran`;
      if (selectedTab !== "all") {
        url += `?status=${selectedTab}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data");
      
      const data = await res.json();
      setPembayarans(data);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPembayaran();
  }, [selectedTab]);

  const stats = [
    {
      title: "Total Pembayaran Bulan Ini",
      value: formatCurrency(pembayarans.reduce((sum, p) => sum + Number(p.jumlah), 0)),
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Pembayaran Selesai",
      value: pembayarans.filter(p => p.status === "completed").length,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Menunggu Pembayaran",
      value: pembayarans.filter(p => p.status === "pending").length,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Gagal",
      value: pembayarans.filter(p => p.status === "failed").length,
      icon: AlertCircle,
      color: "bg-red-500",
    }
  ];

  const tabs = [
    { id: "all", label: "Semua", count: pembayarans.length },
    { id: "completed", label: "Lunas", count: pembayarans.filter(p => p.status === "completed").length },
    { id: "pending", label: "Pending", count: pembayarans.filter(p => p.status === "pending").length },
    { id: "failed", label: "Gagal", count: pembayarans.filter(p => p.status === "failed").length }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API}/pembayaran`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jumlah: parseFloat(formData.jumlah),
          properti_id: parseInt(formData.properti_id),
          penyewa_id: formData.penyewa_id ? parseInt(formData.penyewa_id) : null,
        }),
      });

      if (!res.ok) throw new Error("Gagal menambah pembayaran");

      setFormData({
        properti_id: "",
        penyewa_id: "",
        jumlah: "",
        tanggal_jatuh_tempo: "",
        metode_pembayaran: "transfer",
      });
      setShowModal(false);
      fetchPembayaran();
      
      alert("✅ Pembayaran berhasil ditambahkan!");
    } catch (err) {
      alert("❌ " + (err instanceof Error ? err.message : "Gagal menambah pembayaran"));
    }
  };

  const handleConfirmPayment = async (id: number) => {
    const nomorRef = prompt("Masukkan nomor referensi pembayaran:") || `REF${Date.now()}`;
    
    try {
      console.log('🔄 Mengirim request konfirmasi pembayaran...');
      console.log('URL:', `${API}/pembayaran/${id}`);
      console.log('Data:', { status: "completed", nomor_referensi: nomorRef });

      const res = await fetch(`${API}/pembayaran/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          nomor_referensi: nomorRef,
        }),
      });

      const responseText = await res.text();
      console.log('📥 Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Response bukan JSON valid:', responseText);
        throw new Error('Server mengembalikan response yang tidak valid');
      }

      console.log('📦 Parsed Response:', data);

      if (!res.ok) {
        const errorMessage = data.error || data.message || JSON.stringify(data);
        console.error('❌ Error dari server:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('✅ Pembayaran berhasil dikonfirmasi');
      console.log('📊 Transaction created?', data.transaction_created);

      await fetchPembayaran();
      alert(`✅ Pembayaran #${id} berhasil dikonfirmasi!${data.transaction_created ? '\n💰 Transaksi keuangan telah dicatat' : ''}`);

    } catch (err) {
      console.error('❌ Error lengkap:', err);
      alert("❌ Gagal konfirmasi pembayaran:\n" + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCancelPayment = async (id: number) => {
    if (!confirm(`Yakin ingin membatalkan pembayaran #${id}?`)) return;
    
    try {
      const res = await fetch(`${API}/pembayaran/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          status: "failed",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal batalkan pembayaran");
      }

      fetchPembayaran();
      alert(`✅ Pembayaran #${id} dibatalkan!`);
    } catch (err) {
      console.error('Error:', err);
      alert("❌ " + (err instanceof Error ? err.message : "Gagal batalkan"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Yakin ingin menghapus pembayaran #${id}? Data yang dihapus tidak dapat dikembalikan.`)) return;

    try {
      const res = await fetch(`${API}/pembayaran/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus");
      }

      fetchPembayaran();
      alert("✅ Pembayaran berhasil dihapus!");
    } catch (err) {
      console.error('Error:', err);
      alert("❌ " + (err instanceof Error ? err.message : "Gagal menghapus"));
    }
  };

  const handleShowDetail = (payment: Pembayaran) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: "completed" | "pending" | "failed") => {
    const statusConfig = {
      completed: {
        label: "Lunas",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle
      },
      pending: {
        label: "Pending",
        className: "bg-orange-100 text-orange-700",
        icon: Clock
      },
      failed: {
        label: "Gagal",
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

  function formatCurrency(amount: string | number | bigint) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(amount));
  }

  const filteredPayments = pembayarans.filter(payment => {
    const matchesSearch = 
      payment.id.toString().includes(searchQuery) ||
      payment.properti_id.toString().includes(searchQuery) ||
      (payment.nomor_referensi && payment.nomor_referensi.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading && pembayarans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

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
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Tambah Pembayaran</span>
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
                placeholder="Cari ID pembayaran, properti, atau nomor referensi..."
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
                    ID Pembayaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Properti
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Metode
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
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            #{payment.id}
                          </div>
                          {payment.nomor_referensi && (
                            <div className="text-xs text-gray-500">
                              {payment.nomor_referensi}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Properti #{payment.properti_id}
                          </div>
                          {payment.penyewa_id && (
                            <div className="text-xs text-gray-500">
                              Penyewa #{payment.penyewa_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(payment.tanggal_jatuh_tempo).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(payment.jumlah)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {payment.metode_pembayaran}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Detail */}
                        <button 
                          onClick={() => handleShowDetail(payment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Tombol Konfirmasi & Batalkan (hanya untuk pending) */}
                        {payment.status === "pending" && (
                          <>
                            <button 
                              onClick={() => handleConfirmPayment(payment.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Konfirmasi Pembayaran"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleCancelPayment(payment.id)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Batalkan"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(payment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Pembayaran"
                        >
                          <Trash2 className="w-4 h-4" />
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

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                  Ada {stats[2].value} pembayaran yang menunggu untuk dikonfirmasi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-500 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Pembayaran Gagal
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  {stats[3].value} pembayaran gagal diproses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH PEMBAYARAN */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tambah Pembayaran</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Properti
                </label>
                <input
                  type="number"
                  required
                  value={formData.properti_id}
                  onChange={(e) => setFormData({ ...formData, properti_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Contoh: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Penyewa (opsional)
                </label>
                <input
                  type="number"
                  value={formData.penyewa_id}
                  onChange={(e) => setFormData({ ...formData, penyewa_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Contoh: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Contoh: 2500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Jatuh Tempo
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal_jatuh_tempo}
                  onChange={(e) => setFormData({ ...formData, tanggal_jatuh_tempo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran
                </label>
                <select
                  value={formData.metode_pembayaran}
                  onChange={(e) => setFormData({ ...formData, metode_pembayaran: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="e_wallet">E-Wallet</option>
                  <option value="tunai">Tunai</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PEMBAYARAN */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detail Pembayaran</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">ID Pembayaran</span>
                <span className="text-sm font-bold text-gray-900">#{selectedPayment.id}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Properti</span>
                <span className="text-sm font-semibold text-gray-900">Properti #{selectedPayment.properti_id}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Penyewa</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedPayment.penyewa_id ? `Penyewa #${selectedPayment.penyewa_id}` : 'Tidak ada'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Jumlah</span>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(selectedPayment.jumlah)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Jatuh Tempo</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(selectedPayment.tanggal_jatuh_tempo).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Metode Pembayaran</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {selectedPayment.metode_pembayaran.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <div>{getStatusBadge(selectedPayment.status)}</div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Nomor Referensi</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedPayment.nomor_referensi || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Dibuat Pada</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(selectedPayment.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-600">Terakhir Diupdate</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(selectedPayment.updated_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}