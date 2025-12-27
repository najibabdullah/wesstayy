// lib/services/propertyService.ts

import { Property } from "@/lib/types/property";

// Mock data dummy
let mockProperties: Property[] = [
  {
    id: "1",
    nama: "Kos Mawar Indah",
    lokasi: "Jakarta Selatan",
    harga_per_bulan: 1500000,
    jumlah_kamar: 15,
    jumlah_kamar_mandi: 3,
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir"],
    deskripsi: "Kos nyaman dekat kampus dan pusat perbelanjaan",
    status: "Aktif",
  },
  {
    id: "2",
    nama: "Kos Melati Residence",
    lokasi: "Bandung",
    harga_per_bulan: 1200000,
    jumlah_kamar: 20,
    jumlah_kamar_mandi: 5,
    fasilitas: ["WiFi", "Dapur Bersama", "Laundry"],
    deskripsi: "Lokasi strategis dekat stasiun",
    status: "Aktif",
  },
  {
    id: "3",
    nama: "Kos Anggrek Premium",
    lokasi: "Yogyakarta",
    harga_per_bulan: 1800000,
    jumlah_kamar: 10,
    jumlah_kamar_mandi: 10,
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "TV Kabel", "Kasur Spring Bed"],
    deskripsi: "Kos eksklusif dengan fasilitas lengkap",
    status: "Aktif",
  },
];

let nextId = 4;

export const propertyService = {
  getAllProperties: async (): Promise<Property[]> => {
    // Simulasi delay API
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("✅ Properties loaded:", mockProperties);
    return [...mockProperties];
  },

  createProperty: async (propertyData: Omit<Property, "id">): Promise<Property> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (!propertyData.nama || !propertyData.lokasi || !propertyData.harga_per_bulan) {
      throw new Error("Nama, lokasi, dan harga wajib diisi");
    }

    const newProperty: Property = {
      ...propertyData,
      id: String(nextId++),
      status: propertyData.status || "Aktif",
    };

    mockProperties.push(newProperty);
    console.log("✅ Property created:", newProperty);
    return newProperty;
  },

  updateProperty: async (id: string, propertyData: Partial<Property>): Promise<Property> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Properti tidak ditemukan");
    }

    mockProperties[index] = {
      ...mockProperties[index],
      ...propertyData,
    };

    console.log("✅ Property updated:", mockProperties[index]);
    return mockProperties[index];
  },

  deleteProperty: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Properti tidak ditemukan");
    }

    mockProperties.splice(index, 1);
    console.log("✅ Property deleted, ID:", id);
  },
};

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};