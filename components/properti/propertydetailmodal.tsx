import { Property } from "@/lib/types/property";
import { 
  X, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Tv, 
  Wifi, 
  Wind, 
  Car, 
  Waves, 
  Trees,
  Maximize2,
  ExternalLink,
  Info
} from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatters";

interface PropertyDetailModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
}

export const PropertyDetailModal = ({
  isOpen,
  property,
  onClose,
}: PropertyDetailModalProps) => {
  if (!isOpen || !property) return null;

  const getTipeBadgeColor = (tipe?: string) => {
    const colorMap: Record<string, string> = {
      "Guest House": "bg-green-100 text-green-700 border-green-200",
      Villa: "bg-purple-100 text-purple-700 border-purple-200",
      Hotel: "bg-orange-100 text-orange-700 border-orange-200",
      Apartemen: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colorMap[tipe || ""] || "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getFacilityIcon = (facility: string) => {
    const f = facility.toLowerCase();
    if (f.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (f.includes("ac")) return <Wind className="w-4 h-4" />;
    if (f.includes("tv")) return <Tv className="w-4 h-4" />;
    if (f.includes("parkir") || f.includes("garasi")) return <Car className="w-4 h-4" />;
    if (f.includes("pool") || f.includes("kolam")) return <Waves className="w-4 h-4" />;
    if (f.includes("taman") || f.includes("garden")) return <Trees className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg md:hidden hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-y-auto custom-scrollbar border-r border-gray-100">
          <div className="grid grid-cols-1 gap-2 p-2">
            {property.cover_image?.image_url ? (
              <img
                src={property.cover_image.image_url}
                alt={property.nama}
                className="w-full aspect-video md:aspect-auto md:h-80 object-cover rounded-xl shadow-sm"
              />
            ) : (
              <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center rounded-xl">
                <Home className="w-20 h-20 text-white/50" />
              </div>
            )}
            
            {/* Additional Images if any */}
            {property.images && Array.isArray(property.images) && property.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {property.images.map((img: any, idx) => (
                   <img
                   key={idx}
                   src={typeof img === 'string' ? img : (img.image_url || '')}
                   alt={`${property.nama} ${idx + 1}`}
                   className="w-full aspect-square object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                 />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTipeBadgeColor(property.tipe || property.type)}`}>
                  {property.tipe || property.type || "Guest House"}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${property.status === 'tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {property.status || 'tersedia'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                {property.nama}
              </h2>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                {property.lokasi}
              </p>
            </div>
            <button
              onClick={onClose}
              className="hidden md:flex bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Price Card */}
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Harga Sewa</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-700">
                  {formatRupiah(property.harga_per_bulan)}
                </span>
                <span className="text-gray-500 text-sm font-medium">/{property.tipe_harga || 'bulan'}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{property.jumlah_kamar || '0'}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kamar Tidur</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 transition-colors hover:bg-white hover:border-blue-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{property.jumlah_kamar_mandi || '0'}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kamar Mandi</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-1 bg-blue-600 rounded-full"></span>
                Tentang Properti
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {property.deskripsi || "Tidak ada deskripsi untuk properti ini."}
              </p>
            </div>

            {/* Facilities */}
            {property.fasilitas && property.fasilitas.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-1 bg-emerald-500 rounded-full"></span>
                  Fasilitas & Layanan
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.fasilitas.map((facility, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-100 transition-all"
                    >
                      <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                        {getFacilityIcon(facility)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Actions */}
            <div className="pt-4 space-y-3">
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
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MapPin className="w-4 h-4" />
                Buka di Google Maps
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};
