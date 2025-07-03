<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Giriş Yap</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Hesabınıza giriş yapın</p>
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

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="loginForm.email"
              type="email" 
              id="email" 
              placeholder="ornek@email.com" 
              required 
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şifre <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input 
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                placeholder="Şifrenizi girin" 
                required 
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
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input 
                v-model="loginForm.rememberMe"
                type="checkbox" 
                class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              >
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Beni hatırla</span>
            </label>
            <a href="#" class="text-sm text-primary hover:underline">Şifremi unuttum</a>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu? 
            <NuxtLink to="/auth/register" class="text-primary hover:underline font-medium">
              Kayıt olun
            </NuxtLink>
          </p>
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
const showPassword = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Lütfen tüm alanları doldurun.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simüle edilmiş login işlemi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo için basit email/şifre kontrolü
    if (loginForm.value.email === 'admin@example.com' && loginForm.value.password === 'password') {
      // Kullanıcı bilgilerini localStorage'a kaydet
      const userData = {
        id: 'user123',
        email: loginForm.value.email,
        firstName: 'Admin',
        lastName: 'User',
        isAuthenticated: false, // 2FA tamamlanana kadar false
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('twoFactorPending', 'true') // 2FA bekliyor
      
      // 2FA provider seçim sayfasına yönlendir
      router.push('/auth/two-factor-provider')
    } else {
      errorMessage.value = 'Geçersiz e-posta adresi veya şifre.'
    }
  } catch (error) {
    console.error('Login hatası:', error)
    errorMessage.value = 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}

// Renk modu için
useColorMode()

// Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (isAuthenticated === 'true') {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    if (!onboardingCompleted) {
      router.push('/onboarding/currency')
    } else {
      router.push('/')
    }
  }
})
</script>