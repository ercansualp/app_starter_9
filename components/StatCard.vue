<template>
  <div class="bg-card p-6 rounded-xl flex items-center gap-6">
    <div class="p-4 bg-primary/20 rounded-lg">
      <component :is="icon" class="w-8 h-8 text-primary" />
    </div>
    <div>
      <p class="text-text-secondary text-sm font-medium">{{ title }}</p>
      <p class="text-3xl font-bold text-text-primary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  title: String,
  value: String,
})
</script>
