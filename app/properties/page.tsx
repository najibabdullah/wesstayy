"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Home,
  Building2,
  Plus,
  Grid3x3,
  List,
  Loader,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/services/api";
import {
  Property,
  Price,
  PropertyImage,
  PropertyStats,
} from "@/lib/types/property";
import { PropertyCard } from "@/components/properti/propertycard";
import { PropertyModal } from "@/components/properti/propertymodal";
import { normalizeProperty } from "@/lib/utils/propertyNormalizer";
import { formatRupiah } from "@/lib/utils/formatters";

// Main App Component
export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "error"
  >("loading");
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tipe: "Semua",
    minPrice: "",
    maxPrice: "",
    minRooms: "",
  });

  // Get unique property types from data
  const DEFAULT_TYPES = ["Guest House", "Villa", "Hotel", "Apartemen"];

  const availableTypes = [
    ...new Set([
      ...DEFAULT_TYPES,
      ...properties
        .map((p) => p.tipe || p.type)
        .filter((t): t is string => Boolean(t)),
    ]),
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoadingState("loading");
    setError("");
    try {
      const res = await api.get("/properti");
      const normalized = res.data.map(normalizeProperty);
      setProperties(normalized);
      setLoadingState("idle");
    } catch (err) {
      console.error("Gagal ambil properti", err);
      setError("Gagal memuat data properti. Silakan coba lagi nanti.");
      setLoadingState("error");
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.tipe && filters.tipe !== "Semua") {
      filtered = filtered.filter((p) => (p.tipe || p.type) === filters.tipe);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => p.harga_per_bulan >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.harga_per_bulan <= Number(filters.maxPrice)
      );
    }

    if (filters.minRooms) {
      filtered = filtered.filter(
        (p) => (p.jumlah_kamar || 0) >= Number(filters.minRooms)
      );
    }

    setFilteredProperties(filtered);
  }, [searchQuery, filters, properties]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSave = async (payload: Property) => {
    setIsLoading(true);
    try {
      // ========================================
      // BUILD FORMDATA UNTUK LARAVEL API
      // ========================================
      const formData = new FormData();

      // 1. TEXT FIELDS (DASAR)
      formData.append("nama", payload.nama);
      formData.append("lokasi", payload.lokasi);
      formData.append("type", payload.type || payload.tipe || ""); // ✅ KIRIM 'type'
      formData.append("tipe", payload.tipe || "");
      formData.append("deskripsi", payload.deskripsi || "");
      formData.append("latitude", String(payload.latitude || ""));
      formData.append("longitude", String(payload.longitude || ""));
      formData.append("status", payload.status || "tersedia");
      formData.append("jumlah_kamar", String(payload.jumlah_kamar || 0));
      formData.append(
        "jumlah_kamar_mandi",
        String(payload.jumlah_kamar_mandi || 0)
      );

      // 2. FASILITAS ARRAY ✅ (append satu per satu, bukan JSON string)
      const facilities = payload.fasilitas || [];
      facilities.forEach((fasilitas, index) => {
        formData.append(`fasilitas[${index}]`, fasilitas);
      });

      // 3. PRICES ARRAY ✅ (requirement dari backend)
      // Format: prices[0][tipe_harga], prices[0][harga]
      // Value tipe_harga harus 'bulanan' atau 'harian' (sesuai enum di backend)
      const tipeHarga = payload.tipe_harga || "bulanan"; // ← TAMBAH: Ambil dari payload
      formData.append("prices[0][tipe_harga]", tipeHarga); // ← UPDATE: Gunakan tipe harga dari payload
      formData.append("prices[0][harga]", String(payload.harga_per_bulan));

      // 4. IMAGES ARRAY ✅ (append dengan suffix [])
      if (payload.images && Array.isArray(payload.images)) {
        let imageCount = 0;
        for (const image of payload.images) {
          if (image instanceof File) {
            // ✅ Gunakan suffix [] untuk array
            formData.append("images[]", image);
            imageCount++;
          }
        }
        console.log(`✅ Added ${imageCount} image(s)`);
      } else {
        console.log("⚠️ No images uploaded");
      }

      // DEBUG: Print semua FormData entries (untuk development)
      console.log("📋 FormData entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // ========================================
      // REQUEST CONFIGURATION
      // ========================================
      const requestConfig = {
        // ✅ JANGAN SET MANUAL Content-Type header
        // Axios + FormData akan auto-generate multipart boundary
      };

      if (selectedProperty?.id) {
        // ========== UPDATE ==========
        console.log(`🔄 Updating property ID: ${selectedProperty.id}`);
        const res = await api.put(
          `/properti/${selectedProperty.id}`,
          formData,
          requestConfig
        );

        setProperties(
          properties.map((p) => (p.id === selectedProperty.id ? res.data : p))
        );
        toast.success("✅ Properti berhasil diperbarui");
        closeModal();
      } else {
        // ========== CREATE ==========
        console.log("➕ Creating new property");
        const res = await api.post("/properti", formData, requestConfig);

        toast.success("✅ Properti berhasil disimpan");
        setProperties([...properties, res.data]);
        closeModal();
      }
    } catch (error: any) {
      console.error("❌ Error saving property:", error);

      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        console.error("📝 Validation errors:", errors);

        // Show first error message
        const firstError = Object.values(errors)[0];
        const errorMsg = Array.isArray(firstError)
          ? firstError[0]
          : String(firstError);

        toast.error(`❌ ${errorMsg}`);
      } else if (error.response?.status === 401) {
        toast.error("❌ Akses ditolak. Silakan login kembali.");
      } else if (error.response?.status === 500) {
        toast.error("❌ Server error. Hubungi administrator.");
      } else {
        toast.error(
          error.message || "❌ Terjadi kesalahan saat menyimpan properti"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/properti/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Gagal hapus properti", err);
      alert("Gagal menghapus properti");
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const stats = {
    total: properties.length,
    totalRooms: properties.reduce((sum, p) => sum + (p.jumlah_kamar || 0), 0),
    avgPrice:
      properties.length > 0
        ? properties.reduce((sum, p) => sum + p.harga_per_bulan, 0) /
          properties.length
        : 0,
  };

  if (loadingState === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data properti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manajemen Properti
          </h1>
          <p className="text-gray-600">Kelola properti Anda dengan mudah</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm text-red-800 font-medium">{error}</p>
              <button
                onClick={() => fetchProperties()}
                className="text-xs text-red-600 hover:text-red-700 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Properti</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Kamar</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalRooms}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <span className="text-lg font-bold">Rp</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rata-rata Harga</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatRupiah(stats.avgPrice).split(",")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Cari properti atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari properti"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filters.tipe}
              onChange={(e) => setFilters({ ...filters, tipe: e.target.value })}
              aria-label="Filter tipe properti"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Tipe</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-300">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`px-3 py-1 rounded transition-colors font-medium text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Grid3x3 className="w-4 h-4 inline mr-1" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`px-3 py-1 rounded transition-colors font-medium text-sm ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                List
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="number"
              placeholder="Min. Harga (Rp)"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              aria-label="Filter harga minimum"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max. Harga (Rp)"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              aria-label="Filter harga maksimum"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Min. Kamar"
              value={filters.minRooms}
              onChange={(e) =>
                setFilters({ ...filters, minRooms: e.target.value })
              }
              aria-label="Filter minimum kamar"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() =>
                setFilters({
                  tipe: "Semua",
                  minPrice: "",
                  maxPrice: "",
                  minRooms: "",
                })
              }
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Menampilkan {filteredProperties.length} dari {properties.length}{" "}
            properti
          </p>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Properti
          </button>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada properti
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai tambahkan properti pertama Anda
            </p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Tambah Properti
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <PropertyModal
          isOpen={isModalOpen}
          property={selectedProperty}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProperty(null);
          }}
          onSave={handleSave}
          isLoading={isLoading}
          availableTypes={
            availableTypes.length > 0
              ? availableTypes
              : ["Guest House", "Villa", "Hotel", "Apartemen"]
          }
        />
      </div>
    </div>
  );
}
