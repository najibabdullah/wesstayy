// Enhanced Types
export interface Price {
  id?: number;
  properti_id?: number;
  tipe_harga: string;
  harga: string | number;
  is_weekend?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

export interface PropertyImage {
  id?: number;
  properti_id?: number;
  image_path: string;
  is_cover: number;
  image_url?: string;
}

export interface Property {
  id?: number;
  nama: string;
  type?: string; // API uses 'type'
  tipe?: string; // Component uses 'tipe'
  lokasi: string;
  harga_per_bulan: number;
  tipe_harga?: "bulanan" | "harian"; // ← TAMBAH: Tipe harga properti
  jumlah_kamar?: number;
  jumlah_kamar_mandi?: number;
  fasilitas: string[];
  deskripsi?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  // Images
  images?: PropertyImage[] | File[]; // ← UBAH JADI INI
  cover_image?: PropertyImage;
  prices?: Price[];
  created_at?: string;
  updated_at?: string;
}

export interface FormData {
  nama: string;
  lokasi: string;
  coordinates: { lat: number; lng: number } | null;
  tipe: string;
  harga_per_bulan: string;
  tipe_harga: "bulanan" | "harian"; // ← TAMBAH: Pilihan tipe harga
  jumlah_kamar: string;
  jumlah_kamar_mandi: string;
  fasilitas: string[];
  deskripsi: string;
  images?: File[]; // ← TAMBAH INI
}

export interface PropertyStats {
  total: number;
  totalRooms: number;
}
