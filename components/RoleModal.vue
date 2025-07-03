<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-border-color">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">{{ formTitle }}</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form @submit.prevent="submitForm" class="flex-grow overflow-y-auto">
        <div class="p-6 space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Rol Adı <span class="text-red-500">*</span></label>
            <input v-model="formData.name" type="text" id="name" placeholder="Rol Adı" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Açıklama</label>
            <textarea v-model="formData.description" id="description" rows="3" placeholder="Rol açıklaması" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div class="flex items-center">
            <input v-model="formData.isActive" type="checkbox" id="isActive" class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary">
            <label for="isActive" class="ml-2 block text-sm text-text-primary">Aktif</label>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-3">İzinler</label>
            <div class="space-y-4 max-h-64 overflow-y-auto border border-border-color rounded-md p-4">
              <div v-for="category in permissionsByCategory" :key="category.name">
                <h4 class="font-semibold text-text-primary mb-2">{{ category.name }}</h4>
                <div class="grid grid-cols-1 gap-2 ml-4">
                  <label v-for="permission in category.permissions" :key="permission.id" class="flex items-center">
                    <input 
                      type="checkbox" 
                      :value="permission.id" 
                      v-model="formData.permissions" 
                      class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary"
                    >
                    <span class="ml-2 text-sm text-text-primary">{{ permission.name }}</span>
                    <span v-if="permission.description" class="ml-2 text-xs text-text-secondary">({{ permission.description }})</span>
                  </label>
                </div>
              </div>
            </div>
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
  roleToEdit: {
    type: Object,
    default: null
  },
  availablePermissions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'create-role', 'update-role'])

const isEditing = computed(() => !!props.roleToEdit)
const formTitle = computed(() => isEditing.value ? 'Rolü Düzenle' : 'Yeni Rol Oluştur')
const submitButtonText = computed(() => isEditing.value ? 'Değişiklikleri Kaydet' : 'Rol Oluştur')

const formData = ref({
  name: '',
  description: '',
  isActive: true,
  permissions: []
})

const permissionsByCategory = computed(() => {
  const categories = {}
  props.availablePermissions.forEach(permission => {
    if (!categories[permission.category]) {
      categories[permission.category] = {
        name: permission.category,
        permissions: []
      }
    }
    categories[permission.category].permissions.push(permission)
  })
  return Object.values(categories)
})

watchEffect(() => {
  if (isEditing.value && props.roleToEdit) {
    formData.value = {
      name: props.roleToEdit.name || '',
      description: props.roleToEdit.description || '',
      isActive: props.roleToEdit.isActive ?? true,
      permissions: [...(props.roleToEdit.permissions || [])]
    }
  } else {
    formData.value = {
      name: '',
      description: '',
      isActive: true,
      permissions: []
    }
  }
})

const submitForm = () => {
  if (!formData.value.name) {
    alert('Lütfen rol adını doldurun.')
    return
  }

  const payload = {
    name: formData.value.name,
    description: formData.value.description || null,
    isActive: formData.value.isActive,
    permissions: formData.value.permissions
  }

  if (isEditing.value) {
    payload.id = props.roleToEdit.id
    emit('update-role', payload)
  } else {
    emit('create-role', payload)
  }
}
</script>
