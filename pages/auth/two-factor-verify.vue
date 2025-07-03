<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M3 12h6m6 0h6"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Doğrulama Kodu</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">{{ getProviderMessage() }}</p>
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

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 mr-3 flex-shrink-0">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            </svg>
            <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Verification Form -->
        <form @submit.prevent="handleCodeVerification" class="space-y-6">
          <div>
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Doğrulama Kodu <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2 justify-center">
              <input 
                v-for="(digit, index) in verificationCode" 
                :key="index"
                v-model="verificationCode[index]"
                @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                @paste="handlePaste($event)"
                type="text" 
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errorMessage && verificationCode[index] === ''}"
              >
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              {{ getCodeLength() }} haneli kodu girin
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="!isCodeComplete || isLoading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Doğrulanıyor...' : 'Doğrula' }}
          </button>
        </form>

        <!-- Resend Code -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Kod gelmedi mi?
          </p>
          <button 
            @click="resendCode"
            :disabled="resendCooldown > 0 || isResending"
            class="text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            <span v-if="resendCooldown > 0">{{ resendCooldown }} saniye sonra tekrar gönder</span>
            <span v-else-if="isResending">Kod gönderiliyor...</span>
            <span v-else>Kodu tekrar gönder</span>
          </button>
        </div>

        <!-- Back to Provider Selection -->
        <div class="mt-4 text-center">
          <NuxtLink to="/auth/two-factor-provider" class="text-sm text-gray-500 hover:text-primary">
            ← Doğrulama yöntemini değiştir
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const router = useRouter()
const isLoading = ref(false)
const isResending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedProvider = ref('')
const resendCooldown = ref(0)
let resendTimer = null

// 6 haneli kod için array
const verificationCode = ref(['', '', '', '', '', ''])

const isCodeComplete = computed(() => {
  return verificationCode.value.every(digit => digit !== '')
})

const getProviderMessage = () => {
  switch (selectedProvider.value) {
    case 'sms':
      return 'Telefon numaranıza gönderilen 6 haneli kodu girin'
    case 'email':
      return 'E-posta adresinize gönderilen 6 haneli kodu girin'
    case 'authenticator':
      return 'Authenticator uygulamanızdaki 6 haneli kodu girin'
    default:
      return '6 haneli doğrulama kodunu girin'
  }
}

const getCodeLength = () => {
  return 6 // Tüm provider'lar için 6 haneli
}

const handleInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, '')
  verificationCode.value[index] = value
  
  // Otomatik olarak bir sonraki input'a geç
  if (value && index < verificationCode.value.length - 1) {
    const nextInput = event.target.parentElement.children[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
  
  // Hata mesajını temizle
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

const handleKeydown = (index, event) => {
  // Backspace ile önceki input'a geç
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    const prevInput = event.target.parentElement.children[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  
  // Arrow keys ile navigasyon
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    const prevInput = event.target.parentElement.children[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  
  if (event.key === 'ArrowRight' && index < verificationCode.value.length - 1) {
    event.preventDefault()
    const nextInput = event.target.parentElement.children[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '')
  
  if (pastedData.length === 6) {
    for (let i = 0; i < 6; i++) {
      verificationCode.value[i] = pastedData[i] || ''
    }
    // Son input'a focus yap
    const lastInput = event.target.parentElement.children[5]
    if (lastInput) {
      lastInput.focus()
    }
  }
}

const handleCodeVerification = async () => {
  if (!isCodeComplete.value) {
    errorMessage.value = 'Lütfen tüm haneleri doldurun.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simüle edilmiş kod doğrulama işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const enteredCode = verificationCode.value.join('')
    
    // Demo için basit kod kontrolü (gerçek uygulamada backend'den doğrulanır)
    if (enteredCode === '123456') {
      successMessage.value = 'Doğrulama başarılı! Yönlendiriliyorsunuz...'
      
      // 2FA'yı tamamla
      localStorage.removeItem('twoFactorPending')
      localStorage.removeItem('twoFactorProvider')
      localStorage.setItem('isAuthenticated', 'true')
      
      // Kısa bir gecikme sonrası onboarding'e yönlendir
      setTimeout(() => {
        const onboardingCompleted = localStorage.getItem('onboardingCompleted')
        if (!onboardingCompleted) {
          router.push('/onboarding/currency')
        } else {
          router.push('/')
        }
      }, 1500)
    } else {
      errorMessage.value = 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.'
      // Kodu temizle
      verificationCode.value = ['', '', '', '', '', '']
      // İlk input'a focus yap
      const firstInput = document.querySelector('input[type="text"]')
      if (firstInput) {
        firstInput.focus()
      }
    }
  } catch (error) {
    console.error('2FA doğrulama hatası:', error)
    errorMessage.value = 'Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0 || isResending.value) return
  
  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Simüle edilmiş kod yeniden gönderme işlemi
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'Doğrulama kodu tekrar gönderildi.'
    
    // Cooldown başlat
    resendCooldown.value = 60
    resendTimer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(resendTimer)
      }
    }, 1000)
    
    // Kodu temizle
    verificationCode.value = ['', '', '', '', '', '']
    
    // İlk input'a focus yap
    setTimeout(() => {
      const firstInput = document.querySelector('input[type="text"]')
      if (firstInput) {
        firstInput.focus()
      }
    }, 100)
    
  } catch (error) {
    console.error('Kod yeniden gönderme hatası:', error)
    errorMessage.value = 'Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isResending.value = false
  }
}

// Renk modu için
useColorMode()

onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const twoFactorPending = localStorage.getItem('twoFactorPending')
  const provider = localStorage.getItem('twoFactorProvider')
  
  if (!twoFactorPending || !provider || isAuthenticated === 'true') {
    router.push('/auth/login')
    return
  }
  
  selectedProvider.value = provider
  
  // İlk input'a focus yap
  setTimeout(() => {
    const firstInput = document.querySelector('input[type="text"]')
    if (firstInput) {
      firstInput.focus()
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>