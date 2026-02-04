"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Home,
  DollarSign,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Building2
} from "lucide-react";

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [tenants, setTenants] = useState([
    {
      id: 1,
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      phone: "081234567890",
      property: "Kos Mawar Indah",
      room: "A-101",
      rentAmount: 1500000,
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      status: "active",
      paymentStatus: "paid",
      lastPayment: "2024-12-01"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti.nur@email.com",
      phone: "082345678901",
      property: "Kos Mawar Indah",
      room: "A-102",
      rentAmount: 1500000,
      startDate: "2024-03-10",
      endDate: "2025-03-10",
      status: "active",
      paymentStatus: "pending",
      lastPayment: "2024-11-01"
    },
    {
      id: 3,
      name: "Ahmad Dahlan",
      email: "ahmad.dahlan@email.com",
      phone: "083456789012",
      property: "Kos Melati",
      room: "B-205",
      rentAmount: 1200000,
      startDate: "2024-02-20",
      endDate: "2025-02-20",
      status: "active",
      paymentStatus: "pending",
      lastPayment: "2024-11-05"
    },
    {
      id: 4,
      name: "Andi Wijaya",
      email: "andi.wijaya@email.com",
      phone: "084567890123",
      property: "Kos Melati",
      room: "B-103",
      rentAmount: 1200000,
      startDate: "2024-12-20",
      endDate: "2025-12-20",
      status: "active",
      paymentStatus: "paid",
      lastPayment: "2024-12-20"
    },
    {
      id: 5,
      name: "Dewi Lestari",
      email: "dewi.lestari@email.com",
      phone: "085678901234",
      property: "Kos Anggrek Premium",
      room: "C-301",
      rentAmount: 2000000,
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      status: "expired",
      paymentStatus: "overdue",
      lastPayment: "2024-11-01"
    },
    {
      id: 6,
      name: "Riko Pratama",
      email: "riko.pratama@email.com",
      phone: "086789012345",
      property: "Kos Anggrek Premium",
      room: "C-302",
      rentAmount: 2000000,
      startDate: "2024-07-15",
      endDate: "2025-07-15",
      status: "active",
      paymentStatus: "paid",
      lastPayment: "2024-12-15"
    },
    {
      id: 7,
      name: "Rina Wijaya",
      email: "rina.w@email.com",
      phone: "087890123456",
      property: "Kos Mawar Indah",
      room: "B-201",
      rentAmount: 1800000,
      startDate: "2024-05-20",
      endDate: "2025-05-20",
      status: "active",
      paymentStatus: "paid",
      lastPayment: "2024-12-20"
    },
    {
      id: 8,
      name: "Fajri Ramadhan",
      email: "fajri.r@email.com",
      phone: "088901234567",
      property: "Kos Melati",
      room: "A-105",
      rentAmount: 1200000,
      startDate: "2024-11-01",
      endDate: "2025-02-01",
      status: "active",
      paymentStatus: "pending",
      lastPayment: "2024-11-01"
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    room: "",
    rentAmount: "",
    startDate: "",
    endDate: "",
    status: "active"
  });

  const properties = ["Kos Mawar Indah", "Kos Melati", "Kos Anggrek Premium"];

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && tenant.status === "active") ||
      (filterStatus === "expired" && tenant.status === "expired") ||
      (filterStatus === "paid" && tenant.paymentStatus === "paid") ||
      (filterStatus === "pending" && tenant.paymentStatus === "pending") ||
      (filterStatus === "overdue" && tenant.paymentStatus === "overdue");

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    expired: tenants.filter((t) => t.status === "expired").length,
    pendingPayments: tenants.filter((t) => t.paymentStatus === "pending").length,
    overduePayments: tenants.filter((t) => t.paymentStatus === "overdue").length
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = {
      id: tenants.length + 1,
      ...formData,
      rentAmount: parseFloat(formData.rentAmount),
      paymentStatus: "paid",
      lastPayment: new Date().toISOString().split("T")[0]
    };
    setTenants([...tenants, newTenant]);
    setShowAddModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      property: "",
      room: "",
      rentAmount: "",
      startDate: "",
      endDate: "",
      status: "active"
    });
  };

  const handleEditTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setTenants(
      tenants.map((t) =>
        t.id === selectedTenant.id
          ? { ...t, ...formData, rentAmount: parseFloat(formData.rentAmount) }
          : t
      )
    );
    setShowEditModal(false);
    setSelectedTenant(null);
  };

  const handleDeleteTenant = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus penyewa ini?")) {
      setTenants(tenants.filter((t) => t.id !== id));
    }
  };

  const openEditModal = (tenant: any) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      property: tenant.property,
      room: tenant.room,
      rentAmount: tenant.rentAmount.toString(),
      startDate: tenant.startDate,
      endDate: tenant.endDate,
      status: tenant.status
    });
    setShowEditModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Penyewa
          </h1>
          <p className="text-gray-600">
            Kelola data penyewa, kontrak, dan status pembayaran
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Penyewa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kadaluarsa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingPayments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Terlambat</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overduePayments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari penyewa, email, properti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="relative w-full md:w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="expired">Kadaluarsa</option>
                  <option value="paid">Sudah Bayar</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Terlambat</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => alert("Export ke Excel")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Penyewa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penyewa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properti & Kamar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Biaya Sewa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontrak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {tenant.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tenant.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {tenant.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2 mb-1">
                          <Home className="w-4 h-4 text-gray-400" />
                          {tenant.property}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                          Kamar {tenant.room}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(tenant.rentAmount)}
                      </div>
                      <div className="text-xs text-gray-500">per bulan</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="text-xs text-gray-500 mb-1">Mulai</div>
                        <div className="mb-2">{formatDate(tenant.startDate)}</div>
                        <div className="text-xs text-gray-500 mb-1">Selesai</div>
                        <div>{formatDate(tenant.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {tenant.status === "active" ? "Aktif" : "Kadaluarsa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1 ${tenant.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : tenant.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {tenant.paymentStatus === "paid"
                            ? "Lunas"
                            : tenant.paymentStatus === "pending"
                              ? "Pending"
                              : "Terlambat"}
                        </span>
                        <div className="text-xs text-gray-500">
                          {formatDate(tenant.lastPayment)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(tenant)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTenant(tenant.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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

          {filteredTenants.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada penyewa ditemukan</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedTenant(null);
            }}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showAddModal ? "Tambah Penyewa Baru" : "Edit Data Penyewa"}
                </h2>
              </div>
              <form
                onSubmit={showAddModal ? handleAddTenant : handleEditTenant}
                className="p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Properti *
                    </label>
                    <select
                      required
                      value={formData.property}
                      onChange={(e) =>
                        setFormData({ ...formData, property: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Properti</option>
                      {properties.map((prop) => (
                        <option key={prop} value={prop}>
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Kamar *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="A-101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biaya Sewa (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.rentAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rentAmount: e.target.value
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Kontrak
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Aktif</option>
                      <option value="expired">Kadaluarsa</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {showAddModal ? "Tambah Penyewa" : "Simpan Perubahan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedTenant(null);
                    }}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedTenant && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detail Penyewa
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {selectedTenant.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedTenant.name}
                    </h3>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedTenant.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {selectedTenant.status === "active" ? "Aktif" : "Kadaluarsa"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Informasi Kontak
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedTenant.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedTenant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Informasi Properti
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedTenant.property}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">Kamar {selectedTenant.room}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Informasi Kontrak
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Mulai</p>
                          <p className="text-gray-900">{formatDate(selectedTenant.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Selesai</p>
                          <p className="text-gray-900">{formatDate(selectedTenant.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Informasi Pembayaran
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Biaya Sewa</p>
                          <p className="text-gray-900 font-semibold">
                            {formatCurrency(selectedTenant.rentAmount)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedTenant.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : selectedTenant.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedTenant.paymentStatus === "paid"
                            ? "Lunas"
                            : selectedTenant.paymentStatus === "pending"
                              ? "Pending"
                              : "Terlambat"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedTenant);
                    }}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Edit Data
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}