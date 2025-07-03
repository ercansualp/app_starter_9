<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kayıt Ol</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Yeni hesap oluşturun</p>
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

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="registerForm.firstName"
                type="text" 
                id="firstName" 
                placeholder="Adınız" 
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Soyad <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="registerForm.lastName"
                type="text" 
                id="lastName" 
                placeholder="Soyadınız" 
                required 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="registerForm.email"
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
                v-model="registerForm.password"
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
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                placeholder="Şifrenizi tekrar girin" 
                required 
                class="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{'border-red-500': registerForm.confirmPassword && !passwordsMatch}"
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
            <p v-if="registerForm.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-600">
              Şifreler eşleşmiyor
            </p>
          </div>

          <div class="flex items-start">
            <input 
              v-model="registerForm.acceptTerms"
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

          <button 
            type="submit" 
            :disabled="!isFormValid || isLoading"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı? 
            <NuxtLink to="/auth/login" class="text-primary hover:underline font-medium">
              Giriş yapın
            </NuxtLink>
          </p>
        </div>
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
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const passwordStrength = computed(() => {
  const password = registerForm.value.password
  return {
    length: password.length,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const passwordsMatch = computed(() => {
  return registerForm.value.password === registerForm.value.confirmPassword
})

const isFormValid = computed(() => {
  return registerForm.value.firstName &&
         registerForm.value.lastName &&
         registerForm.value.email &&
         registerForm.value.password.length >= 8 &&
         passwordsMatch.value &&
         registerForm.value.acceptTerms
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Lütfen tüm gerekli alanları doğru şekilde doldurun.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simüle edilmiş kayıt işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Kullanıcı bilgilerini localStorage'a kaydet
    const userData = {
      id: 'user' + Date.now(),
      email: registerForm.value.email,
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      isAuthenticated: true,
      registrationTime: new Date().toISOString()
    }
    
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    
    // Kayıt başarılı, onboarding'e yönlendir
    router.push('/onboarding/currency')
    
  } catch (error) {
    console.error('Kayıt hatası:', error)
    errorMessage.value = 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.'
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