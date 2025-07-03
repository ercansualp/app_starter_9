<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Proje Seçimi</h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Çalışmak istediğiniz projeyi seçin veya yeni bir proje oluşturun</p>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Create New Project Card -->
          <div 
            @click="openCreateProjectModal"
            class="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 min-h-[200px] group"
          >
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Yeni Proje Oluştur</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">İlk projenizi oluşturmak için tıklayın</p>
          </div>

          <!-- Existing Projects -->
          <div 
            v-for="project in userProjects" 
            :key="project.id"
            @click="selectProject(project)"
            class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200 min-h-[200px] flex flex-col"
          >
            <div class="flex items-center mb-4">
              <img 
                v-if="project.logo" 
                :src="project.logo" 
                :alt="project.name" 
                class="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600"
              >
              <div 
                v-else 
                class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4"
              >
                {{ project.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.name }}</h3>
                <div class="flex items-center mt-1">
                  <span 
                    v-if="project.isDefaultProject" 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  >
                    Varsayılan
                  </span>
                  <span 
                    :class="project.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2"
                  >
                    {{ project.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex-1 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex justify-between">
                <span>API Anahtarları:</span>
                <span class="font-medium">{{ project.apiKeys?.length || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span>Kullanıcılar:</span>
                <span class="font-medium">{{ project.users?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div class="flex items-center justify-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="w-3 h-3 rounded-full bg-primary"></div>
        </div>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Adım 3 / 3</p>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Yeni Proje Oluştur</h3>
            <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <form @submit.prevent="createProject" class="p-6 space-y-4">
          <div>
            <label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proje Adı <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="newProject.name"
              type="text" 
              id="projectName" 
              placeholder="Örn: E-ticaret Projesi" 
              required 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="projectLogo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo URL (Opsiyonel)
            </label>
            <input 
              v-model="newProject.logo"
              type="url" 
              id="projectLogo" 
              placeholder="https://example.com/logo.png" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
          </div>

          <div class="flex items-center">
            <input 
              v-model="newProject.isDefaultProject"
              type="checkbox" 
              id="isDefault" 
              class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            >
            <label for="isDefault" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Varsayılan proje olarak ayarla
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              :disabled="!newProject.name"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '~/composables/useProjects'

definePageMeta({
  layout: false
})

const router = useRouter()
const { projects, addProject } = useProjects()

const userProjects = ref([])
const showCreateModal = ref(false)
const newProject = ref({
  name: '',
  logo: '',
  isDefaultProject: false
})

onMounted(() => {
  // Auth ve onboarding kontrolleri
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const selectedCurrency = localStorage.getItem('selectedCurrency')
  const paymentInfo = localStorage.getItem('paymentInfo')
  
  if (!isAuthenticated || isAuthenticated !== 'true') {
    router.push('/auth/login')
    return
  }
  
  if (!selectedCurrency) {
    router.push('/onboarding/currency')
    return
  }
  
  if (!paymentInfo) {
    router.push('/onboarding/payment')
    return
  }

  // Kullanıcının projelerini yükle (şimdilik boş, gerçek uygulamada API'den gelecek)
  userProjects.value = projects.value.filter(p => p.ownerId === 'current_user_id')
})

const openCreateProjectModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newProject.value = {
    name: '',
    logo: '',
    isDefaultProject: false
  }
}

const createProject = () => {
  if (!newProject.value.name) return

  const projectData = {
    name: newProject.value.name,
    logo: newProject.value.logo || '',
    isDefaultProject: newProject.value.isDefaultProject,
    isActive: true
  }

  addProject(projectData)
  
  // Onboarding tamamlandı olarak işaretle
  localStorage.setItem('onboardingCompleted', 'true')
  
  // Ana sayfaya yönlendir
  router.push('/')
}

const selectProject = (project) => {
  // Seçilen projeyi kaydet
  localStorage.setItem('selectedProjectId', project.id)
  localStorage.setItem('onboardingCompleted', 'true')
  
  // Ana sayfaya yönlendir
  router.push('/')
}

// Renk modu için
useColorMode()
</script>