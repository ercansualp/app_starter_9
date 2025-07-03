<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-border-color">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">{{ formTitle }}</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form @submit.prevent="submitForm" class="flex-grow overflow-y-auto">
        <div class="p-6 space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-1">İzin Adı <span class="text-red-500">*</span></label>
            <input v-model="formData.name" type="text" id="name" placeholder="örn: users.create" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-text-secondary mb-1">Kategori <span class="text-red-500">*</span></label>
            <select v-model="formData.category" id="category" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              <option value="">Kategori Seçin</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              <option value="custom">Yeni Kategori</option>
            </select>
          </div>

          <div v-if="formData.category === 'custom'">
            <label for="customCategory" class="block text-sm font-medium text-text-secondary mb-1">Yeni Kategori Adı <span class="text-red-500">*</span></label>
            <input v-model="formData.customCategory" type="text" id="customCategory" placeholder="Yeni kategori adı" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Açıklama</label>
            <textarea v-model="formData.description" id="description" rows="3" placeholder="İzin açıklaması" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"></textarea>
          </div>
        </div>
        <div class="p-6 bg-card border-t border-border-color flex justify-end gap-4 sticky bottom-0">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-md font-semibold text-text-primary bg-card border border-border-color hover:bg-background transition-colors">
            İptal
          </button>
          <button type="submit" class="px-4 py-2 rounded-md text-white bg-primary hover:brightness-90 transition-all font-semibold">
            {{ submitButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  permissionToEdit: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'create-permission', 'update-permission'])

const isEditing = computed(() => !!props.permissionToEdit)
const formTitle = computed(() => isEditing.value ? 'İzni Düzenle' : 'Yeni İzin Oluştur')
const submitButtonText = computed(() => isEditing.value ? 'Değişiklikleri Kaydet' : 'İzin Oluştur')

const formData = ref({
  name: '',
  category: '',
  customCategory: '',
  description: ''
})

watchEffect(() => {
  if (isEditing.value && props.permissionToEdit) {
    formData.value = {
      name: props.permissionToEdit.name || '',
      category: props.permissionToEdit.category || '',
      customCategory: '',
      description: props.permissionToEdit.description || ''
    }
  } else {
    formData.value = {
      name: '',
      category: '',
      customCategory: '',
      description: ''
    }
  }
})

const submitForm = () => {
  if (!formData.value.name || !formData.value.category) {
    alert('Lütfen gerekli alanları doldurun.')
    return
  }

  if (formData.value.category === 'custom' && !formData.value.customCategory) {
    alert('Lütfen yeni kategori adını girin.')
    return
  }

  const payload = {
    name: formData.value.name,
    category: formData.value.category === 'custom' ? formData.value.customCategory : formData.value.category,
    description: formData.value.description || null
  }

  if (isEditing.value) {
    payload.id = props.permissionToEdit.id
    emit('update-permission', payload)
  } else {
    emit('create-permission', payload)
  }
}
</script>
