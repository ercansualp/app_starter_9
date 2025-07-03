<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Proje Yönetimi</h2>

    <div class="bg-card rounded-lg shadow-sm border border-border-color overflow-hidden p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-text-primary">Projeleriniz</h3>
      </div>

      <div v-if="projects.length === 0" class="text-center text-text-secondary py-8">
        Henüz proje bulunmamaktadır. Yeni bir proje oluşturmak için aşağıdaki kartı kullanın.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Yeni Proje Oluşturma Kartı -->
        <NuxtLink
          to="/projects/new"
          class="bg-background border-2 border-dashed border-border-color rounded-lg p-5 flex flex-col justify-center items-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors duration-200 min-h-[180px]"
        >
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <h4 class="text-lg font-semibold text-text-primary">Yeni Proje Oluştur</h4>
          <p class="text-sm text-text-secondary mt-1">Yeni bir proje eklemek için tıklayın.</p>
        </NuxtLink>

        <!-- Mevcut Proje Kartları -->
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-card border border-border-color rounded-lg p-5 flex flex-col justify-between hover:border-primary hover:shadow-md transition-all duration-200"
        >
          <div>
            <div class="flex items-center mb-4">
              <img v-if="project.logo" :src="project.logo" alt="Project Logo" class="w-12 h-12 rounded-full object-cover mr-4 border border-border-color">
              <div v-else class="w-12 h-12 rounded-full bg-input-bg flex items-center justify-center text-text-secondary text-xl font-bold mr-4">
                {{ project.name.charAt(0).toUpperCase() }}
              </div>
              <h4 class="text-lg font-semibold text-text-primary">{{ project.name }}</h4>
            </div>
            <div class="text-sm text-text-secondary space-y-2">
              <p class="flex justify-between">
                <span class="font-medium">Varsayılan Proje:</span>
                <span class="font-semibold" :class="project.isDefaultProject ? 'text-green-500' : 'text-red-500'">
                  {{ project.isDefaultProject ? 'Evet' : 'Hayır' }}
                </span>
              </p>
              <p class="flex justify-between">
                <span class="font-medium">Aktif:</span>
                <span class="font-semibold" :class="project.isActive ? 'text-green-500' : 'text-red-500'">
                  {{ project.isActive ? 'Evet' : 'Hayır' }}
                </span>
              </p>
              <p class="flex justify-between">
                <span class="font-medium">API Anahtarları:</span>
                <span class="font-semibold text-text-primary">{{ project.apiKeys.length }}</span>
              </p>
              <p class="flex justify-between">
                <span class="font-medium">JWT Ayarları:</span>
                <span class="font-semibold" :class="project.jwtSettings && project.jwtSettings.issuer ? 'text-green-500' : 'text-red-500'">
                  {{ project.jwtSettings && project.jwtSettings.issuer ? 'Ayarlı' : 'Ayarlanmamış' }}
                </span>
              </p>
              <p class="flex justify-between">
                <span class="font-medium">Kalan Kredi:</span>
                <span class="font-semibold text-text-primary">{{ project.credits }}</span>
              </p>
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <NuxtLink :to="`/projects/${project.id}`" class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors">
              Düzenle
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjects } from '~/composables/useProjects'

const { projects } = useProjects()
</script>
