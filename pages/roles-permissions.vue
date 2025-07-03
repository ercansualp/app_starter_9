<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Rol ve İzin Yönetimi</h2>

    <div class="space-y-8">
      <!-- Roles Management Card -->
      <div class="bg-card rounded-lg shadow-md border border-border-color overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-text-primary">Roller</h3>
            <button @click="openCreateRoleModal" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Yeni Rol Oluştur
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="border-b border-border-color">
                <tr>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Rol Adı</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Açıklama</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">İzin Sayısı</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Kullanıcı Sayısı</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Durum</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in roles" :key="role.id" class="border-b border-border-color hover:bg-background/50 transition-colors">
                  <td class="p-4 text-text-primary font-medium">{{ role.name }}</td>
                  <td class="p-4 text-text-secondary text-sm">{{ role.description || '-' }}</td>
                  <td class="p-4 text-text-primary">{{ role.permissions.length }}</td>
                  <td class="p-4 text-text-primary">{{ role.userCount || 0 }}</td>
                  <td class="p-4">
                    <StatusBadge :type="role.isActive ? 'active' : 'inactive'" />
                  </td>
                  <td class="p-4 flex items-center gap-3">
                    <button @click="openEditRoleModal(role)" class="text-yellow-600 dark:text-yellow-400 hover:underline text-sm font-medium">
                      Düzenle
                    </button>
                    <button @click="openRolePermissionsModal(role)" class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                      İzinler
                    </button>
                    <button v-if="!role.isSystemRole" @click="openDeleteRoleConfirmation(role)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
                      Sil
                    </button>
                  </td>
                </tr>
                <tr v-if="roles.length === 0">
                  <td colspan="6" class="p-4 text-center text-text-secondary">Henüz rol bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Permissions Management Card -->
      <div class="bg-card rounded-lg shadow-md border border-border-color overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-text-primary">İzinler</h3>
            <button @click="openCreatePermissionModal" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Yeni İzin Oluştur
            </button>
          </div>

          <div class="mb-4 flex gap-4">
            <select v-model="selectedCategory" class="px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200">
              <option value="">Tüm Kategoriler</option>
              <option v-for="category in permissionCategories" :key="category" :value="category">{{ category }}</option>
            </select>
            <input
              type="text"
              v-model="permissionFilter"
              placeholder="İzin adına göre filtrele..."
              class="flex-grow px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary placeholder-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="border-b border-border-color">
                <tr>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">İzin Adı</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Kategori</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Açıklama</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Rol Sayısı</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="permission in filteredPermissions" :key="permission.id" class="border-b border-border-color hover:bg-background/50 transition-colors">
                  <td class="p-4 text-text-primary font-medium">{{ permission.name }}</td>
                  <td class="p-4">
                    <span class="px-2 py-1 text-xs font-bold rounded" :class="getCategoryClass(permission.category)">
                      {{ permission.category }}
                    </span>
                  </td>
                  <td class="p-4 text-text-secondary text-sm">{{ permission.description || '-' }}</td>
                  <td class="p-4 text-text-primary">{{ getRoleCountForPermission(permission.id) }}</td>
                  <td class="p-4 flex items-center gap-3">
                    <button @click="openEditPermissionModal(permission)" class="text-yellow-600 dark:text-yellow-400 hover:underline text-sm font-medium">
                      Düzenle
                    </button>
                    <button v-if="!permission.isSystemPermission" @click="openDeletePermissionConfirmation(permission)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
                      Sil
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPermissions.length === 0">
                  <td colspan="5" class="p-4 text-center text-text-secondary">Filtreye uygun izin bulunmamaktadır.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination
            v-model:currentPage="permissionsCurrentPage"
            :total-pages="permissionsTotalPages"
            class="mt-4"
          />
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <RoleModal
      v-if="showRoleModal"
      :role-to-edit="roleToEdit"
      :available-permissions="permissions"
      @close="closeRoleModal"
      @create-role="handleRoleCreated"
      @update-role="handleRoleUpdated"
    />

    <!-- Permission Modal -->
    <PermissionModal
      v-if="showPermissionModal"
      :permission-to-edit="permissionToEdit"
      :categories="permissionCategories"
      @close="closePermissionModal"
      @create-permission="handlePermissionCreated"
      @update-permission="handlePermissionUpdated"
    />

    <!-- Role Permissions Modal -->
    <RolePermissionsModal
      v-if="showRolePermissionsModal"
      :role="selectedRoleForPermissions"
      :available-permissions="permissions"
      @close="closeRolePermissionsModal"
      @update-permissions="handleRolePermissionsUpdated"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmationModal"
      :title="confirmationConfig.title"
      :message="confirmationConfig.message"
      :confirm-text="confirmationConfig.confirmText"
      :confirm-button-class="confirmationConfig.confirmButtonClass"
      @close="closeConfirmationModal"
      @confirm="handleConfirmation"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import StatusBadge from '~/components/StatusBadge.vue'
