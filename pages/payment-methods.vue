<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Ödeme Yöntemleri</h2>

    <!-- Payment Methods Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Add New Payment Method Card -->
      <div 
        @click="openAddPaymentModal"
        class="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 min-h-[200px] group"
      >
        <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">Yeni Ödeme Yöntemi Ekle</h3>
        <p class="text-sm text-text-secondary">Kredi kartı bilgilerinizi eklemek için tıklayın</p>
      </div>

      <!-- Existing Payment Method Cards -->
      <div 
        v-for="method in paymentMethods" 
        :key="method.id"
        class="bg-card border border-border-color rounded-xl p-6 transition-all duration-200 hover:border-primary hover:shadow-lg min-h-[200px] flex flex-col justify-between"
        :class="{'border-primary bg-primary/5 shadow-md': method.isDefault}"
      >
        <!-- Card Header -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <!-- Card Type Icon -->
            <div class="w-12 h-8 rounded border border-border-color flex items-center justify-center bg-input-bg">
              <div v-if="method.cardType === 'visa'" class="text-blue-600 font-bold text-xs">VISA</div>
              <div v-else-if="method.cardType === 'mastercard'" class="text-red-500 font-bold text-xs">MC</div>
              <div v-else class="text-text-secondary text-xs">CARD</div>
            </div>

            <!-- Status Toggle -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                :checked="method.isActive" 
                @change="togglePaymentMethodStatus(method)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <!-- Card Details -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-lg font-medium text-text-primary">**** **** **** {{ method.last4Digits }}</span>
              <span v-if="method.isDefault" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                Varsayılan
              </span>
            </div>
            <div class="text-sm text-text-primary font-medium">{{ method.cardholderName }}</div>
            <div class="text-sm text-text-secondary">Son Kullanma: {{ method.expiryDate }}</div>
            <div class="text-xs text-text-secondary">{{ method.city }}, {{ getCountryName(method.country) }}</div>
          </div>

          <!-- Expiry Warning -->
          <div v-if="isExpiringSoon(method.expiryDate)" class="mt-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Süresi yakında dolacak</span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="mt-4 pt-4 border-t border-border-color">
          <div class="flex items-center justify-between">
            <span class="text-sm text-text-secondary">
              {{ method.isActive ? 'Aktif' : 'Pasif' }}
            </span>
            <button 
              v-if="!method.isDefault && method.isActive"
              @click="setAsDefault(method)"
              class="text-primary hover:underline text-sm font-medium"
            >
              Varsayılan Yap
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State (when no payment methods) -->
      <div v-if="paymentMethods.length === 0" class="md:col-span-2 lg:col-span-2 text-center py-12">
        <div class="text-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-text-secondary/50">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <p class="text-lg font-medium mb-2">Henüz ödeme yöntemi eklenmemiş</p>
          <p class="text-sm">İlk ödeme yönteminizi eklemek için yukarıdaki kartı kullanın</p>
        </div>
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-border-color">
        <div class="p-6 border-b border-border-color flex justify-between items-center">
          <h3 class="text-2xl font-semibold text-text-primary">Yeni Ödeme Yöntemi Ekle</h3>
          <button @click="closeAddModal" class="text-text-secondary hover:text-text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-6">
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
                <p class="text-xs text-green-700 dark:text-green-300 mt-1">Tüm ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde saklanır.</p>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <form @submit.prevent="handleAddPaymentMethod" class="space-y-6">
            <!-- Card Number -->
            <div>
              <label for="cardNumber" class="block text-sm font-medium text-text-secondary mb-2">
                Kart Numarası <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="newPaymentMethod.cardNumber"
                  @input="formatCardNumber"
                  type="text" 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  maxlength="19"
                  required 
                  class="w-full px-3 py-3 pr-12 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                >
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div v-if="cardType" class="w-8 h-5 flex items-center justify-center">
                    <div v-if="cardType === 'visa'" class="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div v-else-if="cardType === 'mastercard'" class="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div v-else class="w-6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cardholder Name -->
            <div>
              <label for="cardholderName" class="block text-sm font-medium text-text-secondary mb-2">
                Kart Sahibinin Adı <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="newPaymentMethod.cardholderName"
                type="text" 
                id="cardholderName" 
                placeholder="JOHN DOE" 
                required 
                class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary uppercase"
              >
            </div>

            <!-- Expiry Date and CVV -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="expiryDate" class="block text-sm font-medium text-text-secondary mb-2">
                  Son Kullanma <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="newPaymentMethod.expiryDate"
                  @input="formatExpiryDate"
                  type="text" 
                  id="expiryDate" 
                  placeholder="MM/YY" 
                  maxlength="5"
                  required 
                  class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                >
              </div>
              <div>
                <label for="cvv" class="block text-sm font-medium text-text-secondary mb-2">
                  CVV <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="newPaymentMethod.cvv"
                  type="text" 
                  id="cvv" 
                  placeholder="123" 
                  maxlength="4"
                  required 
                  class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                >
              </div>
            </div>

            <!-- Billing Address -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-text-primary">Fatura Adresi</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="country" class="block text-sm font-medium text-text-secondary mb-2">
                    Ülke <span class="text-red-500">*</span>
                  </label>
                  <select 
                    v-model="newPaymentMethod.country"
                    id="country" 
                    required 
                    class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
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
                  <label for="city" class="block text-sm font-medium text-text-secondary mb-2">
                    Şehir <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="newPaymentMethod.city"
                    type="text" 
                    id="city" 
                    placeholder="İstanbul" 
                    required 
                    class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>
              </div>

              <div>
                <label for="postalCode" class="block text-sm font-medium text-text-secondary mb-2">
                  Posta Kodu <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="newPaymentMethod.postalCode"
                  type="text" 
                  id="postalCode" 
                  placeholder="34000" 
                  required 
                  class="w-full px-3 py-3 border border-border-color rounded-lg bg-input-bg text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                >
              </div>
            </div>

            <!-- Default Payment Method -->
            <div class="flex items-center">
              <input 
                v-model="newPaymentMethod.isDefault"
                type="checkbox" 
                id="isDefault" 
                class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary"
              >
              <label for="isDefault" class="ml-2 text-sm text-text-primary">
                Varsayılan ödeme yöntemi olarak ayarla
              </label>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 bg-card border-t border-border-color flex justify-end gap-4 sticky bottom-0">
          <button 
            type="button" 
            @click="closeAddModal"
            class="px-6 py-3 border border-border-color text-text-primary rounded-lg hover:bg-background transition-colors"
          >
            İptal
          </button>
          <button 
            @click="handleAddPaymentMethod"
            :disabled="!isFormValid || isProcessing"
            class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'Ekleniyor...' : 'Ödeme Yöntemi Ekle' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmationModal"
      :title="confirmationConfig.title"
      :message="confirmationConfig.message"
      :confirm-text="confirmationConfig.confirmText"
      :confirm-button-class="confirmationConfig.confirmButtonClass"
      @close="closeConfirmationModal"
      @confirm="handleConfirmation"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

