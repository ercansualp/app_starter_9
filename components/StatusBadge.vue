<template>
  <span :class="badgeClass" class="px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center">
    <span class="w-2 h-2 rounded-full mr-1.5" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['active', 'inactive', 'success', 'failure'].includes(value)
  }
})

const config = {
  active: {
    label: 'Aktif',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    dot: 'bg-green-500'
  },
  inactive: {
    label: 'Pasif',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    dot: 'bg-gray-500'
  },
  success: {
    label: 'Başarılı',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    dot: 'bg-blue-500'
  },
  failure: {
    label: 'Başarısız',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    dot: 'bg-red-500'
  }
}

const badgeClass = computed(() => config[props.type].badge)
const dotClass = computed(() => config[props.type].dot)
const label = computed(() => config[props.type].label)
</script>
