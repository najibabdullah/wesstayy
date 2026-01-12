import { Price, Property } from "../types/property";

/**
 * Normalize API response to match component expectations
 */
export const normalizeProperty = (apiProperty: any): Property => {
  // Parse fasilitas if it's a JSON string
  let fasilitas = apiProperty.fasilitas || [];
  if (typeof fasilitas === "string") {
    try {
      fasilitas = JSON.parse(fasilitas);
    } catch {
      fasilitas = fasilitas.split(",").map((f: string) => f.trim());
    }
  }

  // Get price from prices array
  const monthlyPrice = apiProperty.prices?.find(
    (p: Price) => p.tipe_harga === "bulanan"
  );
  const harga_per_bulan = monthlyPrice
    ? Number(monthlyPrice.harga)
    : Number(apiProperty.harga_per_bulan || 0);

  return {
    ...apiProperty,
    type: apiProperty.type || apiProperty.tipe,
    tipe: apiProperty.type || apiProperty.tipe,
    harga_per_bulan,
    fasilitas: Array.isArray(fasilitas) ? fasilitas : [],
    latitude: Number(apiProperty.latitude || 0),
    longitude: Number(apiProperty.longitude || 0),
  };
};
