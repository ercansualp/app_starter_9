<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">İki Faktörlü Doğrulama</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Güvenlik için doğrulama yöntemini seçin</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400 mr-3 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Provider Selection -->
        <form @submit.prevent="handleProviderSelection" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Doğrulama Yöntemi Seçin
            </label>
            <div class="space-y-3">
              <!-- SMS Option -->
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700" :class="selectedProvider === 'sms' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600'">
                <input 
                  type="radio" 
                  v-model="selectedProvider" 
                  value="sms" 
                  class="sr-only"
                >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">SMS</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">Telefon numaranıza kod gönderilir</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">+90 *** *** **34</div>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedProvider === 'sms' ? 'border-primary' : 'border-gray-300'">
                    <div v-if="selectedProvider === 'sms'" class="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              </label>

              <!-- Email Option -->
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700" :class="selectedProvider === 'email' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600'">
                <input 
                  type="radio" 
                  v-model="selectedProvider" 
                  value="email" 
                  class="sr-only"
                >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">E-posta</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">E-posta adresinize kod gönderilir</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">a***@example.com</div>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedProvider === 'email' ? 'border-primary' : 'border-gray-300'">
                    <div v-if="selectedProvider === 'email'" class="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              </label>

              <!-- Authenticator Option -->
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700" :class="selectedProvider === 'authenticator' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-600'">
                <input 
                  type="radio" 
                  v-model="selectedProvider" 
                  value="authenticator" 
                  class="sr-only"
                >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">Authenticator Uygulaması</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">Google Authenticator veya benzeri uygulama</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">6 haneli kod</div>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedProvider === 'authenticator' ? 'border-primary' : 'border-gray-300'">
                    <div v-if="selectedProvider === 'authenticator'" class="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="!selectedProvider || isLoading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Kod gönderiliyor...' : 'Doğrulama Kodu Gönder' }}
          </button>
        </form>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline">
            ← Giriş sayfasına dön
          </NuxtLink>
        </div>
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
const isLoading = ref(false)
const errorMessage = ref('')
const selectedProvider = ref('')

const handleProviderSelection = async () => {
  if (!selectedProvider.value) {
    errorMessage.value = 'Lütfen bir doğrulama yöntemi seçin.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simüle edilmiş kod gönderme işlemi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Seçilen provider'ı localStorage'a kaydet
    localStorage.setItem('twoFactorProvider', selectedProvider.value)
    
    // 2FA kod doğrulama sayfasına yönlendir
    router.push('/auth/two-factor-verify')
    
  } catch (error) {
    console.error('2FA provider seçim hatası:', error)
    errorMessage.value = 'Doğrulama kodu gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}

// Renk modu için
useColorMode()

// Sayfa yüklendiğinde auth kontrolü
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const twoFactorPending = localStorage.getItem('twoFactorPending')
  
  if (!twoFactorPending || isAuthenticated === 'true') {
    router.push('/auth/login')
  }
})
</script>