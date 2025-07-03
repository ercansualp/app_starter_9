<template>
  <details class="bg-background rounded-md border border-border-color">
    <summary class="px-4 py-2 cursor-pointer text-sm font-medium text-text-secondary hover:bg-primary/5 rounded-t-md">
      API Anahtarları <span class="text-xs text-text-secondary">({{ modelValue.length }})</span>
    </summary>
    <div class="p-4 border-t border-border-color space-y-4">
      <div v-for="(apiKey, index) in modelValue" :key="apiKey.id" class="bg-card p-3 rounded-md border border-border-color space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold text-text-primary">API Anahtarı #{{ index + 1 }}</h4>
          <button type="button" @click="requestDeleteApiKey(apiKey.id, apiKey.name)" class="p-1.5 text-text-secondary hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div>
          <label :for="`apiKeyName-${apiKey.id}`" class="block text-xs font-medium text-text-secondary mb-1">Ad</label>
          <input v-model="apiKey.name" :id="`apiKeyName-${apiKey.id}`" type="text" placeholder="Örn: Mobil Uygulama Anahtarı" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-1.5 text-sm text-text-primary focus:ring-primary focus:border-primary">
        </div>
        <div>
          <label :for="`apiKeyValue-${apiKey.id}`" class="block text-xs font-medium text-text-secondary mb-1">Değer</label>
          <div class="flex items-center gap-2">
            <input :value="getDisplayValue(apiKey)" :id="`apiKeyValue-${apiKey.id}`" type="text" readonly class="w-full bg-background border border-border-color rounded-md px-3 py-1.5 text-sm text-text-secondary focus:ring-0 focus:border-border-color cursor-default font-mono">
            <button v-if="apiKey.isNew" type="button" @click="copyToClipboard(apiKey.value, apiKey.id)" class="p-2 text-text-secondary hover:text-text-primary bg-input-bg hover:bg-border-color rounded-md transition-colors w-28 flex items-center justify-center">
              <span v-if="copiedKeyId === apiKey.id" class="text-xs text-green-400">Kopyalandı!</span>
              <div v-else class="flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span class="text-xs">Kopyala</span>
              </div>
            </button>
          </div>
          <div v-if="apiKey.isNew" class="mt-2 flex items-start gap-2 text-yellow-400 text-xs p-2 bg-yellow-900/20 rounded-md border border-yellow-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>Bu anahtar yalnızca bir kez gösterilir. Lütfen şimdi kopyalayıp güvenli bir yere kaydedin.</span>
          </div>
        </div>
        <div>
          <label :for="`apiKeyExpireDate-${apiKey.id}`" class="block text-xs font-medium text-text-secondary mb-1">Son Kullanma Tarihi</label>
          <input v-model="apiKey.expireDate" :id="`apiKeyExpireDate-${apiKey.id}`" type="date" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-1.5 text-sm text-text-primary focus:ring-primary focus:border-primary">
        </div>
        <div class="flex items-center">
          <input v-model="apiKey.isActive" :id="`apiKeyIsActive-${apiKey.id}`" type="checkbox" class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary">
          <label :for="`apiKeyIsActive-${apiKey.id}`" class="ml-2 block text-sm text-text-secondary">Aktif</label>
        </div>
      </div>
      <button type="button" @click="addItem" class="w-full text-sm text-center px-3 py-1.5 rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors border border-dashed border-primary/50">
        + Yeni API Anahtarı Ekle
      </button>
    </div>
  </details>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'request-delete'])

const copiedKeyId = ref(null)

const generateApiKey = () => {
  const array = new Uint8Array(24); // 24 bytes = 48 hex characters
  window.crypto.getRandomValues(array);
  const key = Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
  return `sk_${key}`;
}

const getDisplayValue = (apiKey) => {
  // Anahtarları her zaman sansürle, sadece prefix ve son 4 karakteri göster
  return `sk_****************************************${apiKey.value.slice(-4)}`;
}

const addItem = () => {
  const newValue = [...props.modelValue, {
    id: uuidv4(),
    name: '',
    value: generateApiKey(),
    expireDate: '', // YYYY-MM-DD formatında string
    isActive: true,
    isNew: true // Anahtarın yeni olduğunu belirtmek için geçici bir bayrak
  }]
  emit('update:modelValue', newValue)
}

const requestDeleteApiKey = (apiKeyId, apiKeyName) => {
  emit('request-delete', { apiKeyId, apiKeyName });
}

const copyToClipboard = async (text, keyId) => {
  if (copiedKeyId.value) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedKeyId.value = keyId;
    setTimeout(() => {
      copiedKeyId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>
