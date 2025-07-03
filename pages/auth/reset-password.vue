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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Şifre Sıfırla</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Yeni şifrenizi belirleyin</p>
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
        <div v-if="resetSuccess" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-green-800 dark:text-green-200">Şifre Başarıyla Sıfırlandı!</p>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        <!-- Reset Password Form -->
        <form v-if="!resetSuccess && isValidToken" @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Yeni Şifre <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input 
                v-model="resetForm.password"
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                placeholder="En az 8 karakter" 
                required 
                minlength="8"
                class="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2 text-xs">
                <div :class="passwordStrength.length >= 8 ? 'text-green-600' : 'text-gray-400'" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  8+ karakter
                </div>
                <div :class="passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Büyük harf
                </div>
                <div :class="passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Rakam
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şifre Tekrarı <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input 
                v-model="resetForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                placeholder="Şifrenizi tekrar girin" 
                required 
                class="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{'border-red-500': resetForm.confirmPassword && !passwordsMatch}"
              >
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <p v-if="resetForm.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-600">
              Şifreler eşleşmiyor
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="!isFormValid || isLoading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Şifre sıfırlanıyor...' : 'Şifreyi Sıfırla' }}
          </button>
        </form>

        <!-- Invalid Token Message -->
        <div v-if="!isValidToken" class="text-center">
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800 dark:text-red-200">Geçersiz veya Süresi Dolmuş Bağlantı</p>
                <p class="text-xs text-red-700 dark:text-red-300 mt-1">
                  Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebinde bulunun.
                </p>
              </div>
            </div>
          </div>
          
          <NuxtLink 
            to="/auth/forgot-password" 
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block text-center"
          >
            Yeni Şifre Sıfırlama Talebi
          </NuxtLink>
        </div>

        <!-- Success Actions -->
        <div v-if="resetSuccess" class="text-center">
          <NuxtLink 
            to="/auth/login" 
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block"
          >
            Giriş Sayfasına Git
          </NuxtLink>
        </div>

        <!-- Back to Login -->
        <div v-if="!resetSuccess" class="mt-6 text-center">
          <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Giriş sayfasına dön
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const errorMessage = ref('')
const resetSuccess = ref(false)
const isValidToken = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const resetForm = ref({
  password: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  const password = resetForm.value.password
  return {
    length: password.length,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const passwordsMatch = computed(() => {
  return resetForm.value.password === resetForm.value.confirmPassword
})

const isFormValid = computed(() => {
  return resetForm.value.password.length >= 8 &&
         passwordsMatch.value &&
         passwordStrength.value.hasUpperCase &&
         passwordStrength.value.hasNumber
})

const handleResetPassword = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Lütfen geçerli bir şifre girin ve şifre tekrarını doğru yapın.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Demo için token kontrolü
    const token = route.query.token
    if (!token || token === 'invalid') {
      isValidToken.value = false
      return
    }
    
    resetSuccess.value = true
    
    // 3 saniye sonra login sayfasına yönlendir
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
    
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error)
    errorMessage.value = 'Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}

// Renk modu için
useColorMode()

onMounted(() => {
  // Token kontrolü
  const token = route.query.token
  if (!token) {
    isValidToken.value = false
  }
  
  // Demo için geçersiz token kontrolü
  if (token === 'invalid' || token === 'expired') {
    isValidToken.value = false
  }
})
</script>