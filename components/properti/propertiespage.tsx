import React, { useState, useEffect } from 'react';
import { Home, Building2, Plus, Grid3x3, List, Loader } from 'lucide-react';
import MapSelector from './mapselector';

// Types
interface Property {
  id?: string;
  nama: string;
  lokasi: string;
  tipe?: string;
  harga_per_bulan: number;
  jumlah_kamar?: number;
  jumlah_kamar_mandi?: number;
  fasilitas?: string[];
  deskripsi?: string;
  status?: string;
}

// Utility function
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Property Modal Component
const PropertyModal = ({ isOpen, property, onClose, onSave, isLoading }: any) => {
  const [formData, setFormData] = useState({
    nama: "",
    lokasi: "",
    coordinates: null as { lat: number; lng: number } | null,
    tipe: "Guest House",
    harga_per_bulan: "",
    jumlah_kamar: "",
    jumlah_kamar_mandi: "",
    fasilitas: [] as string[],
    deskripsi: "",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        nama: property.nama || "",
        lokasi: property.lokasi || "",
        coordinates: (property as any).coordinates || null,
        tipe: property.tipe || "Guest House",
        harga_per_bulan: property.harga_per_bulan?.toString() || "",
        jumlah_kamar: property.jumlah_kamar?.toString() || "",
        jumlah_kamar_mandi: property.jumlah_kamar_mandi?.toString() || "",
        fasilitas: property.fasilitas || [],
        deskripsi: property.deskripsi || "",
      });
    } else {
      setFormData({
        nama: "",
        lokasi: "",
        coordinates: null,
        tipe: "Guest House",
        harga_per_bulan: "",
        jumlah_kamar: "",
        jumlah_kamar_mandi: "",
        fasilitas: [],
        deskripsi: "",
      });
    }
  }, [property, isOpen]);

  const handleSubmit = () => {
    if (!formData.nama || !formData.lokasi || !formData.harga_per_bulan) {
      alert("Mohon lengkapi data yang wajib diisi");
      return;
    }
    
    const payload: any = {
      ...property,
      nama: formData.nama,
      lokasi: formData.lokasi,
      tipe: formData.tipe,
      harga_per_bulan: Number(formData.harga_per_bulan),
      jumlah_kamar: formData.jumlah_kamar ? Number(formData.jumlah_kamar) : undefined,
      jumlah_kamar_mandi: formData.jumlah_kamar_mandi ? Number(formData.jumlah_kamar_mandi) : undefined,
      fasilitas: formData.fasilitas,
      deskripsi: formData.deskripsi,
    };
    if (formData.coordinates) payload.coordinates = formData.coordinates;
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {property ? "Edit Properti" : "Tambah Properti"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Properti <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Kos Mawar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Properti <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipe}
              onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Guest House">Guest House</option>
              <option value="Villa">Villa</option>
              <option value="Hotel">Hotel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              placeholder="Contoh: Jakarta Selatan"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
            />
            <div className="pt-2">
              <MapSelector
                value={formData.coordinates || null}
                onChange={(c, address) => {
                  setFormData((p) => ({ 
                    ...p, 
                    coordinates: c,
                    lokasi: address || p.lokasi
                  }));
                }}
                height="240px"
              />
              <div className="mt-2 text-sm text-gray-600">
                {formData.coordinates ? (
                  <div>
                    Koordinat: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                  </div>
                ) : (
                  <div>Double-click peta untuk memilih lokasi (mengambil koordinat)</div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga per Bulan (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.harga_per_bulan}
              onChange={(e) => setFormData({ ...formData, harga_per_bulan: e.target.value })}
              placeholder="Contoh: 1200000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kamar</label>
              <input
                type="number"
                value={formData.jumlah_kamar}
                onChange={(e) => setFormData({ ...formData, jumlah_kamar: e.target.value })}
                placeholder="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kamar Mandi</label>
              <input
                type="number"
                value={formData.jumlah_kamar_mandi}
                onChange={(e) => setFormData({ ...formData, jumlah_kamar_mandi: e.target.value })}
                placeholder="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fasilitas (pisahkan dengan koma)</label>
            <input
              type="text"
              value={formData.fasilitas?.join(", ") || ""}
              onChange={(e) => {
                const facilities = e.target.value.split(",").map((f) => f.trim()).filter((f) => f);
                setFormData({ ...formData, fasilitas: facilities });
              }}
              placeholder="WiFi, AC, Kamar Mandi Dalam"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Deskripsi properti..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {property ? "Update" : "Tambah"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, onEdit, onDelete }: any) => {
  const getTipeBadgeColor = (tipe?: string) => {
    switch (tipe) {
      case "Guest House": return "bg-green-500 text-white";
      case "Villa": return "bg-purple-500 text-white";
      case "Hotel": return "bg-orange-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <Home className="w-16 h-16 text-white opacity-50" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipeBadgeColor(property.tipe)}`}>
            {property.tipe || "Guest House"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{property.nama}</h3>
        <p className="text-sm text-gray-600 mb-3">{property.lokasi}</p>
        
        <p className="text-lg font-bold text-blue-600 mb-3">
          {formatRupiah(property.harga_per_bulan)}
          <span className="text-xs text-gray-500 font-normal">/bulan</span>
        </p>

        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500">Kamar</p>
            <p className="text-sm font-bold text-gray-900">{property.jumlah_kamar || "-"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Kamar Mandi</p>
            <p className="text-sm font-bold text-gray-900">{property.jumlah_kamar_mandi || "-"}</p>
          </div>
        </div>

        {property.fasilitas && property.fasilitas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.fasilitas.slice(0, 3).map((facility: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                {facility}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(property)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tipe: "Semua",
    minPrice: "",
    maxPrice: "",
    minRooms: "",
  });

  // Load initial data from memory
  useEffect(() => {
    const sampleData: Property[] = [
      {
        id: "1",
        nama: "Guest House Melati",
        lokasi: "Jakarta Selatan",
        tipe: "Guest House",
        harga_per_bulan: 1500000,
        jumlah_kamar: 10,
        jumlah_kamar_mandi: 5,
        fasilitas: ["WiFi", "AC", "Parkir"],
        deskripsi: "Guest house nyaman di Jakarta Selatan"
      },
      {
        id: "2",
        nama: "Villa Sunset",
        lokasi: "Bali",
        tipe: "Villa",
        harga_per_bulan: 5000000,
        jumlah_kamar: 4,
        jumlah_kamar_mandi: 3,
        fasilitas: ["Pool", "WiFi", "Garden"],
        deskripsi: "Villa mewah dengan pemandangan sunset"
      }
    ];
    setProperties(sampleData);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tipe filter
    if (filters.tipe && filters.tipe !== "Semua") {
      filtered = filtered.filter((p) => p.tipe === filters.tipe);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.harga_per_bulan >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.harga_per_bulan <= Number(filters.maxPrice));
    }

    // Rooms filter
    if (filters.minRooms) {
      filtered = filtered.filter((p) => (p.jumlah_kamar || 0) >= Number(filters.minRooms));
    }

    setFilteredProperties(filtered);
  }, [searchQuery, filters, properties]);

  const handleSave = async (propertyData: Property) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedProperty?.id) {
        const updated = properties.map((p) =>
          p.id === selectedProperty.id ? { ...propertyData, id: selectedProperty.id } : p
        );
        setProperties(updated);
      } else {
        const newProperty = { ...propertyData, id: Date.now().toString() };
        setProperties([...properties, newProperty]);
      }
      
      setIsModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus properti ini?")) {
      const updated = properties.filter((p) => p.id !== id);
      setProperties(updated);
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
    avgPrice: properties.length > 0
      ? properties.reduce((sum, p) => sum + p.harga_per_bulan, 0) / properties.length
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Properti</h1>
          <p className="text-gray-600">Kelola properti Anda dengan mudah</p>
        </div>

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
                <p className="text-xl font-bold text-gray-900">{stats.totalRooms}</p>
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
                  {formatRupiah(stats.avgPrice).split(',')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Cari properti atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filters.tipe}
              onChange={(e) => setFilters({ ...filters, tipe: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Semua</option>
              <option>Guest House</option>
              <option>Villa</option>
              <option>Hotel</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Harga minimum"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Harga maksimum"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Minimum kamar"
              value={filters.minRooms}
              onChange={(e) => setFilters({ ...filters, minRooms: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Menampilkan {filteredProperties.length} dari {properties.length} properti
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada properti</h3>
            <p className="text-gray-600 mb-4">Mulai tambahkan properti pertama Anda</p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Tambah Properti
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
        />
      </div>
    </div>
  );
}