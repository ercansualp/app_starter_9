import { ref, computed } from 'vue'

const selectedCurrency = ref('TRY') // Varsayılan olarak TRY

export const useCurrency = () => {
  // Client-side'da localStorage'dan para birimini yükle
  if (process.client) {
    const saved = localStorage.getItem('selectedCurrency')
    if (saved) {
      selectedCurrency.value = saved
    }
  }

  const setCurrency = (currency) => {
    selectedCurrency.value = currency
    if (process.client) {
      localStorage.setItem('selectedCurrency', currency)
    }
  }

  const currencySymbol = computed(() => {
    return selectedCurrency.value === 'USD' ? '$' : '₺'
  })

  const formatCurrency = (amount) => {
    const symbol = currencySymbol.value
    const formattedAmount = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
    
    return selectedCurrency.value === 'USD' 
      ? `${symbol}${formattedAmount}`
      : `${formattedAmount}${symbol}`
  }

  return {
    selectedCurrency: readonly(selectedCurrency),
    setCurrency,
    currencySymbol,
    formatCurrency
  }
}
