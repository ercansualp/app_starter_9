<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hoş Geldiniz!</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Başlamadan önce para biriminizi seçin</p>
        </div>

        <!-- Currency Selection -->
        <form @submit.prevent="handleCurrencySelection" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Para Birimi Seçin
            </label>
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700" :class="selectedCurrency === 'TRY' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600'">
                <input 
                  type="radio" 
                  v-model="selectedCurrency" 
                  value="TRY" 
                  class="sr-only"
                >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                      ₺
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">Türk Lirası</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">TRY</div>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedCurrency === 'TRY' ? 'border-primary' : 'border-gray-300'">
                    <div v-if="selectedCurrency === 'TRY'" class="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              </label>

              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700" :class="selectedCurrency === 'USD' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600'">
                <input 
                  type="radio" 
                  v-model="selectedCurrency" 
                  value="USD" 
                  class="sr-only"
                >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                      $
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">Amerikan Doları</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">USD</div>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedCurrency === 'USD' ? 'border-primary' : 'border-gray-300'">
                    <div v-if="selectedCurrency === 'USD'" class="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="!selectedCurrency"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Devam Et
          </button>
        </form>

        <!-- Progress Indicator -->
        <div class="mt-8 flex items-center justify-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-primary"></div>
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Adım 1 / 3</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const router = useRouter()
const selectedCurrency = ref('')

const handleCurrencySelection = () => {
  if (!selectedCurrency.value) return
  
  // Para birimini localStorage'a kaydet
  localStorage.setItem('selectedCurrency', selectedCurrency.value)
  
  // Ödeme sayfasına yönlendir
  router.push('/onboarding/payment')
}

// Renk modu için
useColorMode()

// Sayfa yüklendiğinde auth kontrolü
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (!isAuthenticated || isAuthenticated !== 'true') {
    router.push('/auth/login')
  }
})
</script>