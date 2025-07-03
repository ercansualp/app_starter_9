<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Tüm Bildirimler</h2>

    <div class="bg-card rounded-lg shadow-sm border border-border-color">
      <!-- Header -->
      <div class="p-6 border-b border-border-color">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h3 class="text-xl font-semibold text-text-primary">Bildirimler</h3>
            <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {{ unreadCount }} okunmamış
            </span>
          </div>
          <div class="flex items-center gap-3">
            <select 
              v-model="selectedFilter" 
              class="px-3 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary text-sm focus:ring-primary focus:border-primary"
            >
              <option value="all">Tüm Bildirimler</option>
              <option value="unread">Okunmamış</option>
              <option value="read">Okunmuş</option>
              <option value="success">Başarılı</option>
              <option value="warning">Uyarı</option>
              <option value="error">Hata</option>
              <option value="info">Bilgi</option>
            </select>
            <button 
              v-if="unreadCount > 0"
              @click="markAllAsRead" 
              class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Tümünü Okundu İşaretle
            </button>
            <button 
              @click="clearAllNotifications" 
              class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Tümünü Temizle
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="divide-y divide-border-color">
        <div v-if="filteredNotifications.length === 0" class="p-12 text-center text-text-secondary">
          <Bell class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 class="text-lg font-medium mb-2">{{ getEmptyStateTitle() }}</h3>
          <p class="text-sm">{{ getEmptyStateMessage() }}</p>
        </div>
        
        <div 
          v-for="notification in paginatedNotifications" 
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="p-6 hover:bg-background/50 cursor-pointer transition-colors"
          :class="{'bg-primary/5': !notification.read}"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-1">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getNotificationIconClass(notification.type)"
              >
                <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
              </div>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-lg font-medium text-text-primary">
                  {{ notification.title }}
                </h4>
                <div class="flex items-center gap-3 ml-4">
                  <span v-if="!notification.read" class="w-3 h-3 bg-primary rounded-full"></span>
                  <span class="text-sm text-text-secondary whitespace-nowrap">
                    {{ formatFullTime(notification.createdAt) }}
                  </span>
                </div>
              </div>
              <p class="text-text-secondary mb-3 leading-relaxed">
                {{ notification.message }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getTypeClass(notification.type)"
                  >
                    {{ getTypeLabel(notification.type) }}
                  </span>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="notification.read ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'"
                  >
                    {{ notification.read ? 'Okundu' : 'Okunmadı' }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="!notification.read"
                    @click.stop="markAsRead(notification)"
                    class="text-sm text-primary hover:underline"
                  >
                    Okundu İşaretle
                  </button>
                  <button 
                    @click.stop="deleteNotification(notification.id)"
                    class="text-sm text-red-500 hover:underline"
                  >
                    Sil
                  </button>
                  <div v-if="notification.actionUrl" class="ml-2">
                    <span class="text-sm text-primary hover:underline font-medium">
                      {{ notification.actionText || 'Detayları Görüntüle' }} →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-6 border-t border-border-color">
        <Pagination
          v-model:currentPage="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, CheckCircle, AlertTriangle, Info, Calendar, User, Settings } from 'lucide-vue-next'
import Pagination from '~/components/Pagination.vue'

const router = useRouter()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Filter
const selectedFilter = ref('all')

// Sample notifications data (same as in Header component)
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Scheduler Job Başarılı',
    message: 'daily-order-sync job\'u başarıyla tamamlandı. 1,245 kayıt işlendi ve tüm veriler başarıyla senkronize edildi.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    actionUrl: '/scheduler',
    actionText: 'Detayları Görüntüle'
  },
  {
    id: 2,
    type: 'warning',
    title: 'API Anahtarı Süresi Dolacak',
    message: 'Ana Proje\'nin API anahtarı 7 gün içinde sona erecek. Yenilemeniz önerilir, aksi takdirde API erişiminiz kesintiye uğrayabilir.',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: '/projects/proj1',
    actionText: 'API Anahtarlarını Yönet'
  },
  {
    id: 3,
    type: 'info',
    title: 'Yeni Mesaj Şablonu Oluşturuldu',
    message: 'Welcome Email şablonu başarıyla oluşturuldu ve kullanıma hazır. Artık yeni kullanıcılara otomatik hoş geldin e-postaları gönderebilirsiniz.',
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    actionUrl: '/message-templates',
    actionText: 'Şablonları Görüntüle'
  },
  {
    id: 4,
    type: 'error',
    title: 'Scheduler Job Başarısız',
    message: 'health-check-ping job\'u başarısız oldu. API endpoint 503 Service Unavailable hatası döndü. Lütfen sistem durumunu kontrol edin.',
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    actionUrl: '/scheduler',
    actionText: 'Logları İncele'
  },
  {
    id: 5,
    type: 'info',
    title: 'Yeni Kullanıcı Davetiyesi',
    message: 'john.doe@example.com adresine gönderilen davetiye kabul edildi. Kullanıcı artık projeye erişim sağlayabilir.',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actionUrl: '/projects',
    actionText: 'Kullanıcıları Görüntüle'
  },
  {
    id: 6,
    type: 'success',
    title: 'Ödeme Başarılı',
    message: 'Aylık abonelik ödemesi başarıyla alındı. Sonraki ödeme tarihi: 15 Ağustos 2024. Fatura e-posta adresinize gönderildi.',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    actionUrl: '/payment-methods',
    actionText: 'Ödeme Geçmişi'
  },
  {
    id: 7,
    type: 'warning',
    title: 'Yüksek API Kullanımı',
    message: 'Bu ay API kullanımınız limitin %85\'ine ulaştı. Ek kullanım ücretlerinden kaçınmak için kullanımınızı izlemenizi öneririz.',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    actionUrl: '/projects',
    actionText: 'Kullanım İstatistikleri'
  },
  {
    id: 8,
    type: 'info',
    title: 'Sistem Bakımı Bildirimi',
    message: 'Planlı sistem bakımı 15 Temmuz 2024 tarihinde 02:00-04:00 saatleri arasında gerçekleştirilecektir.',
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    actionUrl: null,
    actionText: null
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  switch (selectedFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read)
      break
    case 'read':
      filtered = filtered.filter(n => n.read)
      break
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
      filtered = filtered.filter(n => n.type === selectedFilter.value)
      break
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalPages = computed(() => Math.ceil(filteredNotifications.value.length / itemsPerPage))

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNotifications.value.slice(start, end)
})

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

