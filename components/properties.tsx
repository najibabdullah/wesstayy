// app/properties/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Plus, Home, Loader } from "lucide-react";
import { Property } from "@/lib/types/property";
import { propertyService } from "@/lib/services/propertyService";
import StatsCard from "@/components/StatsCard";
import PropertyCard from "@/components/PropertyCard";
import PropertyTable from "@/components/PropertyTable";
import PropertyModal from "@/components/PropertyModal";
import SearchFilter from "@/components/SearchFilter";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data properti");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus properti ini?")) return;

    try {
      setIsSubmitting(true);
      await propertyService.deleteProperty(id);
      await fetchProperties(); // Refresh data
      alert("Properti berhasil dihapus");
    } catch (err) {
      alert("Gagal menghapus properti: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProperty = async (formData: Omit<Property, "id">) => {
    try {
      setIsSubmitting(true);

      if (selectedProperty?.id) {
        await propertyService.updateProperty(selectedProperty.id, formData);
        alert("Properti berhasil diupdate");
      } else {
        await propertyService.createProperty(formData);
        alert("Properti berhasil ditambahkan");
      }

      await fetchProperties(); // Refresh data
      setIsModalOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      alert("Gagal menyimpan properti: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchSearch =
      property.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const stats = {
    total: properties.length,
    totalRooms: properties.reduce((sum, p) => sum + (p.jumlah_kamar || 0), 0),
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Properti</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola semua properti kos Anda</p>
          </div>
          <button
            onClick={handleAddProperty}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Properti</span>
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchProperties}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* STATS CARDS */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Properti" value={stats.total} icon={Home} color="blue" />
            <StatsCard title="Total Kamar" value={stats.totalRooms} icon={Home} color="green" />
            <StatsCard title="Status" value="Online" icon={Home} color="purple" />
            <StatsCard title="Mode" value="Mock Data" icon={Home} color="orange" />
          </div>
        )}

        {/* SEARCH & FILTER */}
        <div className="mb-6">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Mengambil data properti...</p>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
                isDeleting={isSubmitting}
              />
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {!loading && viewMode === "table" && (
          <PropertyTable
            properties={filteredProperties}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
            isDeleting={isSubmitting}
          />
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProperties.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada properti ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "Coba ubah kata kunci pencarian Anda"
                : "Mulai tambahkan properti baru"}
            </p>
            <button
              onClick={() => (searchQuery ? setSearchQuery("") : handleAddProperty())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {searchQuery ? "Reset Pencarian" : "Tambah Properti"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <PropertyModal
        isOpen={isModalOpen}
        property={selectedProperty}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        onSave={handleSaveProperty}
        isLoading={isSubmitting}
      />
    </div>
  );
}