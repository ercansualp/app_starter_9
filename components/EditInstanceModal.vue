<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-border-color">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">Job Instance'ı Düzenle</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form v-if="formData" @submit.prevent="submitForm" class="flex-grow overflow-y-auto">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="jobKey" class="block text-sm font-medium text-text-secondary mb-1">Job Key</label>
              <input v-model="formData.jobKey" type="text" id="jobKey" placeholder="unique-job-key" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
            </div>
            <div>
              <label for="cron" class="block text-sm font-medium text-text-secondary mb-1">Cron Expression</label>
              <input v-model="formData.cronExpression" type="text" id="cron" placeholder="0 0 * * *" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
            </div>
          </div>

          <div class="space-y-2">
            <KeyValueEditor v-model="formData.uiState.headers" title="Headers" />
            <KeyValueEditor v-model="formData.uiState.queryParams" title="Query Params" />
            <KeyValueEditor v-model="formData.uiState.requestBody" title="Request Body" />
          </div>

          <div class="mt-4 flex items-center">
            <input v-model="formData.enable" type="checkbox" id="instance-enable" class="h-4 w-4 rounded border-border-color bg-input-bg text-primary focus:ring-primary">
            <label for="instance-enable" class="ml-2 text-sm text-text-primary">Instance Aktif</label>
          </div>
        </div>
        <div class="p-6 bg-card border-t border-border-color flex justify-end gap-4 sticky bottom-0">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-md font-semibold text-text-primary bg-card border border-border-color hover:bg-background transition-colors">
            İptal
          </button>
          <button type="submit" class="px-4 py-2 rounded-md text-white bg-primary hover:brightness-90 transition-all font-semibold">
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import KeyValueEditor from '~/components/KeyValueEditor.vue'

const props = defineProps({
  instanceToEdit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update-instance'])

const formData = ref(null)

const dictionaryToArray = (dict) => {
  if (!dict) return []
  return Object.entries(dict).map(([key, value]) => ({ id: uuidv4(), key, value: String(value) }))
}

watchEffect(() => {
  if (props.instanceToEdit) {
    // Deep copy to avoid mutating the prop directly
    const instanceData = JSON.parse(JSON.stringify(props.instanceToEdit))
    formData.value = {
      ...instanceData,
      uiState: {
        headers: dictionaryToArray(instanceData.headers),
        queryParams: dictionaryToArray(instanceData.queryParams),
        requestBody: dictionaryToArray(instanceData.requestBody)
      }
    }
  }
})

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
  if (!formData.value.jobKey || !formData.value.cronExpression) {
    alert('Lütfen Job Key ve Cron Expression alanlarını doldurun.');
    return;
  }

  const dictionaries = transformUiStateToDictionaries(formData.value.uiState)
  
  const payload = {
    id: formData.value.id,
    jobId: formData.value.jobId,
    jobKey: formData.value.jobKey,
    cronExpression: formData.value.cronExpression,
    enable: formData.value.enable,
    ...dictionaries
  }
  
  emit('update-instance', payload)
}
</script>