const getTypeClass = (type) => {
  switch (type) {
    case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case 'success': return 'Başarılı'
    case 'warning': return 'Uyarı'
    case 'error': return 'Hata'
    case 'info': return 'Bilgi'
    default: return 'Bilgi'
  }
}

const getEmptyStateTitle = () => {
  switch (selectedFilter.value) {
    case 'unread': return 'Okunmamış bildirim yok'
    case 'read': return 'Okunmuş bildirim yok'
    case 'success': return 'Başarılı bildirim yok'
    case 'warning': return 'Uyarı bildirimi yok'
    case 'error': return 'Hata bildirimi yok'
    case 'info': return 'Bilgi bildirimi yok'
    default: return 'Henüz bildirim yok'
  }
}

const getEmptyStateMessage = () => {
  switch (selectedFilter.value) {
    case 'unread': return 'Tüm bildirimleriniz okunmuş durumda.'
    case 'read': return 'Henüz okunmuş bildirim bulunmuyor.'
    default: return 'Yeni bildirimler burada görünecek.'
  }
}

const formatFullTime = (date) => {
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleNotificationClick = (notification) => {
  // Mark as read
  notification.read = true
  
  // Navigate to action URL if available
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

const markAsRead = (notification) => {
  notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  notifications.value.splice(0)
}

// Reset pagination when filter changes
watch(selectedFilter, () => {
  currentPage.value = 1
})
</script>