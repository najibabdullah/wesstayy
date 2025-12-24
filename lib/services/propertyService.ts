// lib/services/propertyService.ts

const API_URL = "https://property-api-blush.vercel.app/api"

export interface Property {
  id?: string
  nama: string
  lokasi: string
  harga_per_bulan: number
  jumlah_kamar?: number
  jumlah_kamar_mandi?: number
  fasilitas?: string[]
  deskripsi?: string
  status?: string
}

export const propertyService = {
  /**
   * Get all properties
   */
  getAllProperties: async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_URL}/properti`, {
        cache: 'no-store' // Next.js specific - force fresh data
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error: any) {
      console.error("❌ Error getting properties:", error)
      throw new Error(`Gagal mengambil data properti: ${error.message}`)
    }
  },

  /**
   * Get single property by ID
   */
  getPropertyById: async (id: string): Promise<Property> => {
    try {
      const response = await fetch(`${API_URL}/properti/${id}`, {
        cache: 'no-store'
      })
      if (!response.ok) {
        throw new Error("Properti tidak ditemukan")
      }
      return await response.json()
    } catch (error) {
      console.error("❌ Error getting property:", error)
      throw error
    }
  },

  /**
   * Create new property
   */
  createProperty: async (propertyData: Property): Promise<any> => {
    try {
      if (!propertyData.nama || !propertyData.lokasi || !propertyData.harga_per_bulan) {
        throw new Error("Nama, lokasi, dan harga wajib diisi")
      }

      const response = await fetch(`${API_URL}/properti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal membuat properti")
      }

      const result = await response.json()
      console.log("✅ Property created:", result)
      return result
    } catch (error) {
      console.error("❌ Error creating property:", error)
      throw error
    }
  },

  /**
   * Update existing property
   */
  updateProperty: async (id: string, propertyData: Partial<Property>): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/properti/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal mengupdate properti")
      }

      const result = await response.json()
      console.log("✅ Property updated:", result)
      return result
    } catch (error) {
      console.error("❌ Error updating property:", error)
      throw error
    }
  },

  /**
   * Delete property
   */
  deleteProperty: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/properti/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus properti")
      }

      const result = await response.json()
      console.log("✅ Property deleted:", result)
      return result
    } catch (error) {
      console.error("❌ Error deleting property:", error)
      throw error
    }
  },

  /**
   * Search properties by name or location
   */
  searchProperties: async (query: string): Promise<Property[]> => {
    try {
      const allProperties = await propertyService.getAllProperties()
      return allProperties.filter(
        (p) =>
          p.nama?.toLowerCase().includes(query.toLowerCase()) ||
          p.lokasi?.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error("❌ Error searching properties:", error)
      throw error
    }
  },
}

/**
 * Format number to Rupiah currency
 */
export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number)
}

/**
 * Format date to Indonesian format
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}