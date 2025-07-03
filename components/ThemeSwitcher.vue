<template>
  <div class="relative">
    <button @click="toggleDropdown" class="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
      <ClientOnly>
        <Icon name="lucide:sun" class="w-6 h-6 text-yellow-500" v-if="$colorMode.value === 'light'" />
        <Icon name="lucide:moon" class="w-6 h-6 text-blue-300" v-else-if="$colorMode.value === 'dark'" />
        <Icon name="lucide:monitor" class="w-6 h-6" v-else />
        <template #fallback>
          <div class="w-6 h-6 rounded-full bg-border-color animate-pulse"></div>
        </template>
      </ClientOnly>
    </button>
    <Transition name="fade">
      <div v-if="isDropdownOpen" ref="dropdownRef" class="absolute top-full right-0 mt-2 w-36 bg-sidebar border border-border-color rounded-lg shadow-lg p-1 z-10">
        <ul>
          <li v-for="theme in themes" :key="theme.key">
            <button @click="setTheme(theme.key)" class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-left" :class="[
                $colorMode.preference === theme.key
                  ? 'font-semibold text-primary bg-primary/10'
                  : 'text-text-primary hover:bg-background'
              ]">
              <Icon :name="theme.icon" class="w-5 h-5" />
              <span>{{ theme.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const colorMode = useColorMode()

const themes = [
  { key: 'light', name: 'Açık', icon: 'lucide:sun' },
  { key: 'dark', name: 'Koyu', icon: 'lucide:moon' },
  { key: 'system', name: 'Sistem', icon: 'lucide:monitor' },
]

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const setTheme = (theme) => {
  colorMode.preference = theme
  isDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (isDropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target) && !event.target.closest('button')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
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
</style>