// Modal state
const showAddModal = ref(false)
const isProcessing = ref(false)

// New payment method form data
const newPaymentMethod = ref({
  cardNumber: '',
  cardholderName: '',
  expiryDate: '',
  cvv: '',
  country: '',
  city: '',
  postalCode: '',
  isDefault: false
})

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  title: '',
  message: '',
  confirmText: '',
  confirmButtonClass: '',
  onConfirm: () => {}
})

// Sample payment methods data
const paymentMethods = ref([
  {
    id: 'pm1',
    cardNumber: '4532123456789012',
    last4Digits: '9012',
    cardholderName: 'JOHN DOE',
    expiryDate: '12/25',
    cardType: 'visa',
    country: 'TR',
    city: 'İstanbul',
    postalCode: '34000',
    isActive: true,
    isDefault: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'pm2',
    cardNumber: '5555444433332222',
    last4Digits: '2222',
    cardholderName: 'JANE SMITH',
    expiryDate: '03/24',
    cardType: 'mastercard',
    country: 'US',
    city: 'New York',
    postalCode: '10001',
    isActive: false,
    isDefault: false,
    createdAt: '2023-12-20T14:15:00Z'
  }
])

// Computed properties
const cardType = computed(() => {
  const number = newPaymentMethod.value.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) return 'visa'
  if (number.startsWith('5') || number.startsWith('2')) return 'mastercard'
  return null
})

