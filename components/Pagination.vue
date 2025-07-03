<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-6">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 rounded-lg text-text-secondary bg-background-alt hover:bg-hover-light dark:hover:bg-hover-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Önceki
    </button>
    <button
      v-for="page in pagesToShow"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-colors',
        page === currentPage
          ? 'bg-primary text-white'
          : 'text-text-secondary bg-background-alt hover:bg-hover-light dark:hover:bg-hover-dark'
      ]"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 rounded-lg text-text-secondary bg-background-alt hover:bg-hover-light dark:hover:bg-hover-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Sonraki
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxPages: {
    type: Number,
    default: 5 // Number of page buttons to show
  }
})

const emit = defineEmits(['update:currentPage'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const pagesToShow = computed(() => {
  const pages = []
  const startPage = Math.max(1, props.currentPage - Math.floor(props.maxPages / 2))
  const endPage = Math.min(props.totalPages, startPage + props.maxPages - 1)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Adjust if we don't have enough pages at the end
  while (pages.length < props.maxPages && pages[0] > 1) {
    pages.unshift(pages[0] - 1)
  }
  // Adjust if we don't have enough pages at the beginning
  while (pages.length < props.maxPages && pages[pages.length - 1] < props.totalPages) {
    pages.push(pages[pages.length - 1] + 1)
  }

  return pages
})
</script>

<style scoped>
/* Tailwind classes are used directly in the template, no additional scoped styles needed unless for complex custom elements */
</style>
