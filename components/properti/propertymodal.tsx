// components/PropertyModal.tsx

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { Property } from "@/lib/types/property";
import MapSelector from "./mapselector";

interface PropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSave: (formData: Omit<Property, "id">) => void;
  isLoading: boolean;
}

export default function PropertyModal({
  isOpen,
  property,
  onClose,
  onSave,
  isLoading,
}: PropertyModalProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facilities = e.target.value
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    setFormData((prev) => ({
      ...prev,
      fasilitas: facilities,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      nama: formData.nama,
      lokasi: formData.lokasi,
      tipe: formData.tipe,
      harga_per_bulan: Number(formData.harga_per_bulan),
      jumlah_kamar: formData.jumlah_kamar ? Number(formData.jumlah_kamar) : undefined,
      jumlah_kamar_mandi: formData.jumlah_kamar_mandi
        ? Number(formData.jumlah_kamar_mandi)
        : undefined,
      fasilitas: formData.fasilitas,
      deskripsi: formData.deskripsi,
    };
    if (formData.coordinates) payload.coordinates = formData.coordinates;
    onSave(payload as any);
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Properti
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Kos Mawar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Properti
            </label>
            <select
              name="tipe"
              value={formData.tipe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Guest House">Guest House</option>
              <option value="Villa">Villa</option>
              <option value="Hotel">Hotel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi
            </label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              placeholder="Contoh: Jakarta Selatan"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
              required
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
              Harga per Bulan (IDR)
            </label>
            <input
              type="number"
              name="harga_per_bulan"
              value={formData.harga_per_bulan}
              onChange={handleChange}
              placeholder="Contoh: 1200000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Kamar
              </label>
              <input
                type="number"
                name="jumlah_kamar"
                value={formData.jumlah_kamar}
                onChange={handleChange}
                placeholder="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kamar Mandi
              </label>
              <input
                type="number"
                name="jumlah_kamar_mandi"
                value={formData.jumlah_kamar_mandi}
                onChange={handleChange}
                placeholder="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fasilitas (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.fasilitas?.join(", ") || ""}
              onChange={handleFacilitiesChange}
              placeholder="WiFi, AC, Kamar Mandi Dalam"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Deskripsi properti..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {property ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}