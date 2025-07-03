<template>
  <div class="flex h-screen bg-background">
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>
    
    <!-- Sidebar -->
    <Transition name="slide">
      <Sidebar 
        v-if="isSidebarOpen" 
        :class="[
          'fixed lg:relative z-50 lg:z-auto',
          'lg:translate-x-0'
        ]"
      />
    </Transition>
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import { useSidebar } from '~/composables/useSidebar'

const { isSidebarOpen, toggleSidebar } = useSidebar()

// Küçük ekranlarda sayfa yüklendiğinde sidebar'ı kapat
onMounted(() => {
  if (process.client && window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
})
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Mobil cihazlarda sidebar overlay olarak gösterilir */
@media (max-width: 1023px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
}
</style>
