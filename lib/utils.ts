import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Türk Lirası formatında fiyat gösterimi (1.234,56 TL)
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') {
    return '0,00 TL'
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.,-]/g, '').replace(',', '.')) : price
  
  if (isNaN(numPrice)) {
    return '0,00 TL'
  }
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)
}

/**
 * Sadece sayı formatı (1.234,56) - TL olmadan
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === '') {
    return '0,00'
  }
  
  const numValue = typeof num === 'string' ? parseFloat(num.replace(/[^\d.,-]/g, '').replace(',', '.')) : num
  
  if (isNaN(numValue)) {
    return '0,00'
  }
  
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}
