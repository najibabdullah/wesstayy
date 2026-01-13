import { Property } from "@/lib/types/property";
import { Home, MapPin } from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatters";

// Property Card Component
export interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}
/**
 * PropertyCard Component
 *
 * A reusable card component that displays property information with image, details, and action buttons.
 *
 * @component
 * @example
 * ```tsx
 * <PropertyCard
 *   property={propertyData}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 *
 * @param {PropertyCardProps} props - The component props
 * @param {Property} props.property - The property object containing all property details
 * @param {string} props.property.id - Unique identifier for the property
 * @param {string} props.property.nama - Property name
 * @param {string} props.property.lokasi - Property location
 * @param {number} props.property.harga_per_bulan - Monthly rental price in Rupiah
 * @param {string} [props.property.tipe] - Property type (e.g., "Guest House", "Villa", "Hotel", "Apartemen")
 * @param {string} [props.property.type] - Alternative property type field
 * @param {number} [props.property.jumlah_kamar] - Number of bedrooms
 * @param {number} [props.property.jumlah_kamar_mandi] - Number of bathrooms
 * @param {Array<string>} [props.property.fasilitas] - List of facilities/amenities
 * @param {Object} [props.property.cover_image] - Property cover image object
 * @param {string} [props.property.cover_image.image_url] - URL to the cover image
 * @param {(property: Property) => void} props.onEdit - Callback function triggered when edit button is clicked
 * @param {(propertyId: string | number) => void} props.onDelete - Callback function triggered when delete button is clicked
 *
 * @returns {React.ReactElement} The rendered PropertyCard component
 */
export const PropertyCard = ({
  property,
  onEdit,
  onDelete,
}: PropertyCardProps) => {
  const getTipeBadgeColor = (tipe?: string) => {
    const colorMap: Record<string, string> = {
      "Guest House": "bg-green-500",
      Villa: "bg-purple-500",
      Hotel: "bg-orange-500",
      Apartemen: "bg-indigo-500",
    };
    return `${colorMap[tipe || ""] || "bg-blue-500"} text-white`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
        {property.cover_image?.image_url ? (
          <img
            src={property.cover_image.image_url}
            alt={property.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="w-16 h-16 text-white opacity-50" />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipeBadgeColor(
              property.tipe || property.type
            )}`}
          >
            {property.tipe || property.type || "Guest House"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {property.nama}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{property.lokasi}</p>

        <p className="text-lg font-bold text-blue-600 mb-3">
          {formatRupiah(property.harga_per_bulan)}
          <span className="text-xs text-gray-500 font-normal">/bulan</span>
        </p>

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
            {property.fasilitas.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {facility}
              </span>
            ))}
            {property.fasilitas.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{property.fasilitas.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (property.latitude && property.longitude) {
                window.open(
                  `https://www.google.com/maps/?q=${property.latitude},${property.longitude}`,
                  "_blank"
                );
              }
            }}
            disabled={!property.latitude || !property.longitude}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Lokasi
          </button>
          <button
            onClick={() => onEdit(property)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (property.id && confirm("Yakin hapus properti ini?")) {
                onDelete(property.id);
              }
            }}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
