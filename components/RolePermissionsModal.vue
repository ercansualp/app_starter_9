<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border-color">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">{{ role.name }} - İzin Yönetimi</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="flex-grow overflow-y-auto p-6">
        <div class="mb-4 flex justify-between items-center">
          <p class="text-text-secondary">Bu role ait izinleri yönetin. Seçili izinler role atanacaktır.</p>
          <div class="flex gap-2">
            <button @click="selectAll" class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-blue-500 transition-colors">
              Tümünü Seç
            </button>
            <button @click="deselectAll" class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              Tümünü Kaldır
            </button>
          </div>
        </div>
        
        <div class="space-y-6">
          <div v-for="category in permissionsByCategory" :key="category.name" class="border border-border-color rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-text-primary">{{ category.name }}</h4>
              <div class="flex gap-2">
                <button @click="selectCategory(category.name)" class="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-blue-500 transition-colors">
                  Kategoriyi Seç
                </button>
                <button @click="deselectCategory(category.name)" class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                  Kategoriyi Kaldır
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label v-for="permission in category.permissions" :key="permission.id" class="flex items-start p-3 border border-border-color rounded-md hover:bg-background/50 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  :value="permission.id" 
                  v-model="selectedPermissions" 
                  class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary mt-0.5 flex-shrink-0"
                >
                <div class="ml-3">
                  <span class="text-sm font-medium text-text-primary">{{ permission.name }}</span>
                  <p v-if="permission.description" class="text-xs text-text-secondary mt-1">{{ permission.description }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6 bg-card border-t border-border-color flex justify-between items-center">
        <div class="text-sm text-text-secondary">
          Seçili İzinler: {{ selectedPermissions.length }} / {{ availablePermissions.length }}
        </div>
        <div class="flex gap-4">
          <button @click="$emit('close')" class="px-4 py-2 rounded-md font-semibold text-text-primary bg-card border border-border-color hover:bg-background transition-colors">
            İptal
          </button>
          <button @click="savePermissions" class="px-4 py-2 rounded-md text-white bg-primary hover:brightness-90 transition-all font-semibold">
            İzinleri Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  role: {
    type: Object,
    required: true
  },
  availablePermissions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'update-permissions'])

const selectedPermissions = ref([])

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
  if (props.role) {
    selectedPermissions.value = [...(props.role.permissions || [])]
  }
})

const selectAll = () => {
  selectedPermissions.value = props.availablePermissions.map(p => p.id)
}

const deselectAll = () => {
  selectedPermissions.value = []
}

const selectCategory = (categoryName) => {
  const categoryPermissions = props.availablePermissions
    .filter(p => p.category === categoryName)
    .map(p => p.id)
  
  categoryPermissions.forEach(permId => {
    if (!selectedPermissions.value.includes(permId)) {
      selectedPermissions.value.push(permId)
    }
  })
}

const deselectCategory = (categoryName) => {
  const categoryPermissions = props.availablePermissions
    .filter(p => p.category === categoryName)
    .map(p => p.id)
  
  selectedPermissions.value = selectedPermissions.value.filter(
    permId => !categoryPermissions.includes(permId)
  )
}

const savePermissions = () => {
  emit('update-permissions', props.role.id, selectedPermissions.value)
}
</script>
