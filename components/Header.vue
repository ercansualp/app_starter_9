<template>
  <header class="flex items-center justify-between p-6 border-b border-border-color bg-sidebar">
    <div class="flex items-center gap-4">
      <button @click="toggleSidebar" class="text-text-secondary hover:text-text-primary">
        <Menu class="w-6 h-6" />
      </button>
    </div>
    <div class="flex items-center gap-4">
      <ThemeSwitcher />
      
      <!-- Notification Bell -->
      <div class="relative">
        <button 
          @click="toggleNotifications" 
          class="relative text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Bell class="w-6 h-6" />
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
        
        <!-- Notification Dropdown -->
        <Transition name="fade">
          <div v-if="showNotifications" ref="notificationRef" class="absolute top-full right-0 mt-2 w-80 bg-sidebar border border-border-color rounded-lg shadow-xl z-20 max-h-96 overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b border-border-color flex justify-between items-center">
              <h3 class="font-semibold text-text-primary">Bildirimler</h3>
              <div class="flex items-center gap-2">
                <button 
                  v-if="unreadCount > 0"
                  @click="markAllAsRead" 
                  class="text-xs text-primary hover:underline"
                >
                  Tümünü Okundu İşaretle
                </button>
                <button @click="clearAllNotifications" class="text-xs text-red-500 hover:underline">
                  Tümünü Temizle
                </button>
              </div>
            </div>
            
            <!-- Notifications List -->
            <div class="max-h-80 overflow-y-auto">
              <div v-if="notifications.length === 0" class="p-6 text-center text-text-secondary">
                <Bell class="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p class="text-sm">Henüz bildirim bulunmuyor</p>
              </div>
              
              <div v-else>
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="p-4 border-b border-border-color hover:bg-background/50 cursor-pointer transition-colors"
                  :class="{'bg-primary/5': !notification.read}"
                >
                  <div class="flex items-start gap-3">
                    <!-- Icon -->
                    <div class="flex-shrink-0 mt-1">
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center"
                        :class="getNotificationIconClass(notification.type)"
                      >
                        <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
                      </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <h4 class="text-sm font-medium text-text-primary truncate">
                          {{ notification.title }}
                        </h4>
                        <div class="flex items-center gap-2 ml-2">
                          <span v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full"></span>
                          <span class="text-xs text-text-secondary whitespace-nowrap">
                            {{ formatTime(notification.createdAt) }}
                          </span>
                        </div>
                      </div>
                      <p class="text-sm text-text-secondary mt-1 line-clamp-2">
                        {{ notification.message }}
                      </p>
                      <div v-if="notification.actionUrl" class="mt-2">
                        <span class="text-xs text-primary hover:underline">
                          {{ notification.actionText || 'Detayları Görüntüle' }} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div v-if="notifications.length > 0" class="p-3 border-t border-border-color bg-background/50">
              <NuxtLink 
                to="/notifications" 
                @click="closeNotifications"
                class="block text-center text-sm text-primary hover:underline"
              >
                Tüm Bildirimleri Görüntüle
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
      
      <div class="relative">
        <div class="flex items-center gap-3 cursor-pointer" @click="togglePopover">
          <img :src="userAvatar" :alt="userDisplayName" class="w-10 h-10 rounded-full" />
          <div>
            <p class="font-semibold text-text-primary">{{ userDisplayName }}</p>
            <p class="text-sm text-text-secondary">{{ userEmail }}</p>
          </div>
          <ChevronDown :class="{ 'rotate-180': showPopover }" class="w-5 h-5 text-text-secondary transition-transform duration-200" />
        </div>

        <div v-if="showPopover" ref="popoverRef"
          class="absolute top-full right-0 mt-2 w-48 bg-sidebar border border-border-color rounded-lg shadow-lg p-2 z-10">
          <!-- Popover Arrow -->
          <div class="absolute -top-2 right-4 w-4 h-4 bg-sidebar transform rotate-45 border-t border-l border-border-color"></div>
          <ul class="text-text-primary">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-background rounded-md">Profil</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-background rounded-md">Ayarlar</a>
            </li>
            <li>
              <hr class="border-border-color my-1" />
            </li>
            <li>
              <button @click="handleLogout" class="w-full text-left block px-4 py-2 hover:bg-background rounded-md text-red-500 dark:text-red-400">
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, Menu, ChevronDown, CheckCircle, AlertTriangle, Info, Calendar, User, Settings } from 'lucide-vue-next'
import { useSidebar } from '~/composables/useSidebar'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'

