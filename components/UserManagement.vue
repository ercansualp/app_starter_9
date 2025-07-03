<template>
  <details class="bg-background rounded-md border border-border-color" open>
    <summary class="px-4 py-2 cursor-pointer text-sm font-medium text-text-secondary hover:bg-primary/5 rounded-t-md">
      Kullanıcı Yönetimi
    </summary>
    <div class="p-4 border-t border-border-color space-y-6">
      
      <!-- Kullanıcı Davet Etme Formu -->
      <div>
        <h4 class="text-lg font-semibold text-text-primary mb-3">Kullanıcı Davet Et</h4>
        <form @submit.prevent="sendInvitation" class="flex items-end gap-4">
          <div class="flex-grow">
            <label for="email" class="block text-sm font-medium text-text-secondary mb-1">E-posta Adresi</label>
            <input v-model="newInvitation.email" type="email" id="email" placeholder="kullanici@example.com" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-text-secondary mb-1">Rol</label>
            <select v-model="newInvitation.roleName" id="role" required class="bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary h-[42px]">
              <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          <button type="submit" class="px-4 py-2 rounded-md text-white bg-primary hover:bg-blue-500 transition-colors font-semibold h-[42px]">
            Davet Gönder
          </button>
        </form>
      </div>

      <!-- Bekleyen Davetler -->
      <div>
        <h4 class="text-lg font-semibold text-text-primary mb-3">Bekleyen Davetler</h4>
        <div v-if="invitations.length === 0" class="text-center text-text-secondary py-4 bg-background rounded-md">
          Bekleyen davet bulunmamaktadır.
        </div>
        <ul v-else class="space-y-2">
          <li v-for="(invitation, index) in invitations" :key="invitation.id" class="flex items-center justify-between bg-background p-3 rounded-md">
            <div class="flex items-center gap-3">
              <span class="text-text-primary">{{ invitation.email }}</span>
              <span class="text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full">{{ invitation.roleName }}</span>
              <span :class="statusClass(invitation.status)" class="text-xs px-2 py-0.5 rounded-full">{{ invitation.status }}</span>
            </div>
            <button @click="cancelInvitation(index)" class="text-red-400 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Proje Kullanıcıları -->
      <div>
        <h4 class="text-lg font-semibold text-text-primary mb-3">Proje Kullanıcıları</h4>
        <div v-if="users.length === 0" class="text-center text-text-secondary py-4 bg-background rounded-md">
          Projeye atanmış kullanıcı bulunmamaktadır.
        </div>
        <ul v-else class="space-y-2">
          <li v-for="(user, index) in users" :key="user.id" class="flex items-center justify-between bg-background p-3 rounded-md">
            <div class="flex items-center gap-4">
              <img 
                :src="user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1d4ed8&color=fff&size=40`" 
                :alt="`${user.firstName} ${user.lastName}`" 
                class="w-10 h-10 rounded-full object-cover border-2 border-border-color"
              >
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-text-primary">{{ user.firstName }} {{ user.lastName }}</span>
                  <span class="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">{{ user.role }}</span>
                </div>
                <span class="text-sm text-text-secondary">{{ user.email }}</span>
              </div>
            </div>
            <button @click="removeUser(index)" class="p-1.5 rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </li>
        </ul>
      </div>

    </div>
  </details>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const users = defineModel('users', { type: Array, default: () => [] })
const invitations = defineModel('invitations', { type: Array, default: () => [] })

const availableRoles = ref(['Admin', 'Developer', 'Viewer'])

const newInvitation = ref({
  email: '',
  roleName: 'Developer'
})

const sendInvitation = () => {
  if (!newInvitation.value.email) return

  const newInv = {
    id: uuidv4(),
    email: newInvitation.value.email,
    roleName: newInvitation.value.roleName,
    status: 'Pending',
    expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  }
  
  invitations.value.push(newInv)

  // Reset form
  newInvitation.value.email = ''
  newInvitation.value.roleName = 'Developer'
}

const cancelInvitation = (index) => {
  invitations.value.splice(index, 1)
}

const removeUser = (index) => {
  // Proje sahibinin silinmesini engellemek gibi ek kontroller eklenebilir.
  users.value.splice(index, 1)
}

const statusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-500 text-black'
    case 'Accepted':
      return 'bg-green-500 text-white'
    case 'Expired':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
</script>
