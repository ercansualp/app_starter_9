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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Şifremi Unuttum</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Şifrenizi sıfırlamak için e-posta adresinizi girin</p>
        </div>

        <!-- Success Message -->
        <div v-if="emailSent" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-green-800 dark:text-green-200">E-posta Gönderildi!</p>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                {{ forgotPasswordForm.email }} adresine şifre sıfırlama bağlantısı gönderildi. 
                E-posta kutunuzu kontrol edin.
              </p>
            </div>
          </div>
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

        <!-- Forgot Password Form -->
        <form v-if="!emailSent" @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="forgotPasswordForm.email"
              type="email" 
              id="email" 
              placeholder="ornek@email.com" 
              required 
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Bu e-posta adresine şifre sıfırlama bağlantısı gönderilecektir.
            </p>
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
            {{ isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder' }}
          </button>
        </form>

        <!-- Success Actions -->
        <div v-if="emailSent" class="space-y-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              E-posta gelmedi mi?
            </p>
            <button 
              @click="resendEmail"
              :disabled="resendCooldown > 0 || isResending"
              class="text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              <span v-if="resendCooldown > 0">{{ resendCooldown }} saniye sonra tekrar gönder</span>
              <span v-else-if="isResending">E-posta gönderiliyor...</span>
              <span v-else>E-postayı tekrar gönder</span>
            </button>
          </div>
          
          <button 
            @click="goBackToForm"
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Farklı E-posta Adresi Dene
          </button>
        </div>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
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
import { ref, onBeforeUnmount } from 'vue'

definePageMeta({
  layout: false
})

const isLoading = ref(false)
const isResending = ref(false)
const errorMessage = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)
let resendTimer = null

const forgotPasswordForm = ref({
  email: ''
})

const handleForgotPassword = async () => {
  if (!forgotPasswordForm.value.email) {
    errorMessage.value = 'Lütfen e-posta adresinizi girin.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Demo için basit e-posta kontrolü
    const validEmails = ['admin@example.com', 'user@example.com', 'test@example.com']
    
    if (validEmails.includes(forgotPasswordForm.value.email)) {
      emailSent.value = true
      startResendCooldown()
    } else {
      errorMessage.value = 'Bu e-posta adresi sistemde kayıtlı değil.'
    }
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error)
    errorMessage.value = 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0 || isResending.value) return
  
  isResending.value = true
  
  try {
    // Simüle edilmiş e-posta yeniden gönderme
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    startResendCooldown()
  } catch (error) {
    console.error('E-posta yeniden gönderme hatası:', error)
    errorMessage.value = 'E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
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

const goBackToForm = () => {
  emailSent.value = false
  errorMessage.value = ''
  forgotPasswordForm.value.email = ''
  if (resendTimer) {
    clearInterval(resendTimer)
    resendCooldown.value = 0
  }
}

// Renk modu için
useColorMode()

onBeforeUnmount(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>