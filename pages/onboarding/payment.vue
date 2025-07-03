<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-lg w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ödeme Bilgileri</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Güvenli ödeme için kredi kartı bilgilerinizi girin</p>
        </div>

        <!-- Security Notice -->
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M3 12h6m6 0h6"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-green-800 dark:text-green-200">Güvenli Ödeme</p>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">Tüm ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir.</p>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <form @submit.prevent="handlePaymentSubmit" class="space-y-6">
          <!-- Card Number -->
          <div>
            <label for="cardNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kart Numarası <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input 
                v-model="paymentForm.cardNumber"
                @input="formatCardNumber"
                type="text" 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                maxlength="19"
                required 
                class="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary font-mono"
              >
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div v-if="cardType" class="w-8 h-5 flex items-center justify-center">
                  <img v-if="cardType === 'visa'" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTYuNzUgN0gxNC4yNUwxMi41IDE3SDE1TDE2Ljc1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjMuMjUgN0gyMC43NUwxOSAxN0gyMS41TDIzLjI1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Visa" class="w-full h-full object-contain">
                  <img v-else-if="cardType === 'mastercard'" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI3IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTIiIHI9IjciIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+Cg==" alt="Mastercard" class="w-full h-full object-contain">
                  <div v-else class="w-6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cardholder Name -->
          <div>
            <label for="cardholderName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kart Sahibinin Adı <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="paymentForm.cardholderName"
              type="text" 
              id="cardholderName" 
              placeholder="JOHN DOE" 
              required 
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary uppercase"
            >
          </div>

          <!-- Expiry Date and CVV -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="expiryDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Son Kullanma <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="paymentForm.expiryDate"
                @input="formatExpiryDate"
                type="text" 
                id="expiryDate" 
                placeholder="MM/YY" 
                maxlength="5"
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary font-mono"
              >
            </div>
            <div>
              <label for="cvv" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVV <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="paymentForm.cvv"
                type="text" 
                id="cvv" 
                placeholder="123" 
                maxlength="4"
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary font-mono"
              >
            </div>
          </div>

          <!-- Billing Address -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Fatura Adresi</h3>
            
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ülke <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="paymentForm.country"
                id="country" 
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Ülke Seçin</option>
                <option value="TR">Türkiye</option>
                <option value="US">Amerika Birleşik Devletleri</option>
                <option value="GB">Birleşik Krallık</option>
                <option value="DE">Almanya</option>
                <option value="FR">Fransa</option>
              </select>
            </div>

            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şehir <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="paymentForm.city"
                type="text" 
                id="city" 
                placeholder="İstanbul" 
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
            </div>

            <div>
              <label for="postalCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posta Kodu <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="paymentForm.postalCode"
                type="text" 
                id="postalCode" 
                placeholder="34000" 
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input 
              v-model="paymentForm.acceptTerms"
              type="checkbox" 
              id="acceptTerms" 
              required
              class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary mt-1"
            >
            <label for="acceptTerms" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
              <span class="text-red-500">*</span> 
              <a href="#" class="text-primary hover:underline">Kullanım Şartları</a> ve 
              <a href="#" class="text-primary hover:underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="!isFormValid || isProcessing"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'İşleniyor...' : 'Ödeme Bilgilerini Kaydet' }}
          </button>
        </form>

        <!-- Progress Indicator -->
        <div class="mt-8 flex items-center justify-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-3 h-3 rounded-full bg-primary"></div>
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Adım 2 / 3</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const router = useRouter()
const isProcessing = ref(false)

const paymentForm = ref({
  cardNumber: '',
  cardholderName: '',
  expiryDate: '',
  cvv: '',
  country: '',
  city: '',
  postalCode: '',
  acceptTerms: false
})

const cardType = computed(() => {
  const number = paymentForm.value.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) return 'visa'
  if (number.startsWith('5') || number.startsWith('2')) return 'mastercard'
  return null
})

const isFormValid = computed(() => {
  return paymentForm.value.cardNumber.length >= 19 &&
         paymentForm.value.cardholderName.length >= 2 &&
         paymentForm.value.expiryDate.length === 5 &&
         paymentForm.value.cvv.length >= 3 &&
         paymentForm.value.country &&
         paymentForm.value.city &&
         paymentForm.value.postalCode &&
         paymentForm.value.acceptTerms
})

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19)
  paymentForm.value.cardNumber = formattedValue
}

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  paymentForm.value.expiryDate = value
}

const handlePaymentSubmit = async () => {
  if (!isFormValid.value) return
  
  isProcessing.value = true
  
  try {
    // Simüle edilmiş ödeme işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Ödeme bilgilerini localStorage'a kaydet (gerçek uygulamada güvenli backend'e gönderilir)
    const paymentData = {
      cardLast4: paymentForm.value.cardNumber.slice(-4),
      cardType: cardType.value,
      cardholderName: paymentForm.value.cardholderName,
      country: paymentForm.value.country,
      city: paymentForm.value.city,
      postalCode: paymentForm.value.postalCode,
      paymentCompleted: true,
      paymentDate: new Date().toISOString()
    }
    
    localStorage.setItem('paymentInfo', JSON.stringify(paymentData))
    
    // Proje seçim sayfasına yönlendir
    router.push('/onboarding/project-selection')
    
  } catch (error) {
    console.error('Ödeme işlemi başarısız:', error)
    alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isProcessing.value = false
  }
}

// Renk modu için
useColorMode()

// Sayfa yüklendiğinde kontroller
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const selectedCurrency = localStorage.getItem('selectedCurrency')
  
  if (!isAuthenticated || isAuthenticated !== 'true') {
    router.push('/auth/login')
    return
  }
  
  if (!selectedCurrency) {
    router.push('/onboarding/currency')
  }
})
</script>