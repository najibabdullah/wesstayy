// types/property.ts

export interface Property {
  id?: string;
  nama: string;
  lokasi: string;
  harga_per_bulan: number;
  jumlah_kamar?: number;
  jumlah_kamar_mandi?: number;
  fasilitas?: string[];
  deskripsi?: string;
  status?: string;
}

export interface PropertyStats {
  total: number;
  totalRooms: number;
}