import RoleModal from '~/components/RoleModal.vue'
import PermissionModal from '~/components/PermissionModal.vue'
import RolePermissionsModal from '~/components/RolePermissionsModal.vue'
import ConfirmationModal from '~/components/ConfirmationModal.vue'
import Pagination from '~/components/Pagination.vue'

// Modal states
const showRoleModal = ref(false)
const showPermissionModal = ref(false)
const showRolePermissionsModal = ref(false)
const showConfirmationModal = ref(false)

const roleToEdit = ref(null)
const permissionToEdit = ref(null)
const selectedRoleForPermissions = ref(null)

// Filter states
const selectedCategory = ref('')
const permissionFilter = ref('')

// Pagination
const permissionsCurrentPage = ref(1)
const permissionsPerPage = 10

// Confirmation config
const confirmationConfig = ref({
  title: '',
  message: '',
  confirmText: '',
  confirmButtonClass: '',
  onConfirm: () => {}
})

// Sample data
const permissions = ref([
  { id: 'perm1', name: 'users.create', category: 'User Management', description: 'Kullanıcı oluşturma izni', isSystemPermission: true },
  { id: 'perm2', name: 'users.read', category: 'User Management', description: 'Kullanıcı görüntüleme izni', isSystemPermission: true },
  { id: 'perm3', name: 'users.update', category: 'User Management', description: 'Kullanıcı güncelleme izni', isSystemPermission: true },
  { id: 'perm4', name: 'users.delete', category: 'User Management', description: 'Kullanıcı silme izni', isSystemPermission: true },
  { id: 'perm5', name: 'projects.create', category: 'Project Management', description: 'Proje oluşturma izni', isSystemPermission: true },
  { id: 'perm6', name: 'projects.read', category: 'Project Management', description: 'Proje görüntüleme izni', isSystemPermission: true },
  { id: 'perm7', name: 'projects.update', category: 'Project Management', description: 'Proje güncelleme izni', isSystemPermission: true },
  { id: 'perm8', name: 'projects.delete', category: 'Project Management', description: 'Proje silme izni', isSystemPermission: true },
  { id: 'perm9', name: 'scheduler.create', category: 'Scheduler', description: 'Scheduler job oluşturma izni', isSystemPermission: true },
  { id: 'perm10', name: 'scheduler.read', category: 'Scheduler', description: 'Scheduler job görüntüleme izni', isSystemPermission: true },
  { id: 'perm11', name: 'scheduler.update', category: 'Scheduler', description: 'Scheduler job güncelleme izni', isSystemPermission: true },
  { id: 'perm12', name: 'scheduler.delete', category: 'Scheduler', description: 'Scheduler job silme izni', isSystemPermission: true },
  { id: 'perm13', name: 'messages.create', category: 'Message Templates', description: 'Mesaj şablonu oluşturma izni', isSystemPermission: true },
  { id: 'perm14', name: 'messages.read', category: 'Message Templates', description: 'Mesaj şablonu görüntüleme izni', isSystemPermission: true },
  { id: 'perm15', name: 'messages.update', category: 'Message Templates', description: 'Mesaj şablonu güncelleme izni', isSystemPermission: true },
  { id: 'perm16', name: 'messages.delete', category: 'Message Templates', description: 'Mesaj şablonu silme izni', isSystemPermission: true },
  { id: 'perm17', name: 'roles.create', category: 'Role Management', description: 'Rol oluşturma izni', isSystemPermission: true },
  { id: 'perm18', name: 'roles.read', category: 'Role Management', description: 'Rol görüntüleme izni', isSystemPermission: true },
  { id: 'perm19', name: 'roles.update', category: 'Role Management', description: 'Rol güncelleme izni', isSystemPermission: true },
  { id: 'perm20', name: 'roles.delete', category: 'Role Management', description: 'Rol silme izni', isSystemPermission: true },
])

const roles = ref([
  {
    id: 'role1',
    name: 'Super Admin',
    description: 'Tüm sistem izinlerine sahip süper yönetici rolü',
    isActive: true,
    isSystemRole: true,
    userCount: 1,
    permissions: permissions.value.map(p => p.id)
  },
  {
    id: 'role2',
    name: 'Admin',
    description: 'Yönetici rolü - çoğu işlemi yapabilir',
    isActive: true,
    isSystemRole: false,
    userCount: 3,
    permissions: ['perm1', 'perm2', 'perm3', 'perm5', 'perm6', 'perm7', 'perm9', 'perm10', 'perm11', 'perm13', 'perm14', 'perm15', 'perm18']
  },
  {
    id: 'role3',
    name: 'Developer',
    description: 'Geliştirici rolü - proje ve scheduler yönetimi',
    isActive: true,
    isSystemRole: false,
    userCount: 5,
    permissions: ['perm2', 'perm6', 'perm7', 'perm9', 'perm10', 'perm11', 'perm13', 'perm14', 'perm15']
  },
  {
    id: 'role4',
    name: 'Viewer',
    description: 'Görüntüleyici rolü - sadece okuma izinleri',
    isActive: true,
    isSystemRole: false,
    userCount: 8,
    permissions: ['perm2', 'perm6', 'perm10', 'perm14', 'perm18']
  },
  {
    id: 'role5',
    name: 'Inactive Role',
    description: 'Pasif durumdaki örnek rol',
    isActive: false,
    isSystemRole: false,
    userCount: 0,
    permissions: []
  }
])

