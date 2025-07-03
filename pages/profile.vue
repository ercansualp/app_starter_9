<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Profil Ayarları</h2>

    <div class="space-y-8">
      <!-- Profile Header Card -->
      <div class="bg-card rounded-lg shadow-sm border border-border-color overflow-hidden">
        <div class="relative h-32 bg-gradient-to-r from-primary to-blue-600">
          <div class="absolute inset-0 bg-black/20"></div>
        </div>
        <div class="relative px-6 pb-6">
          <div class="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            <!-- Profile Picture -->
            <div class="relative -mt-16 mb-4 sm:mb-0">
              <div class="relative">
                <img 
                  :src="userAvatar" 
                  :alt="userDisplayName" 
                  class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                >
                <button 
                  @click="openAvatarModal"
                  class="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- User Info -->
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-text-primary">{{ userDisplayName }}</h3>
              <p class="text-text-secondary">{{ userData.email }}</p>
              <div class="flex items-center gap-4 mt-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Aktif
                </span>
                <span class="text-sm text-text-secondary">
                  Üyelik: {{ formatDate(userData.registrationTime) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Settings Tabs -->
      <div class="bg-card rounded-lg shadow-sm border border-border-color">
        <!-- Tab Navigation -->
        <div class="border-b border-border-color">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <component :is="tab.icon" class="w-5 h-5" />
                {{ tab.name }}
              </div>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-text-primary mb-4">Kişisel Bilgiler</h4>
              <form @submit.prevent="updatePersonalInfo" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-text-secondary mb-1">
                      Ad <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="personalForm.firstName"
                      type="text" 
                      id="firstName" 
                      required 
                      class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-text-secondary mb-1">
                      Soyad <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="personalForm.lastName"
                      type="text" 
                      id="lastName" 
                      required 
                      class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                    >
                  </div>
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-text-secondary mb-1">
                    E-posta Adresi <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="personalForm.email"
                    type="email" 
                    id="email" 
                    required 
                    class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  >
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-text-secondary mb-1">
                    Telefon Numarası
                  </label>
                  <input 
                    v-model="personalForm.phone"
                    type="tel" 
                    id="phone" 
                    placeholder="+90 555 123 45 67"
                    class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  >
                </div>

                <div>
                  <label for="bio" class="block text-sm font-medium text-text-secondary mb-1">
                    Hakkımda
                  </label>
                  <textarea 
                    v-model="personalForm.bio"
                    id="bio" 
                    rows="4"
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                    class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>

                <div class="flex justify-end">
                  <button 
                    type="submit"
                    :disabled="isUpdatingPersonal"
                    class="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isUpdatingPersonal" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isUpdatingPersonal ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <!-- Change Password -->
            <div>
              <h4 class="text-lg font-semibold text-text-primary mb-4">Şifre Değiştir</h4>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-text-secondary mb-1">
                    Mevcut Şifre <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      id="currentPassword" 
                      required 
                      class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 pr-10 text-text-primary focus:ring-primary focus:border-primary"
                    >
                    <button 
                      type="button" 
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    >
                      <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

                <div>
                  <label for="newPassword" class="block text-sm font-medium text-text-secondary mb-1">
                    Yeni Şifre <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      id="newPassword" 
                      required 
                      minlength="8"
                      class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 pr-10 text-text-primary focus:ring-primary focus:border-primary"
                    >
                    <button 
                      type="button" 
                      @click="showNewPassword = !showNewPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    >
                      <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <label for="confirmPassword" class="block text-sm font-medium text-text-secondary mb-1">
                    Yeni Şifre Tekrarı <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword" 
                      required 
                      class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 pr-10 text-text-primary focus:ring-primary focus:border-primary"
                      :class="{'border-red-500': passwordForm.confirmPassword && !passwordsMatch}"
                    >
                    <button 
                      type="button" 
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
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
                  <p v-if="passwordForm.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-600">
                    Şifreler eşleşmiyor
                  </p>
                </div>

                <div class="flex justify-end">
                  <button 
                    type="submit"
                    :disabled="!isPasswordFormValid || isChangingPassword"
                    class="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isChangingPassword" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isChangingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="border-t border-border-color pt-6">
              <h4 class="text-lg font-semibold text-text-primary mb-4">İki Faktörlü Doğrulama</h4>
              <div class="flex items-center justify-between p-4 bg-background rounded-lg border border-border-color">
                <div>
                  <h5 class="font-medium text-text-primary">2FA Durumu</h5>
                  <p class="text-sm text-text-secondary">
                    {{ twoFactorEnabled ? 'İki faktörlü doğrulama aktif' : 'İki faktörlü doğrulama pasif' }}
                  </p>
                </div>
                <button 
                  @click="toggleTwoFactor"
                  :disabled="isTogglingTwoFactor"
                  :class="[
                    'px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2',
                    twoFactorEnabled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  ]"
                >
                  <svg v-if="isTogglingTwoFactor" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ twoFactorEnabled ? 'Devre Dışı Bırak' : 'Etkinleştir' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-text-primary mb-4">Tercihler</h4>
              
              <!-- Language -->
              <div class="space-y-4">
                <div>
                  <label for="language" class="block text-sm font-medium text-text-secondary mb-2">
                    Dil
                  </label>
                  <select 
                    v-model="preferencesForm.language"
                    id="language"
                    class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <!-- Timezone -->
                <div>
                  <label for="timezone" class="block text-sm font-medium text-text-secondary mb-2">
                    Saat Dilimi
                  </label>
                  <select 
                    v-model="preferencesForm.timezone"
                    id="timezone"
                    class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  >
                    <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                    <option value="Europe/London">Londra (UTC+0)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                  </select>
                </div>

                <!-- Email Notifications -->
                <div>
                  <h5 class="font-medium text-text-primary mb-3">E-posta Bildirimleri</h5>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input 
                        v-model="preferencesForm.notifications.email.marketing"
                        type="checkbox" 
                        class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary"
                      >
                      <span class="ml-3 text-sm text-text-primary">Pazarlama e-postaları</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        v-model="preferencesForm.notifications.email.security"
                        type="checkbox" 
                        class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary"
                      >
                      <span class="ml-3 text-sm text-text-primary">Güvenlik bildirimleri</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        v-model="preferencesForm.notifications.email.updates"
                        type="checkbox" 
                        class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary"
                      >
                      <span class="ml-3 text-sm text-text-primary">Ürün güncellemeleri</span>
                    </label>
                  </div>
                </div>

                <div class="flex justify-end">
                  <button 
                    @click="updatePreferences"
                    :disabled="isUpdatingPreferences"
                    class="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isUpdatingPreferences" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isUpdatingPreferences ? 'Kaydediliyor...' : 'Tercihleri Kaydet' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Tab -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <div>
              <h4 class="text-lg font-semibold text-text-primary mb-4">Hesap Yönetimi</h4>
              
              <!-- Account Statistics -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-background p-4 rounded-lg border border-border-color">
                  <div class="flex items-center">
                    <div class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-text-secondary">Toplam Proje</p>
                      <p class="text-2xl font-bold text-text-primary">{{ accountStats.totalProjects }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-background p-4 rounded-lg border border-border-color">
                  <div class="flex items-center">
                    <div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-text-secondary">Aktif Job</p>
                      <p class="text-2xl font-bold text-text-primary">{{ accountStats.activeJobs }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-background p-4 rounded-lg border border-border-color">
                  <div class="flex items-center">
                    <div class="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 dark:text-purple-400">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-text-secondary">Mesaj Şablonu</p>
                      <p class="text-2xl font-bold text-text-primary">{{ accountStats.messageTemplates }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Export Data -->
              <div class="border border-border-color rounded-lg p-4 mb-6">
                <h5 class="font-medium text-text-primary mb-2">Veri Dışa Aktarma</h5>
                <p class="text-sm text-text-secondary mb-4">
                  Hesap verilerinizi JSON formatında dışa aktarabilirsiniz.
                </p>
                <button 
                  @click="exportData"
                  :disabled="isExportingData"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="isExportingData" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {{ isExportingData ? 'Dışa Aktarılıyor...' : 'Verileri Dışa Aktar' }}
                </button>
              </div>

              <!-- Delete Account -->
              <div class="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h5 class="font-medium text-red-800 dark:text-red-200 mb-2">Hesabı Sil</h5>
                <p class="text-sm text-red-700 dark:text-red-300 mb-4">
                  Hesabınızı kalıcı olarak silmek istiyorsanız, bu işlem geri alınamaz. 
                  Tüm verileriniz silinecek ve hesabınıza erişiminiz kesilecektir.
                </p>
                <button 
                  @click="openDeleteAccountModal"
                  class="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-card rounded-xl shadow-xl w-full max-w-md border border-border-color">
        <div class="p-6 border-b border-border-color flex justify-between items-center">
          <h3 class="text-xl font-semibold text-text-primary">Profil Fotoğrafını Değiştir</h3>
          <button @click="closeAvatarModal" class="text-text-secondary hover:text-text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="text-center">
            <img 
              :src="newAvatarPreview || userAvatar" 
              alt="Avatar Preview" 
              class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-border-color"
            >
          </div>
          
          <div>
            <label for="avatarUpload" class="block text-sm font-medium text-text-secondary mb-2">
              Yeni Fotoğraf Seç
            </label>
            <input 
              type="file" 
              id="avatarUpload" 
              @change="handleAvatarUpload" 
              accept="image/*" 
              class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-500"
            >
          </div>
          
          <div class="flex gap-3 pt-4">
            <button 
              @click="closeAvatarModal"
              class="flex-1 px-4 py-2 border border-border-color text-text-primary rounded-lg hover:bg-background transition-colors"
            >
              İptal
            </button>
            <button 
              @click="saveAvatar"
              :disabled="!newAvatarPreview || isUploadingAvatar"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isUploadingAvatar" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isUploadingAvatar ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ errorMessage }}
    </div>

    <!-- Delete Account Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteAccountModal"
      title="Hesabı Kalıcı Olarak Sil"
      message="Bu işlem geri alınamaz. Tüm verileriniz silinecek ve hesabınıza erişiminiz kesilecektir. Devam etmek istediğinizden emin misiniz?"
      confirm-text="Hesabı Sil"
      confirm-button-class="bg-red-600 hover:bg-red-700"
      @close="showDeleteAccountModal = false"
      @confirm="deleteAccount"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, Shield, Settings, Trash2 } from 'lucide-vue-next'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

// Tab management
const activeTab = ref('personal')
const tabs = [
  { id: 'personal', name: 'Kişisel Bilgiler', icon: User },
  { id: 'security', name: 'Güvenlik', icon: Shield },
  { id: 'preferences', name: 'Tercihler', icon: Settings },
  { id: 'account', name: 'Hesap', icon: Trash2 }
]

// User data
const userData = ref({
  id: 'user123',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  phone: '+90 555 123 45 67',
  bio: 'Yazılım geliştirici ve proje yöneticisi. 5+ yıllık deneyim.',
  avatar: '',
  registrationTime: '2024-01-15T10:30:00Z',
  language: 'tr',
  timezone: 'Europe/Istanbul',
  notifications: {
    email: {
      marketing: true,
      security: true,
      updates: false
    }
  }
})

// Form states
const personalForm = ref({})
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const preferencesForm = ref({})

// Loading states
const isUpdatingPersonal = ref(false)
const isChangingPassword = ref(false)
const isUpdatingPreferences = ref(false)
const isTogglingTwoFactor = ref(false)
const isUploadingAvatar = ref(false)
const isExportingData = ref(false)

// Modal states
const showAvatarModal = ref(false)
const showDeleteAccountModal = ref(false)

// Password visibility
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Avatar upload
const newAvatarPreview = ref('')

// Messages
const successMessage = ref('')
const errorMessage = ref('')

// Two-factor authentication
const twoFactorEnabled = ref(false)

// Account statistics
const accountStats = ref({
  totalProjects: 2,
  activeJobs: 5,
  messageTemplates: 3
})

// Computed properties
const userDisplayName = computed(() => {
  return `${userData.value.firstName} ${userData.value.lastName}`
})

const userAvatar = computed(() => {
  if (userData.value.avatar) {
    return userData.value.avatar
  }
  return `https://ui-avatars.com/api/?name=${userData.value.firstName}+${userData.value.lastName}&background=1d4ed8&color=fff&size=128`
})

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  return {
    length: password.length,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword.length >= 8 &&
         passwordsMatch.value &&
         passwordStrength.value.hasUpperCase &&
         passwordStrength.value.hasNumber
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showMessage = (message, type = 'success') => {
  if (type === 'success') {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } else {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

const updatePersonalInfo = async () => {
  isUpdatingPersonal.value = true
  
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update user data
    Object.assign(userData.value, personalForm.value)
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(userData.value))
    
    showMessage('Kişisel bilgileriniz başarıyla güncellendi.')
  } catch (error) {
    console.error('Kişisel bilgi güncelleme hatası:', error)
    showMessage('Bilgiler güncellenirken bir hata oluştu.', 'error')
  } finally {
    isUpdatingPersonal.value = false
  }
}

const changePassword = async () => {
  if (!isPasswordFormValid.value) {
    showMessage('Lütfen geçerli şifre bilgilerini girin.', 'error')
    return
  }

  isChangingPassword.value = true
  
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    showMessage('Şifreniz başarıyla değiştirildi.')
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error)
    showMessage('Şifre değiştirilirken bir hata oluştu.', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const toggleTwoFactor = async () => {
  isTogglingTwoFactor.value = true
  
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    twoFactorEnabled.value = !twoFactorEnabled.value
    
    showMessage(
      twoFactorEnabled.value 
        ? 'İki faktörlü doğrulama etkinleştirildi.' 
        : 'İki faktörlü doğrulama devre dışı bırakıldı.'
    )
  } catch (error) {
    console.error('2FA toggle hatası:', error)
    showMessage('İki faktörlü doğrulama ayarı değiştirilirken bir hata oluştu.', 'error')
  } finally {
    isTogglingTwoFactor.value = false
  }
}

const updatePreferences = async () => {
  isUpdatingPreferences.value = true
  
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update user data
    Object.assign(userData.value, preferencesForm.value)
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(userData.value))
    
    showMessage('Tercihleriniz başarıyla güncellendi.')
  } catch (error) {
    console.error('Tercih güncelleme hatası:', error)
    showMessage('Tercihler güncellenirken bir hata oluştu.', 'error')
  } finally {
    isUpdatingPreferences.value = false
  }
}

const openAvatarModal = () => {
  showAvatarModal.value = true
}

const closeAvatarModal = () => {
  showAvatarModal.value = false
  newAvatarPreview.value = ''
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newAvatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveAvatar = async () => {
  if (!newAvatarPreview.value) return
  
  isUploadingAvatar.value = true
  
  try {
    // Simüle edilmiş upload işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update user avatar
    userData.value.avatar = newAvatarPreview.value
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(userData.value))
    
    closeAvatarModal()
    showMessage('Profil fotoğrafınız başarıyla güncellendi.')
  } catch (error) {
    console.error('Avatar upload hatası:', error)
    showMessage('Profil fotoğrafı yüklenirken bir hata oluştu.', 'error')
  } finally {
    isUploadingAvatar.value = false
  }
}

const exportData = async () => {
  isExportingData.value = true
  
  try {
    // Simüle edilmiş data export işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const exportData = {
      user: userData.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showMessage('Verileriniz başarıyla dışa aktarıldı.')
  } catch (error) {
    console.error('Data export hatası:', error)
    showMessage('Veriler dışa aktarılırken bir hata oluştu.', 'error')
  } finally {
    isExportingData.value = false
  }
}

const openDeleteAccountModal = () => {
  showDeleteAccountModal.value = true
}

const deleteAccount = async () => {
  try {
    // Simüle edilmiş hesap silme işlemi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear all localStorage data
    localStorage.clear()
    
    // Redirect to login
    await navigateTo('/auth/login')
    
    showMessage('Hesabınız başarıyla silindi.')
  } catch (error) {
    console.error('Hesap silme hatası:', error)
    showMessage('Hesap silinirken bir hata oluştu.', 'error')
  } finally {
    showDeleteAccountModal.value = false
  }
}

// Initialize forms
onMounted(() => {
  // Load user data from localStorage
  const storedUserData = localStorage.getItem('userData')
  if (storedUserData) {
    Object.assign(userData.value, JSON.parse(storedUserData))
  }
  
  // Initialize forms with user data
  personalForm.value = {
    firstName: userData.value.firstName,
    lastName: userData.value.lastName,
    email: userData.value.email,
    phone: userData.value.phone,
    bio: userData.value.bio
  }
  
  preferencesForm.value = {
    language: userData.value.language,
    timezone: userData.value.timezone,
    notifications: { ...userData.value.notifications }
  }
})
</script>