const { toggleSidebar } = useSidebar()
const router = useRouter()

const showPopover = ref(false)
const showNotifications = ref(false)
const popoverRef = ref(null)
const notificationRef = ref(null)
const userData = ref(null)

// Sample notifications data
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Scheduler Job Başarılı',
    message: 'daily-order-sync job\'u başarıyla tamamlandı. 1,245 kayıt işlendi.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    actionUrl: '/scheduler',
    actionText: 'Detayları Görüntüle'
  },
  {
    id: 2,
    type: 'warning',
    title: 'API Anahtarı Süresi Dolacak',
    message: 'Ana Proje\'nin API anahtarı 7 gün içinde sona erecek. Yenilemeniz önerilir.',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/projects/proj1',
    actionText: 'API Anahtarlarını Yönet'
  },
  {
    id: 3,
    type: 'info',
    title: 'Yeni Mesaj Şablonu Oluşturuldu',
    message: 'Welcome Email şablonu başarıyla oluşturuldu ve kullanıma hazır.',
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    actionUrl: '/message-templates',
    actionText: 'Şablonları Görüntüle'
  },
  {
    id: 4,
    type: 'error',
    title: 'Scheduler Job Başarısız',
    message: 'health-check-ping job\'u başarısız oldu. API endpoint 503 hatası döndü.',
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    actionUrl: '/scheduler',
    actionText: 'Logları İncele'
  },
  {
    id: 5,
    type: 'info',
    title: 'Yeni Kullanıcı Davetiyesi',
    message: 'john.doe@example.com adresine gönderilen davetiye kabul edildi.',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: '/projects',
    actionText: 'Kullanıcıları Görüntüle'
  },
  {
    id: 6,
    type: 'success',
    title: 'Ödeme Başarılı',
    message: 'Aylık abonelik ödemesi başarıyla alındı. Sonraki ödeme: 15 Ağustos 2024',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    actionUrl: '/payment-methods',
    actionText: 'Ödeme Geçmişi'
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const userDisplayName = computed(() => {
  if (userData.value) {
    return `${userData.value.firstName} ${userData.value.lastName}`
  }
  return 'Kullanıcı'
})

const userEmail = computed(() => {
  return userData.value?.email || 'user@example.com'
})

const userAvatar = computed(() => {
  if (userData.value) {
    return `https://ui-avatars.com/api/?name=${userData.value.firstName}+${userData.value.lastName}&background=1d4ed8&color=fff&size=40`
  }
  return 'https://i.pravatar.cc/40?u=default'
})

const togglePopover = () => {
  showPopover.value = !showPopover.value
  if (showPopover.value) {
    showNotifications.value = false
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showPopover.value = false
  }
}

const closeNotifications = () => {
  showNotifications.value = false
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'warning': return AlertTriangle
    case 'error': return AlertTriangle
    case 'info': return Info
    case 'user': return User
    case 'calendar': return Calendar
    case 'settings': return Settings
    default: return Info
  }
}

const getNotificationIconClass = (type) => {
  switch (type) {
    case 'success': return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
    case 'warning': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
    case 'error': return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    case 'info': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
    case 'user': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
    case 'calendar': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
    case 'settings': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
  }
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes}dk önce`
  if (hours < 24) return `${hours}sa önce`
  if (days < 7) return `${days}g önce`
  
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const handleNotificationClick = (notification) => {
  // Mark as read
  notification.read = true
  
  // Navigate to action URL if available
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
    closeNotifications()
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const clearAllNotifications = () => {
  notifications.value.splice(0)
  closeNotifications()
}

const handleLogout = () => {
  // Kullanıcı verilerini temizle
  localStorage.removeItem('userData')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('onboardingCompleted')
  localStorage.removeItem('selectedCurrency')
  localStorage.removeItem('paymentInfo')
  localStorage.removeItem('selectedProjectId')
  localStorage.removeItem('twoFactorPending')
  localStorage.removeItem('twoFactorProvider')
  
  // Login sayfasına yönlendir
  router.push('/auth/login')
}

const handleClickOutside = (event) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target) && !event.target.closest('.cursor-pointer')) {
    showPopover.value = false
  }
  
  if (notificationRef.value && !notificationRef.value.contains(event.target) && !event.target.closest('button')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  // Kullanıcı verilerini yükle
  const storedUserData = localStorage.getItem('userData')
  if (storedUserData) {
    userData.value = JSON.parse(storedUserData)
  }
  
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>