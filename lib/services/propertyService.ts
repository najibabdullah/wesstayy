import { Property } from "@/lib/types/property";
import api from "./api";
import { normalizeProperty } from "@/lib/utils/propertyNormalizer";

// Base URL yang digunakan oleh halaman-halaman lain
const API_BASE = "https://jajal.rplrus.com/api"; // Sesuai dengan api.ts

export const propertyService = {
  getAllProperties: async (): Promise<Property[]> => {
    try {
      let allProperties: Property[] = [];
      let page = 1;
      let hasMore = true;

      // Fetch semua halaman jika API menggunakan pagination
      while (hasMore) {
        const res = await api.get(`/properti?page=${page}`);
        
        // Handle response yang berbeda struktur
        let properties = [];
        
        // Jika response adalah array langsung
        if (Array.isArray(res.data)) {
          properties = res.data.map((prop: any) => normalizeProperty(prop));
          hasMore = false; // Jika array langsung, tidak ada pagination
        }
        // Jika response adalah object dengan data property (Laravel pagination)
        else if (res.data.data && Array.isArray(res.data.data)) {
          properties = res.data.data.map((prop: any) => normalizeProperty(prop));
          // Cek apakah ada halaman berikutnya
          hasMore = res.data.next_page_url !== null && res.data.next_page_url !== undefined;
        }
        // Jika response adalah object dengan current_page dan last_page
        else if (res.data.current_page !== undefined && res.data.last_page !== undefined) {
          properties = res.data.data?.map((prop: any) => normalizeProperty(prop)) || [];
          hasMore = res.data.current_page < res.data.last_page;
        }
        else {
          hasMore = false;
        }

        allProperties = [...allProperties, ...properties];
        page++;

        // Safety check untuk mencegah infinite loop
        if (page > 100) break;
      }

      console.log("✅ Properties loaded from API (Total:", allProperties.length + "):", allProperties);
      return allProperties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },

  // Get total tenants - sesuai dengan endpoint yang digunakan di halaman tenants
  getTenantsData: async (): Promise<any[]> => {
    try {
      let allTenants: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(`${API_BASE}/penyewa?page=${page}`);
        if (!res.ok) throw new Error("Gagal mengambil data penyewa");
        
        const responseData = await res.json();
        
        let tenants = [];
        // Jika response adalah array langsung
        if (Array.isArray(responseData)) {
          tenants = responseData;
          hasMore = false;
        }
        // Jika response adalah object dengan data property (Laravel pagination)
        else if (responseData.data && Array.isArray(responseData.data)) {
          tenants = responseData.data;
          hasMore = responseData.next_page_url !== null && responseData.next_page_url !== undefined;
        }
        else if (responseData.current_page !== undefined && responseData.last_page !== undefined) {
          tenants = responseData.data || [];
          hasMore = responseData.current_page < responseData.last_page;
        }
        else {
          hasMore = false;
        }

        allTenants = [...allTenants, ...tenants];
        page++;
        if (page > 100) break;
      }

      console.log("✅ Tenants loaded (Total:", allTenants.length + "):", allTenants);
      return allTenants;
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  },

  // Get payment data - sesuai dengan endpoint yang digunakan di halaman payments
  getPaymentData: async (): Promise<any[]> => {
    try {
      let allPayments: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(`${API_BASE}/pembayaran?page=${page}`);
        if (!res.ok) throw new Error("Gagal mengambil data pembayaran");
        
        const responseData = await res.json();
        
        let payments = [];
        // Jika response adalah array langsung
        if (Array.isArray(responseData)) {
          payments = responseData;
          hasMore = false;
        }
        // Jika response adalah object dengan data property (Laravel pagination)
        else if (responseData.data && Array.isArray(responseData.data)) {
          payments = responseData.data;
          hasMore = responseData.next_page_url !== null && responseData.next_page_url !== undefined;
        }
        else if (responseData.current_page !== undefined && responseData.last_page !== undefined) {
          payments = responseData.data || [];
          hasMore = responseData.current_page < responseData.last_page;
        }
        else {
          hasMore = false;
        }

        allPayments = [...allPayments, ...payments];
        page++;
        if (page > 100) break;
      }

      console.log("✅ Payments loaded (Total:", allPayments.length + "):", allPayments);
      return allPayments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },

  // Get report data - sesuai dengan endpoint yang digunakan di halaman reports
  getReportSummary: async (): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE}/laporan/summary`);
      if (!res.ok) throw new Error("Gagal mengambil laporan summary");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching report summary:", error);
      return {
        total_pendapatan: 0,
        total_pengeluaran: 0,
        profit: 0,
      };
    }
  },

  createProperty: async (propertyData: Omit<Property, "id">): Promise<Property> => {
    try {
      const res = await api.post("/properti", propertyData);
      const normalized = normalizeProperty(res.data);
      console.log("✅ Property created:", normalized);
      return normalized;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  updateProperty: async (id: number, propertyData: Partial<Property>): Promise<Property> => {
    try {
      const res = await api.put(`/properti/${id}`, propertyData);
      const normalized = normalizeProperty(res.data);
      console.log("✅ Property updated:", normalized);
      return normalized;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  deleteProperty: async (id: number): Promise<void> => {
    try {
      await api.delete(`/properti/${id}`);
      console.log("✅ Property deleted, ID:", id);
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },
};

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};