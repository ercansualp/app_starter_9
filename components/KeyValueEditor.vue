<template>
  <details class="bg-background rounded-md border border-border-color">
    <summary class="px-4 py-2 cursor-pointer text-sm font-medium text-text-secondary hover:bg-primary/5 rounded-t-md">
      {{ title }} <span class="text-xs text-text-secondary">({{ modelValue.length }})</span>
    </summary>
    <div class="p-4 border-t border-border-color space-y-2">
      <div v-for="(item, index) in modelValue" :key="item.id" class="flex items-center gap-2">
        <input v-model="item.key" type="text" :placeholder="keyPlaceholder" class="flex-1 bg-input-bg border border-border-color rounded-md px-3 py-1.5 text-sm text-text-primary focus:ring-primary focus:border-primary">
        <input v-model="item.value" type="text" :placeholder="valuePlaceholder" class="flex-1 bg-input-bg border border-border-color rounded-md px-3 py-1.5 text-sm text-text-primary focus:ring-primary focus:border-primary">
        <button type="button" @click="removeItem(index)" class="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
      <button type="button" @click="addItem" class="w-full text-sm text-center px-3 py-1.5 rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors border border-dashed border-primary/50">
        + Yeni Ekle
      </button>
    </div>
  </details>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Key-Value Pairs'
  },
  keyPlaceholder: {
    type: String,
    default: 'Key'
  },
  valuePlaceholder: {
    type: String,
    default: 'Value'
  }
})

const emit = defineEmits(['update:modelValue'])

const addItem = () => {
  const newValue = [...props.modelValue, { id: uuidv4(), key: '', value: '' }]
  emit('update:modelValue', newValue)
}

const removeItem = (index) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}
</script>
