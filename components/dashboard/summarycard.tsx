// components/dashboard/summarycard.tsx
"use client"

import { TrendingUp, TrendingDown, Home, AlertCircle, DollarSign, Users } from 'lucide-react'

interface SummaryData {
  totalRevenue: number
  revenueChange: number
  occupancyRate: number
  roomsOccupied: number
  totalRooms: number
  pendingPayments: number
  pendingAmount: number
  activeProperties: number
}

interface SummaryCardsProps {
  data: SummaryData
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      {/* Total Pendapatan */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${data.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.revenueChange >= 0 ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
            {Math.abs(data.revenueChange)}%
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 break-words">{formatRupiah(data.totalRevenue)}</p>
          <p className="text-[10px] md:text-xs text-gray-400">Bulan ini</p>
        </div>
      </div>

      {/* Tingkat Okupansi */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
          <div className="text-xs md:text-sm font-medium text-gray-500">
            {data.roomsOccupied}/{data.totalRooms}
          </div>
        </div>
        <div className="space-y-1 mb-3">
          <p className="text-xs md:text-sm text-gray-500">Tingkat Okupansi</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{data.occupancyRate}%</p>
          <p className="text-[10px] md:text-xs text-gray-400">Kamar terisi</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${data.occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Pembayaran Tertunda */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          </div>
          <div className="px-2 py-1 bg-red-100 text-red-700 text-[10px] md:text-xs font-medium rounded-full">
            Urgent
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-gray-500">Pembayaran Tertunda</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{data.pendingPayments}</p>
          <p className="text-[10px] md:text-xs text-red-600 font-medium break-words">{formatRupiah(data.pendingAmount)}</p>
        </div>
      </div>

      {/* Properti Aktif */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-gray-500">Properti Aktif</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{data.activeProperties}</p>
          <p className="text-[10px] md:text-xs text-gray-400">{data.totalRooms} total kamar</p>
        </div>
      </div>
    </div>
  )
}