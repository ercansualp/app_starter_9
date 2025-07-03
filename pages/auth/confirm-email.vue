<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg v-if="confirmationStatus === 'success'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            </svg>
            <svg v-else-if="confirmationStatus === 'error'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ getTitle() }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">
            {{ getSubtitle() }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="confirmationStatus === 'loading'" class="text-center">
          <div class="flex items-center justify-center mb-6">
            <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400">E-posta adresiniz doğrulanıyor...</p>
        </div>

        <!-- Success State -->
        <div v-if="confirmationStatus === 'success'" class="text-center">
          <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-green-800 dark:text-green-200">E-posta Başarıyla Doğrulandı!</p>
                <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                  Hesabınız aktif edildi. Artık tüm özellikleri kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <NuxtLink 
              to="/auth/login" 
              class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block text-center"
            >
              Giriş Yap
            </NuxtLink>
            
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ redirectCountdown > 0 ? `${redirectCountdown} saniye sonra otomatik olarak giriş sayfasına yönlendirileceksiniz.` : '' }}
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="confirmationStatus === 'error'" class="text-center">
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800 dark:text-red-200">E-posta Doğrulama Başarısız</p>
                <p class="text-xs text-red-700 dark:text-red-300 mt-1">
                  {{ errorMessage || 'Doğrulama bağlantısı geçersiz veya süresi dolmuş olabilir.' }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <button 
              @click="resendConfirmationEmail"
              :disabled="isResending || resendCooldown > 0"
              class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="isResending" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="resendCooldown > 0">{{ resendCooldown }} saniye sonra tekrar gönder</span>
              <span v-else-if="isResending">E-posta gönderiliyor...</span>
              <span v-else>Doğrulama E-postasını Tekrar Gönder</span>
            </button>
            
            <NuxtLink 
              to="/auth/login" 
              class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-block text-center"
            >
              Giriş Sayfasına Dön
            </NuxtLink>
          </div>
        </div>

        <!-- Already Confirmed State -->
        <div v-if="confirmationStatus === 'already-confirmed'" class="text-center">
          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-blue-800 dark:text-blue-200">E-posta Zaten Doğrulanmış</p>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Bu e-posta adresi daha önce doğrulanmış. Hesabınıza giriş yapabilirsiniz.
                </p>
              </div>
            </div>
          </div>
          
          <NuxtLink 
            to="/auth/login" 
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block text-center"
          >
            Giriş Yap
          </NuxtLink>
        </div>

        <!-- Help Section -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Sorun mu yaşıyorsunuz?
            </p>
            <div class="space-y-2">
              <a href="mailto:support@example.com" class="text-sm text-primary hover:underline block">
                Destek ekibiyle iletişime geçin
              </a>
              <NuxtLink to="/auth/register" class="text-sm text-primary hover:underline block">
                Yeni hesap oluşturun
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()

const confirmationStatus = ref('loading') // 'loading', 'success', 'error', 'already-confirmed'
const errorMessage = ref('')
const isResending = ref(false)
const resendCooldown = ref(0)
const redirectCountdown = ref(0)

let resendTimer = null
let redirectTimer = null

const getTitle = () => {
  switch (confirmationStatus.value) {
    case 'loading': return 'E-posta Doğrulanıyor'
    case 'success': return 'E-posta Doğrulandı'
    case 'error': return 'Doğrulama Başarısız'
    case 'already-confirmed': return 'Zaten Doğrulanmış'
    default: return 'E-posta Doğrulama'
  }
}

const getSubtitle = () => {
  switch (confirmationStatus.value) {
    case 'loading': return 'Lütfen bekleyin...'
    case 'success': return 'Hesabınız başarıyla aktif edildi'
    case 'error': return 'E-posta doğrulama işlemi başarısız oldu'
    case 'already-confirmed': return 'Bu e-posta adresi daha önce doğrulanmış'
    default: return 'E-posta adresinizi doğrulayın'
  }
}

const confirmEmail = async () => {
  const token = route.query.token
  
  if (!token) {
    confirmationStatus.value = 'error'
    errorMessage.value = 'Doğrulama token\'ı bulunamadı.'
    return
  }

  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Demo için token kontrolü
    if (token === 'valid-token') {
      confirmationStatus.value = 'success'
      startRedirectCountdown()
    } else if (token === 'already-confirmed') {
      confirmationStatus.value = 'already-confirmed'
    } else if (token === 'expired') {
      confirmationStatus.value = 'error'
      errorMessage.value = 'Doğrulama bağlantısının süresi dolmuş.'
    } else {
      confirmationStatus.value = 'error'
      errorMessage.value = 'Geçersiz doğrulama token\'ı.'
    }
  } catch (error) {
    console.error('E-posta doğrulama hatası:', error)
    confirmationStatus.value = 'error'
    errorMessage.value = 'E-posta doğrulanırken bir hata oluştu.'
  }
}

const resendConfirmationEmail = async () => {
  if (isResending.value || resendCooldown.value > 0) return
  
  isResending.value = true
  
  try {
    // Simüle edilmiş e-posta yeniden gönderme
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Başarılı mesaj göster
    confirmationStatus.value = 'loading'
    errorMessage.value = ''
    
    // Cooldown başlat
    startResendCooldown()
    
    // Yeni doğrulama işlemi simüle et
    setTimeout(() => {
      confirmEmail()
    }, 1000)
    
  } catch (error) {
    console.error('E-posta yeniden gönderme hatası:', error)
    errorMessage.value = 'E-posta gönderilirken bir hata oluştu.'
  } finally {
    isResending.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer)
    }
  }, 1000)
}

const startRedirectCountdown = () => {
  redirectCountdown.value = 10
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer)
      router.push('/auth/login')
    }
  }, 1000)
}

// Renk modu için
useColorMode()

onMounted(() => {
  confirmEmail()
})

onBeforeUnmount(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
  if (redirectTimer) {
    clearInterval(redirectTimer)
  }
})
</script>