<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border-color">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">{{ formTitle }}</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form @submit.prevent="submitForm" class="flex-grow overflow-y-auto">
        <div class="p-6 space-y-6">
          <!-- Job Details -->
          <div class="border border-border-color rounded-lg p-4">
            <h4 class="text-lg font-medium text-text-primary mb-4">Job Detayları</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label for="url" class="block text-sm font-medium text-text-secondary mb-1">URL</label>
                <input v-model="formData.url" type="text" id="url" placeholder="https://api.example.com/hook" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
              <div>
                <label for="method" class="block text-sm font-medium text-text-secondary mb-1">Method</label>
                <select v-model="formData.method" id="method" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>
            </div>
            <div class="mt-4 flex items-center">
              <input v-model="formData.enable" type="checkbox" id="job-enable" class="h-4 w-4 rounded border-border-color bg-input-bg text-primary focus:ring-primary">
              <label for="job-enable" class="ml-2 text-sm text-text-primary">Job Aktif</label>
            </div>
          </div>

          <!-- Job Instances List -->
          <div>
            <h4 class="text-lg font-medium text-text-primary mb-2">Job Instances</h4>
            <div class="space-y-4">
              <div v-for="(instance, index) in formData.jobInstances" :key="instance.id || index" class="border border-border-color rounded-lg p-4 relative bg-background">
                <button v-if="formData.jobInstances.length > 1" type="button" @click="removeInstance(index)" class="absolute top-3 right-3 text-text-secondary hover:text-red-500 transition-colors" title="Instance'ı Sil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label :for="`jobKey-${index}`" class="block text-sm font-medium text-text-secondary mb-1">Job Key</label>
                    <input v-model="instance.jobKey" type="text" :id="`jobKey-${index}`" placeholder="unique-job-key" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                  </div>
                  <div>
                    <label :for="`cron-${index}`" class="block text-sm font-medium text-text-secondary mb-1">Cron Expression</label>
                    <input v-model="instance.cronExpression" type="text" :id="`cron-${index}`" placeholder="0 0 * * *" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                  </div>
                </div>

                <div class="space-y-2">
                  <KeyValueEditor v-model="instance.uiState.headers" title="Headers" />
                  <KeyValueEditor v-model="instance.uiState.queryParams" title="Query Params" />
                  <KeyValueEditor v-model="instance.uiState.requestBody" title="Request Body" />
                </div>

                <div class="mt-4 flex items-center">
                  <input v-model="instance.enable" type="checkbox" :id="`instance-enable-${index}`" class="h-4 w-4 rounded border-border-color bg-input-bg text-primary focus:ring-primary">
                  <label :for="`instance-enable-${index}`" class="ml-2 text-sm text-text-primary">Instance Aktif</label>
                </div>
              </div>
            </div>
            <button type="button" @click="addInstance" class="mt-4 w-full text-center px-4 py-2 rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors border border-dashed border-primary/50">
              <span class="font-semibold">+</span> Yeni Instance Ekle
            </button>
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
import { ref, watchEffect, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import KeyValueEditor from '~/components/KeyValueEditor.vue'

const props = defineProps({
  jobToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'create-job', 'update-job'])

const isEditing = computed(() => !!props.jobToEdit)
const formTitle = computed(() => isEditing.value ? 'Job\'u Düzenle' : 'Yeni Scheduler Job Oluştur')
const submitButtonText = computed(() => isEditing.value ? 'Değişiklikleri Kaydet' : 'Job Oluştur')

const dictionaryToArray = (dict) => {
  if (!dict) return []
  return Object.entries(dict).map(([key, value]) => ({ id: uuidv4(), key, value }))
}

const createDefaultInstance = () => ({
  id: uuidv4(), // for key prop
  jobKey: '',
  cronExpression: '',
  enable: true,
  uiState: {
    headers: [],
    queryParams: [],
    requestBody: []
  }
})

const formData = ref()

watchEffect(() => {
  if (isEditing.value) {
    const jobData = JSON.parse(JSON.stringify(props.jobToEdit))
    formData.value = {
      ...jobData,
      jobInstances: jobData.jobInstances.map(instance => ({
        ...instance,
        uiState: {
          headers: dictionaryToArray(instance.headers),
          queryParams: dictionaryToArray(instance.queryParams),
          requestBody: dictionaryToArray(instance.requestBody)
        }
      }))
    }
  } else {
    formData.value = {
      url: '',
      method: 'GET',
      enable: true,
      jobInstances: [createDefaultInstance()]
    }
  }
})

const addInstance = () => {
  formData.value.jobInstances.push(createDefaultInstance())
}

const removeInstance = (index) => {
  if (formData.value.jobInstances.length > 1) {
    formData.value.jobInstances.splice(index, 1)
  }
}

const transformUiStateToDictionaries = (uiState) => {
  const transform = (arr) => arr.reduce((acc, item) => {
    if (item.key) {
      acc[item.key] = item.value
    }
    return acc
  }, {})

  return {
    headers: transform(uiState.headers),
    queryParams: transform(uiState.queryParams),
    requestBody: transform(uiState.requestBody)
  }
}

const submitForm = () => {
  if (!formData.value.url) {
    alert('Lütfen URL alanını doldurun.');
    return;
  }

  const jobInstancesPayload = formData.value.jobInstances.map(instance => {
    if (!instance.jobKey || !instance.cronExpression) {
      throw new Error('Lütfen tüm Job Instance alanlarını (Job Key ve Cron Expression) doldurun.');
    }
    const dictionaries = transformUiStateToDictionaries(instance.uiState)
    const instancePayload = {
      jobKey: instance.jobKey,
      cronExpression: instance.cronExpression,
      enable: instance.enable,
      ...dictionaries
    }
    if(isEditing.value) {
      instancePayload.id = instance.id
      instancePayload.jobId = instance.jobId
    }
    return instancePayload
  })

  const payload = {
    url: formData.value.url,
    method: formData.value.method,
    enable: formData.value.enable,
    jobInstances: jobInstancesPayload
  }
  
  if (isEditing.value) {
    payload.id = formData.value.id
    emit('update-job', payload)
  } else {
    emit('create-job', payload)
  }
}
</script>
