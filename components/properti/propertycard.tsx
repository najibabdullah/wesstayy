// components/PropertyCard.tsx

import { Edit, Trash2, Home, MapPin, DollarSign } from "lucide-react";
import { Property } from "@/lib/types/property";
import { formatRupiah } from "@/lib/services/propertyService";

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function PropertyCard({
  property,
  onEdit,
  onDelete,
  isDeleting = false,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Home className="w-16 h-16 text-white opacity-50" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
            {property.status || "Aktif"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{property.nama}</h3>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{property.lokasi}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <p className="text-lg font-bold text-blue-600">
            {formatRupiah(property.harga_per_bulan)}
          </p>
          <span className="text-xs text-gray-500">/bulan</span>
        </div>

        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500">Kamar</p>
            <p className="text-sm font-bold text-gray-900">
              {property.jumlah_kamar || "-"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Kamar Mandi</p>
            <p className="text-sm font-bold text-gray-900">
              {property.jumlah_kamar_mandi || "-"}
            </p>
          </div>
        </div>

        {property.fasilitas && property.fasilitas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.fasilitas.map((facility, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {facility}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(property)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(property.id!)}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}