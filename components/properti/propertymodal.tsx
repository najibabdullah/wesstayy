import { useState, useEffect } from "react";
import { AlertCircle, Loader, TicketPercent } from "lucide-react";
import { Property } from "@/lib/types/property";
import MapSelector from "../properti/mapselector";
import { FormData } from "@/lib/types/property";

// Property Modal Component
export interface PropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSave: (data: Property) => Promise<void>;
  isLoading: boolean;
  availableTypes: string[];
}

export const PropertyModal = ({
  isOpen,
  property,
  onClose,
  onSave,
  isLoading,
  availableTypes,
}: PropertyModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    lokasi: "",
    coordinates: null,
    tipe: availableTypes[0] || "Guest House",
    harga_per_bulan: "",
    tipe_harga: "bulanan", // ← TAMBAH: Default tipe harga
    jumlah_kamar: "",
    jumlah_kamar_mandi: "",
    fasilitas: [],
    deskripsi: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        nama: property.nama || "",
        lokasi: property.lokasi || "",
        coordinates:
          property.latitude && property.longitude
            ? { lat: property.latitude, lng: property.longitude }
            : null,
        tipe:
          property.tipe || property.type || availableTypes[0] || "Guest House",
        harga_per_bulan: property.harga_per_bulan?.toString() || "",
        tipe_harga: (property.tipe_harga || "bulanan") as "bulanan" | "harian", // ← TAMBAH
        jumlah_kamar: property.jumlah_kamar?.toString() || "",
        jumlah_kamar_mandi: property.jumlah_kamar_mandi?.toString() || "",
        fasilitas: property.fasilitas || [],
        deskripsi: property.deskripsi || "",
      });
      setValidationErrors([]);
    } else if (isOpen) {
      setFormData({
        nama: "",
        lokasi: "",
        coordinates: null,
        tipe: availableTypes[0] || "Guest House",
        harga_per_bulan: "",
        tipe_harga: "bulanan", // ← TAMBAH: Default tipe harga
        jumlah_kamar: "",
        jumlah_kamar_mandi: "",
        fasilitas: [],
        deskripsi: "",
      });
      setValidationErrors([]);
    }
  }, [property, isOpen, availableTypes]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.nama?.trim()) {
      errors.push("Nama properti wajib diisi");
    }
    if (!formData.lokasi?.trim()) {
      errors.push("Lokasi wajib diisi");
    }
    if (!formData.coordinates) {
      errors.push("Koordinat harus dipilih di peta");
    }
    if (!formData.harga_per_bulan || Number(formData.harga_per_bulan) <= 0) {
      errors.push("Harga harus lebih dari 0");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload: Property = {
      ...property,
      nama: formData.nama,
      lokasi: formData.lokasi,
      type: formData.tipe,
      tipe: formData.tipe,
      harga_per_bulan: Number(formData.harga_per_bulan),
      tipe_harga: formData.tipe_harga, // ← TAMBAH: Kirim tipe harga
      jumlah_kamar: Number(formData.jumlah_kamar || 0),
      jumlah_kamar_mandi: Number(formData.jumlah_kamar_mandi || 0),
      fasilitas: formData.fasilitas,
      deskripsi: formData.deskripsi,
      latitude: formData.coordinates?.lat,
      longitude: formData.coordinates?.lng,
      status: "tersedia",
      images: formData.images, // ← TAMBAH INI
    };

    try {
      await onSave(payload);
    } catch (err) {
      // Error handled in parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {property ? "Edit Properti" : "Tambah Properti"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              {validationErrors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </p>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Properti <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              placeholder="Contoh: Kos Mawar"
              aria-label="Nama properti"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Properti <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipe}
              onChange={(e) =>
                setFormData({ ...formData, tipe: e.target.value })
              }
              aria-label="Tipe properti"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableTypes.length > 0 ? (
                availableTypes.map((tipe) => (
                  <option key={tipe} value={tipe}>
                    {tipe}
                  </option>
                ))
              ) : (
                <>
                  <option value="Guest House">Guest House</option>
                  <option value="Villa">Villa</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Apartemen">Apartemen</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) =>
                setFormData({ ...formData, lokasi: e.target.value })
              }
              placeholder="Contoh: Jakarta Selatan"
              readOnly
              aria-label="Lokasi properti"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
            />
            <div className="pt-2">
              <MapSelector
                value={formData.coordinates || null}
                onChange={(c, address) => {
                  setFormData((p) => ({
                    ...p,
                    coordinates: c,
                    lokasi: address || p.lokasi,
                  }));
                }}
                height="240px"
              />
              <div className="mt-2 text-sm text-gray-600">
                {formData.coordinates ? (
                  <div>
                    Koordinat: {formData.coordinates.lat.toFixed(6)},{" "}
                    {formData.coordinates.lng.toFixed(6)}
                  </div>
                ) : (
                  <div>
                    Double-click peta untuk memilih lokasi (mengambil koordinat)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Harga <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipe_harga}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipe_harga: e.target.value as "bulanan" | "harian",
                })
              }
              aria-label="Tipe harga"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bulanan">Harga Per Bulan</option>
              <option value="harian">Harga Per Hari</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga{" "}
              {formData.tipe_harga === "bulanan" ? "per Bulan" : "per Hari"}{" "}
              (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.harga_per_bulan}
              onChange={(e) =>
                setFormData({ ...formData, harga_per_bulan: e.target.value })
              }
              placeholder={
                formData.tipe_harga === "bulanan"
                  ? "Contoh: 1200000"
                  : "Contoh: 50000"
              }
              aria-label={
                formData.tipe_harga === "bulanan"
                  ? "Harga per bulan"
                  : "Harga per hari"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Kamar
              </label>
              <input
                type="number"
                value={formData.jumlah_kamar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlah_kamar: e.target.value || "",
                  })
                }
                placeholder="15"
                aria-label="Jumlah kamar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kamar Mandi
              </label>
              <input
                type="number"
                value={formData.jumlah_kamar_mandi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlah_kamar_mandi: e.target.value,
                  })
                }
                placeholder="3"
                aria-label="Jumlah kamar mandi"
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
              onChange={(e) => {
                const facilities = e.target.value
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f);
                setFormData({ ...formData, fasilitas: facilities });
              }}
              placeholder="WiFi, AC, Kamar Mandi Dalam"
              aria-label="Fasilitas properti"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              placeholder="Deskripsi properti..."
              aria-label="Deskripsi properti"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Properti
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );
                const files = Array.from(e.dataTransfer.files);
                setFormData({
                  ...formData,
                  images: files as File[],
                });
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData({
                    ...formData,
                    images: files as File[],
                  });
                }}
                id="image-input"
                className="hidden"
                aria-label="Upload gambar"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <p className="text-sm text-gray-600">
                  Drag & drop gambar di sini atau klik untuk memilih
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG (Max 2MB per gambar)
                </p>
              </label>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${idx}`}
                      className="w-full h-20 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          images: formData.images?.filter((_, i) => i !== idx),
                        });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