// Computed properties
const permissionCategories = computed(() => {
  const categories = [...new Set(permissions.value.map(p => p.category))]
  return categories.sort()
})

const filteredPermissions = computed(() => {
  let filtered = permissions.value

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  if (permissionFilter.value) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(permissionFilter.value.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(permissionFilter.value.toLowerCase()))
    )
  }

  return filtered
})

const permissionsTotalPages = computed(() => Math.ceil(filteredPermissions.value.length / permissionsPerPage))

const paginatedPermissions = computed(() => {
  const start = (permissionsCurrentPage.value - 1) * permissionsPerPage
  const end = start + permissionsPerPage
  return filteredPermissions.value.slice(start, end)
})

// Methods
const getCategoryClass = (category) => {
  const colors = {
    'User Management': 'bg-blue-500/20 text-blue-400',
    'Project Management': 'bg-green-500/20 text-green-400',
    'Scheduler': 'bg-purple-500/20 text-purple-400',
    'Message Templates': 'bg-yellow-500/20 text-yellow-400',
    'Role Management': 'bg-red-500/20 text-red-400'
  }
  return colors[category] || 'bg-gray-500/20 text-gray-400'
}

const getRoleCountForPermission = (permissionId) => {
  return roles.value.filter(role => role.permissions.includes(permissionId)).length
}

// Role Modal Methods
const openCreateRoleModal = () => {
  roleToEdit.value = null
  showRoleModal.value = true
}

const openEditRoleModal = (role) => {
  roleToEdit.value = role
  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  roleToEdit.value = null
}

const handleRoleCreated = (newRoleData) => {
  const newRole = {
    ...newRoleData,
    id: uuidv4(),
    userCount: 0,
    isSystemRole: false
  }
  roles.value.unshift(newRole)
  closeRoleModal()
}

const handleRoleUpdated = (updatedRoleData) => {
  const index = roles.value.findIndex(r => r.id === updatedRoleData.id)
  if (index !== -1) {
    roles.value[index] = { ...roles.value[index], ...updatedRoleData }
  }
  closeRoleModal()
}

// Permission Modal Methods
const openCreatePermissionModal = () => {
  permissionToEdit.value = null
  showPermissionModal.value = true
}

const openEditPermissionModal = (permission) => {
  permissionToEdit.value = permission
  showPermissionModal.value = true
}

const closePermissionModal = () => {
  showPermissionModal.value = false
  permissionToEdit.value = null
}

const handlePermissionCreated = (newPermissionData) => {
  const newPermission = {
    ...newPermissionData,
    id: uuidv4(),
    isSystemPermission: false
  }
  permissions.value.unshift(newPermission)
  closePermissionModal()
}

const handlePermissionUpdated = (updatedPermissionData) => {
  const index = permissions.value.findIndex(p => p.id === updatedPermissionData.id)
  if (index !== -1) {
    permissions.value[index] = { ...permissions.value[index], ...updatedPermissionData }
  }
  closePermissionModal()
}

// Role Permissions Modal Methods
const openRolePermissionsModal = (role) => {
  selectedRoleForPermissions.value = role
  showRolePermissionsModal.value = true
}

const closeRolePermissionsModal = () => {
  showRolePermissionsModal.value = false
  selectedRoleForPermissions.value = null
}

const handleRolePermissionsUpdated = (roleId, newPermissions) => {
  const roleIndex = roles.value.findIndex(r => r.id === roleId)
  if (roleIndex !== -1) {
    roles.value[roleIndex].permissions = newPermissions
  }
  closeRolePermissionsModal()
}

// Delete confirmation methods
const openDeleteRoleConfirmation = (role) => {
  confirmationConfig.value = {
    title: 'Rolü Sil',
    message: `'${role.name}' rolünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve role sahip kullanıcılar etkilenebilir.`,
    confirmText: 'Sil',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => deleteRole(role.id)
  }
  showConfirmationModal.value = true
}

const openDeletePermissionConfirmation = (permission) => {
  confirmationConfig.value = {
    title: 'İzni Sil',
    message: `'${permission.name}' iznini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu izne sahip roller etkilenecektir.`,
    confirmText: 'Sil',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => deletePermission(permission.id)
  }
  showConfirmationModal.value = true
}

const deleteRole = (roleId) => {
  roles.value = roles.value.filter(r => r.id !== roleId)
}

const deletePermission = (permissionId) => {
  permissions.value = permissions.value.filter(p => p.id !== permissionId)
  // Remove permission from all roles
  roles.value.forEach(role => {
    role.permissions = role.permissions.filter(p => p !== permissionId)
  })
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

const handleConfirmation = () => {
  if (confirmationConfig.value.onConfirm) {
    confirmationConfig.value.onConfirm()
  }
  closeConfirmationModal()
}
</script>