const isFormValid = computed(() => {
  return newPaymentMethod.value.cardNumber.length >= 19 &&
         newPaymentMethod.value.cardholderName.length >= 2 &&
         newPaymentMethod.value.expiryDate.length === 5 &&
         newPaymentMethod.value.cvv.length >= 3 &&
         newPaymentMethod.value.country &&
         newPaymentMethod.value.city &&
         newPaymentMethod.value.postalCode
})

// Methods
const openAddPaymentModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  resetForm()
}

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19)
  newPaymentMethod.value.cardNumber = formattedValue
}

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  newPaymentMethod.value.expiryDate = value
}

const resetForm = () => {
  newPaymentMethod.value = {
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    country: '',
    city: '',
    postalCode: '',
    isDefault: false
  }
}

const handleAddPaymentMethod = async () => {
  if (!isFormValid.value) return
  
  isProcessing.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newMethod = {
      id: uuidv4(),
      cardNumber: newPaymentMethod.value.cardNumber,
      last4Digits: newPaymentMethod.value.cardNumber.slice(-4),
      cardholderName: newPaymentMethod.value.cardholderName,
      expiryDate: newPaymentMethod.value.expiryDate,
      cardType: cardType.value,
      country: newPaymentMethod.value.country,
      city: newPaymentMethod.value.city,
      postalCode: newPaymentMethod.value.postalCode,
      isActive: true,
      isDefault: newPaymentMethod.value.isDefault,
      createdAt: new Date().toISOString()
    }

    // If this is set as default, remove default from others
    if (newMethod.isDefault) {
      paymentMethods.value.forEach(method => {
        method.isDefault = false
      })
    }

    paymentMethods.value.unshift(newMethod)
    closeAddModal()
    
  } catch (error) {
    console.error('Ödeme yöntemi ekleme hatası:', error)
    alert('Ödeme yöntemi eklenirken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isProcessing.value = false
  }
}

const togglePaymentMethodStatus = (method) => {
  if (method.isDefault && method.isActive) {
    // Cannot deactivate default payment method
    confirmationConfig.value = {
      title: 'Varsayılan Ödeme Yöntemi',
      message: 'Varsayılan ödeme yöntemini pasif hale getiremezsiniz. Önce başka bir ödeme yöntemini varsayılan yapın.',
      confirmText: 'Tamam',
      confirmButtonClass: 'bg-primary hover:bg-blue-500',
      onConfirm: () => {}
    }
    showConfirmationModal.value = true
    return
  }

  method.isActive = !method.isActive
  
  // If deactivating and it was default, find another active method to make default
  if (!method.isActive && method.isDefault) {
    method.isDefault = false
    const activeMethod = paymentMethods.value.find(m => m.isActive && m.id !== method.id)
    if (activeMethod) {
      activeMethod.isDefault = true
    }
  }
}

const setAsDefault = (method) => {
  confirmationConfig.value = {
    title: 'Varsayılan Ödeme Yöntemi',
    message: `Bu ödeme yöntemini varsayılan yapmak istediğinizden emin misiniz? (**** **** **** ${method.last4Digits})`,
    confirmText: 'Varsayılan Yap',
    confirmButtonClass: 'bg-primary hover:bg-blue-500',
    onConfirm: () => {
      // Remove default from all methods
      paymentMethods.value.forEach(m => {
        m.isDefault = false
      })
      // Set this method as default
      method.isDefault = true
    }
  }
  showConfirmationModal.value = true
}

const isExpiringSoon = (expiryDate) => {
  const [month, year] = expiryDate.split('/')
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const now = new Date()
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
  
  return expiry <= threeMonthsFromNow
}

const getCountryName = (countryCode) => {
  const countries = {
    'TR': 'Türkiye',
    'US': 'Amerika Birleşik Devletleri',
    'GB': 'Birleşik Krallık',
    'DE': 'Almanya',
    'FR': 'Fransa'
  }
  return countries[countryCode] || countryCode
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

const handleConfirmation = () => {
  if (confirmationConfig.value.onConfirm) {
    confirmationConfig.value.onConfirm()
  }
  closeConfirmationModal()
}
</script>
