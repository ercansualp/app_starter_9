<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/projects" class="text-primary hover:underline inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Projelere Geri Dön
      </NuxtLink>
      <h2 class="text-3xl font-bold text-text-primary mt-2">Yeni Proje Oluştur</h2>
    </div>
    
    <form @submit.prevent="handleFormSubmit" class="bg-card rounded-lg shadow-sm border border-border-color">
      <div class="p-6 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Proje Adı <span class="text-red-500">*</span></label>
          <input v-model="formData.name" type="text" id="name" placeholder="Proje Adı" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-text-secondary mb-2">Logo Kaynağı</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="logoSourceType" value="url" class="form-radio text-primary">
              <span class="ml-2 text-text-primary">URL</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="logoSourceType" value="upload" class="form-radio text-primary">
              <span class="ml-2 text-text-primary">Dosya Yükle</span>
            </label>
          </div>
        </div>

        <div v-if="logoSourceType === 'url'">
          <label for="logoUrl" class="block text-sm font-medium text-text-secondary mb-1">Logo URL</label>
          <input v-model="formData.logo" type="url" id="logoUrl" placeholder="https://example.com/logo.png" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          <p class="mt-1 text-xs text-text-secondary">Proje logosu için bir URL girin (örn: Pexels'ten bir görsel).</p>
        </div>

        <div v-else-if="logoSourceType === 'upload'">
          <label for="logoUpload" class="block text-sm font-medium text-text-secondary mb-1">Logo Yükle</label>
          <input type="file" id="logoUpload" @change="handleFileUpload" accept="image/*" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-500">
          <p class="mt-1 text-xs text-text-secondary">Bilgisayarınızdan bir görsel seçin.</p>
          <div v-if="formData.logo" class="mt-4 flex items-center space-x-3">
            <img :src="formData.logo" alt="Logo Preview" class="w-20 h-20 object-cover rounded-full border border-border-color">
            <button type="button" @click="clearLogo" class="text-red-400 hover:text-red-500 text-sm">Logoyu Kaldır</button>
          </div>
        </div>

        <div class="flex items-center">
          <input v-model="formData.isDefaultProject" type="checkbox" id="isDefaultProject" class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary">
          <label for="isDefaultProject" class="ml-2 block text-sm text-text-secondary">Varsayılan Proje</label>
        </div>
        <div class="flex items-center">
          <input v-model="formData.isActive" type="checkbox" id="isActive" class="h-4 w-4 text-primary rounded border-border-color focus:ring-primary">
          <label for="isActive" class="ml-2 block text-sm text-text-secondary">Aktif</label>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiKeyEditor v-model="formData.apiKeys" @request-delete="deleteApiKey" />
          <details class="bg-background rounded-md border border-border-color">
            <summary class="px-4 py-2 cursor-pointer text-sm font-medium text-text-secondary hover:bg-primary/5 rounded-t-md">
              JWT Ayarları
            </summary>
            <div class="p-4 border-t border-border-color space-y-4">
              <div>
                <label for="jwtIssuer" class="block text-sm font-medium text-text-secondary mb-1">Issuer</label>
                <input v-model="formData.jwtSettings.issuer" type="text" id="jwtIssuer" placeholder="Issuer" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
              <div>
                <label for="jwtSecret" class="block text-sm font-medium text-text-secondary mb-1">Secret</label>
                <input v-model="formData.jwtSettings.secret" type="text" id="jwtSecret" placeholder="Secret" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
              <div>
                <label for="jwtLifetimeMinutes" class="block text-sm font-medium text-text-secondary mb-1">Lifetime (Dakika)</label>
                <input v-model.number="formData.jwtSettings.lifetimeMinutes" type="number" id="jwtLifetimeMinutes" placeholder="Lifetime (Dakika)" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
              <div>
                <label for="jwtRefreshTokenExpiryDays" class="block text-sm font-medium text-text-secondary mb-1">Refresh Token Süresi (Gün)</label>
                <input v-model.number="formData.jwtSettings.refreshTokenExpiryDays" type="number" id="jwtRefreshTokenExpiryDays" placeholder="Refresh Token Süresi (Gün)" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
              <div>
                <label for="jwtAudience" class="block text-sm font-medium text-text-secondary mb-1">Audience</label>
                <input v-model="formData.jwtSettings.audience" type="text" id="jwtAudience" placeholder="Audience" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
              </div>
            </div>
          </details>
        </div>
        <UserManagement v-model:users="formData.users" v-model:invitations="formData.invitations" />
      </div>
      <div class="p-6 bg-card border-t border-border-color flex justify-end gap-4 sticky bottom-0">
        <NuxtLink to="/projects" class="px-4 py-2 rounded-md text-text-primary bg-background border border-border-color hover:bg-border-color transition-colors">
          İptal
        </NuxtLink>
        <button type="submit" class="px-4 py-2 rounded-md text-white bg-primary hover:bg-blue-500 transition-colors font-semibold">
          Proje Oluştur
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '~/composables/useProjects'
import ApiKeyEditor from '~/components/ApiKeyEditor.vue'
import UserManagement from '~/components/UserManagement.vue'

const router = useRouter()
const { addProject } = useProjects()

const getInitialFormData = () => ({
  name: '',
  logo: '',
  isDefaultProject: false,
  isActive: true,
  apiKeys: [],
  users: [],
  invitations: [],
  jwtSettings: {
    issuer: '',
    secret: '',
    lifetimeMinutes: 30,
    refreshTokenExpiryDays: 7,
    audience: ''
  }
})

const formData = ref(getInitialFormData())
const logoSourceType = ref('url')

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.logo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const clearLogo = () => {
  formData.value.logo = '';
  const fileInput = document.getElementById('logoUpload');
  if (fileInput) {
    fileInput.value = '';
  }
};

const deleteApiKey = ({ apiKeyId }) => {
  if (apiKeyId) {
    formData.value.apiKeys = formData.value.apiKeys.filter(key => key.id !== apiKeyId);
  }
}

const handleFormSubmit = () => {
  if (!formData.value.name) {
    alert('Lütfen proje adını doldurun.');
    return;
  }
  
  const projectToSave = JSON.parse(JSON.stringify(formData.value));
  
  projectToSave.apiKeys = projectToSave.apiKeys.map(key => {
    // isNew, geçici bir bayraktır ve kaydedilmemelidir.
    const { isNew, ...rest } = key;
    return rest;
  });

  addProject(projectToSave);
  router.push('/projects');
}
</script>
