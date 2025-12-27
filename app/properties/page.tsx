// app/properties/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import PropertyCard from "@/components/properti/propertycard";
import SearchFilter from "@/components/properti/searchfilter";
import { Property } from "@/lib/types/property";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Ganti dengan API call jika sudah ada backend
  const mockProperties: Property[] = [
    {
      id: "1",
      nama: "Kos Melati Indah",
      lokasi: "Jl. Ahmad Yani No. 42, Bandung",
      harga_per_bulan: 1500000,
      jumlah_kamar: 8,
      jumlah_kamar_mandi: 4,
      fasilitas: ["WiFi", "Parkir", "Dapur Bersama", "Ruang Tamu"],
      status: "Aktif"
    },
    {
      id: "2",
      nama: "Kos Mawar Putih",
      lokasi: "Jl. Siliwangi No. 15, Bandung",
      harga_per_bulan: 1200000,
      jumlah_kamar: 6,
      jumlah_kamar_mandi: 3,
      fasilitas: ["WiFi", "Parkir", "Ruang Belajar"],
      status: "Aktif"
    },
    {
      id: "3",
      nama: "Kos Anggrek Premium",
      lokasi: "Jl. Pasteur No. 28, Bandung",
      harga_per_bulan: 2000000,
      jumlah_kamar: 10,
      jumlah_kamar_mandi: 5,
      fasilitas: ["WiFi", "Parkir", "Dapur Bersama", "Ruang Tamu", "AC di Lobby"],
      status: "Aktif"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (prop) =>
          prop.nama.toLowerCase().includes(query.toLowerCase()) ||
          prop.lokasi.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...properties];

    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(
        (prop) =>
          (!filters.minPrice || prop.harga_per_bulan >= filters.minPrice) &&
          (!filters.maxPrice || prop.harga_per_bulan <= filters.maxPrice)
      );
    }

    if (filters.minRooms) {
      filtered = filtered.filter(
        (prop) => (prop.jumlah_kamar ?? 0) >= filters.minRooms
      );
    }

    if (filters.status && filters.status !== "Semua") {
      filtered = filtered.filter((prop) => prop.status === filters.status);
    }

    setFilteredProperties(filtered);
  };

  const handleEdit = (property: Property) => {
    alert(`Edit properti: ${property.nama}`);
    // Implementasi edit nanti
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus properti ini?")) {
      setProperties(properties.filter((p) => p.id !== id));
      setFilteredProperties(filteredProperties.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properti Kos</h1>
                <p className="text-sm text-gray-600">
                  Kelola semua properti kos Anda
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              <Plus className="w-5 h-5" />
              Tambah Properti
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              Memuat properti...
            </div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-gray-500">Tidak ada properti ditemukan</p>
              <p className="text-sm text-gray-400">
                Coba ubah filter pencarian Anda
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        {filteredProperties.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-bold">{filteredProperties.length}</span> dari{" "}
              <span className="font-bold">{properties.length}</span> properti
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
