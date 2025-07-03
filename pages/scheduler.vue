<template>
  <div>
    <h2 class="text-3xl font-bold text-text-primary mb-6">Scheduler Job Management</h2>

    <div class="space-y-8">
      <!-- Jobs List Card -->
      <div class="bg-card rounded-lg shadow-md border border-border-color overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.005]">
        <div class="p-6">
          <div class="flex justify-between items-center" :class="{'mb-4': isJobsOpen}">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-semibold text-text-primary">Jobs</h3>
              <button @click="isJobsOpen = !isJobsOpen" class="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300" :class="{'rotate-180': !isJobsOpen}"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            <button @click="openCreateModal" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Yeni Job Oluştur
            </button>
          </div>
          <div v-if="isJobsOpen" class="overflow-x-auto mt-4">
            <div class="mb-4 flex gap-4">
              <select
                v-model="selectedProject"
                class="px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              >
                <option v-for="proj in allProjects" :key="proj.id" :value="proj">
                  {{ proj.name }}
                </option>
              </select>
              <input
                type="text"
                v-model="jobsFilterUrl"
                placeholder="URL'ye göre filtrele..."
                class="flex-grow px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary placeholder-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <select
                v-model="jobsFilterStatus"
                class="px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
            <table class="w-full text-left">
              <thead class="border-b border-border-color">
                <tr>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">URL</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Method</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Durum</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Instances</th>
                  <th class="p-4 text-sm font-semibold text-text-secondary uppercase">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="job in paginatedJobs" 
                  :key="job.id" 
                  class="border-b border-border-color transition-colors hover:bg-hover-light dark:hover:bg-hover-dark"
                  :class="{'bg-selected-row-bg': selectedJob && job.id === selectedJob.id}"
                >
                  <td class="p-4 text-text-primary font-mono text-sm">{{ job.url }}</td>
                  <td class="p-4">
                    <span class="px-2 py-1 text-xs font-bold rounded" :class="getMethodClass(job.method)">
                      {{ job.method }}
                    </span>
                  </td>
                  <td class="p-4">
                    <StatusBadge :type="job.enable ? 'active' : 'inactive'" />
                  </td>
                  <td class="p-4 text-text-primary">{{ job.jobInstances.length }}</td>
                  <td class="p-4 flex items-center gap-4">
                    <button @click="selectJob(job)" class="text-primary hover:underline text-sm font-medium">
                      Detayları Görüntüle
                    </button>
                    <button @click="openEditModal(job)" class="text-yellow-600 dark:text-yellow-400 hover:underline text-sm font-medium">
                      Düzenle
                    </button>
                    <button 
                      v-if="job.jobInstances.some(instance => instance.enable)" 
                      @click.stop="promptStopAllInstances(job)" 
                      class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
                    >
                      Tüm Instance'ları Durdur
                    </button>
                    <button @click.stop="promptDeleteJob(job)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
                      Sil
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              v-model:currentPage="jobsCurrentPage"
              :total-pages="jobsTotalPages"
              class="mt-4"
            />
          </div>
        </div>
      </div>

      <!-- Job Instances Card -->
      <div class="bg-card rounded-lg shadow-md border border-border-color overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.005]">
        <div class="p-6">
          <div class="flex items-center gap-3" :class="{'mb-4': isInstancesOpen}">
            <h3 class="text-xl font-semibold text-text-primary">Job Instances</h3>
            <button @click="isInstancesOpen = !isInstancesOpen" class="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300" :class="{'rotate-180': !isInstancesOpen}"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
          <div v-if="isInstancesOpen" class="overflow-x-auto mt-4">
            <div v-if="selectedJob">
              <div class="mb-4 flex gap-4">
                <input
                  type="text"
                  v-model="instancesFilterKey"
                  placeholder="Job Key'e göre filtrele..."
                  class="flex-grow px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary placeholder-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
                <select
                  v-model="instancesFilterStatus"
                  class="px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              <div v-if="selectedJob.jobInstances.length > 0">
                <table class="w-full text-left">
                  <thead class="border-b border-border-color sticky top-0 bg-card">
                    <tr>
                      <th class="p-3 w-12"></th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Job Key</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Cron</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Durum</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Aksiyonlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="instance in paginatedInstances" :key="instance.id">
                      <tr 
                        @click="toggleInstanceDetails(instance)" 
                        class="border-b border-border-color cursor-pointer transition-colors hover:bg-hover-light dark:hover:bg-hover-dark"
                        :class="{'bg-selected-row-bg': selectedInstance && instance.id === selectedInstance.id}"
                      >
                        <td class="p-3 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 text-gray-500" :class="{'rotate-90': expandedInstanceId === instance.id}"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </td>
                        <td class="p-3 text-text-primary font-mono text-sm">{{ instance.jobKey }}</td>
                        <td class="p-3 text-text-primary font-mono text-sm">{{ instance.cronExpression }}</td>
                        <td class="p-3">
                          <StatusBadge :type="instance.enable ? 'active' : 'inactive'" />
                        </td>
                        <td class="p-3 flex items-center gap-3">
                          <button @click.stop="openEditInstanceModal(instance)" class="text-yellow-600 dark:text-yellow-400 hover:underline text-sm font-medium">
                            Düzenle
                          </button>
                          <button v-if="instance.enable" @click.stop="promptStopInstance(instance)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
                            Durdur
                          </button>
                          <button v-else @click.stop="promptStartInstance(instance)" class="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
                            Başlat
                          </button>
                          <button @click.stop="promptDeleteInstance(instance)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">
                            Sil
                          </button>
                        </td>
                      </tr>
                      <tr v-if="expandedInstanceId === instance.id" class="bg-background">
                        <td colspan="5" class="p-0">
                          <JobInstanceDetails :instance="instance" />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <Pagination
                  v-model:currentPage="instancesCurrentPage"
                  :total-pages="instancesTotalPages"
                  class="mt-4"
                />
              </div>
              <div v-else class="p-4 text-center text-text-secondary italic">
                Seçilen Job'a ait Job Instance bulunmamaktadır.
              </div>
            </div>
            <div v-else class="p-4 text-center text-text-secondary italic">
              Lütfen Job Instances'larını görüntülemek için yukarıdan bir Job seçin.
            </div>
          </div>
        </div>
      </div>

      <!-- Job Logs Card -->
      <div class="bg-card rounded-lg shadow-md border border-border-color overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.005]">
        <div class="p-6">
          <div class="flex items-center gap-3" :class="{'mb-4': isLogsOpen}">
            <h3 class="text-xl font-semibold text-text-primary">Job Logs</h3>
            <button @click="isLogsOpen = !isLogsOpen" class="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300" :class="{'rotate-180': !isLogsOpen}"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
          <div v-if="isLogsOpen" class="overflow-x-auto max-h-96 mt-4">
            <div v-if="selectedJob">
              <div class="mb-4 flex gap-4">
                <input
                  type="text"
                  v-model="logsFilterJobKey"
                  placeholder="Job Key'e göre filtrele..."
                  class="flex-grow px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary placeholder-text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
                <select
                  v-model="logsFilterStatus"
                  class="px-4 py-2 border border-border-color rounded-lg bg-input-bg text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="success">Başarılı</option>
                  <option value="failure">Başarısız</option>
                </select>
              </div>
              <div v-if="selectedJob.jobLogs.length > 0">
                <table class="w-full text-left">
                  <thead class="border-b border-border-color sticky top-0 bg-card">
                    <tr>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Job Key</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Başlangıç</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Bitiş</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Durum</th>
                      <th class="p-3 text-sm font-semibold text-text-secondary uppercase">Mesaj</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in paginatedLogs" :key="log.id" class="border-b border-border-color transition-colors hover:bg-hover-light dark:hover:bg-hover-dark">
                      <td class="p-3 text-text-primary font-mono text-sm">{{ log.jobKey }}</td>
                      <td class="p-3 text-text-primary text-sm">{{ new Date(log.startDate).toLocaleString() }}</td>
                      <td class="p-3 text-text-primary text-sm">{{ new Date(log.endDate).toLocaleString() }}</td>
                      <td class="p-3">
                        <StatusBadge :type="log.success ? 'success' : 'failure'" />
                      </td>
                      <td class="p-3 text-text-secondary text-xs font-mono truncate max-w-xs" :title="log.failureMessage">{{ log.failureMessage || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
                <Pagination
                  v-model:currentPage="logsCurrentPage"
                  :total-pages="logsTotalPages"
                  class="mt-4"
                />
              </div>
              <div v-else class="p-4 text-center text-text-secondary italic">
                Seçilen Job'a ait Job Log bulunmamaktadır.
              </div>
            </div>
            <div v-else class="p-4 text-center text-text-secondary italic">
              Lütfen Job Log'larını görüntülemek için yukarıdan bir Job seçin.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Job Modal -->
    <CreateJobModal 
      v-if="showJobModal" 
      :job-to-edit="jobToEdit"
      @close="closeJobModal"
      @create-job="handleJobCreated"
      @update-job="handleJobUpdated"
    />

    <!-- Edit Instance Modal -->
    <EditInstanceModal
      v-if="showEditInstanceModal"
      :instance-to-edit="instanceToEdit"
      @close="closeEditInstanceModal"
      @update-instance="handleInstanceUpdated"
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
import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import StatusBadge from '~/components/StatusBadge.vue'
import CreateJobModal from '~/components/CreateJobModal.vue'
import EditInstanceModal from '~/components/EditInstanceModal.vue'
import JobInstanceDetails from '~/components/JobInstanceDetails.vue'
import ConfirmationModal from '~/components/ConfirmationModal.vue'
import Pagination from '~/components/Pagination.vue'
import { useProjects } from '~/composables/useProjects' // useProjects'ı import et

const { projects: allProjects } = useProjects() // Tüm projeleri al

const showJobModal = ref(false)
const jobToEdit = ref(null)
const showEditInstanceModal = ref(false)
const instanceToEdit = ref(null)

const isJobsOpen = ref(true)
const isInstancesOpen = ref(true)
const isLogsOpen = ref(true)

const expandedInstanceId = ref(null)
const selectedInstance = ref(null)

const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  title: '',
  message: '',
  confirmText: '',
  confirmButtonClass: '',
  onConfirm: () => {}
})

// Proje seçimi state'i
const selectedProject = ref(allProjects.value[0] || null) // İlk projeyi varsayılan olarak seç

// Filter states
const jobsFilterUrl = ref('')
const jobsFilterStatus = ref('') // 'active', 'inactive', or '' for all

const instancesFilterKey = ref('')
const instancesFilterStatus = ref('') // 'active', 'inactive', or '' for all

const logsFilterJobKey = ref('') // Job Key filtrelemesi için yeni ref
const logsFilterStatus = ref('') // 'success', 'failure', or '' for all

// Pagination states
const jobsCurrentPage = ref(1)
const jobsPerPage = 3
const instancesCurrentPage = ref(1)
const instancesPerPage = 5
const logsCurrentPage = ref(1)
const logsPerPage = 5 

// Dummy Job verileri, şimdi projectId içeriyor
const allJobsData = ref([
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    projectId: 'proj1', // Ana Proje
    method: 'POST',
    url: 'https://api.example.com/v1/webhooks/orders',
    enable: true,
    jobInstances: [
      { id: 'i1', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 0 * * *', jobKey: 'daily-order-sync', enable: true, headers: {'X-API-Version': '2', 'Content-Type': 'application/json'}, queryParams: {'source': 'cron'}, requestBody: {'type': 'full_sync', 'since_id': '12345'} },
      { id: 'i2', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 12 * * *', jobKey: 'daily-order-sync-noon', enable: false, headers: {}, queryParams: {}, requestBody: {} },
      { id: 'i5', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 1 * * *', jobKey: 'hourly-sync', enable: true, headers: {}, queryParams: {}, requestBody: {} },
      { id: 'i6', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 2 * * *', jobKey: 'hourly-sync-2', enable: true, headers: {}, queryParams: {}, requestBody: {} },
      { id: 'i7', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 3 * * *', jobKey: 'hourly-sync-3', enable: false, headers: {}, queryParams: {}, requestBody: {} },
      { id: 'i8', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', cronExpression: '0 4 * * *', jobKey: 'hourly-sync-4', enable: true, headers: {}, queryParams: {}, requestBody: {} },
    ],
    jobLogs: [
      { id: 'l1', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-27T00:00:00Z', endDate: '2023-10-27T00:01:15Z', success: true, failureMessage: null },
      { id: 'l2', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-26T00:00:00Z', endDate: '2023-10-26T00:01:20Z', success: true, failureMessage: null },
      { id: 'l3', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-25T00:00:00Z', endDate: '2023-10-25T00:00:05Z', success: false, failureMessage: 'API endpoint returned 503 Service Unavailable' },
      { id: 'l6', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-24T00:00:00Z', endDate: '2023-10-24T00:01:10Z', success: true, failureMessage: null },
      { id: 'l7', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-23T00:00:00Z', endDate: '2023-10-23T00:01:05Z', success: true, failureMessage: null },
      { id: 'l8', jobId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', jobKey: 'daily-order-sync', startDate: '2023-10-22T00:00:00Z', endDate: '2023-10-22T00:00:55Z', success: false, failureMessage: 'Network timeout' },
    ]
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    projectId: 'proj1', // Ana Proje
    method: 'GET',
    url: 'https://api.example.com/v1/health-check',
    enable: true,
    jobInstances: [
      { id: 'i3', jobId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', cronExpression: '*/5 * * * *', jobKey: 'health-check-ping', enable: true, headers: {}, queryParams: { 'source': 'scheduler', 'verbose': 'true' }, requestBody: {} },
      { id: 'i9', jobId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', cronExpression: '*/10 * * * *', jobKey: 'health-check-ping-2', enable: true, headers: {}, queryParams: {}, requestBody: {} },
    ],
    jobLogs: [
       { id: 'l4', jobId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', jobKey: 'health-check-ping', startDate: '2023-10-27T10:05:00Z', endDate: '2023-10-27T10:05:01Z', success: true, failureMessage: null },
       { id: 'l5', jobId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', jobKey: 'health-check-ping', startDate: '2023-10-27T10:00:00Z', endDate: '2023-10-27T10:00:01Z', success: true, failureMessage: null },
       { id: 'l9', jobId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', jobKey: 'health-check-ping', startDate: '2023-10-27T09:55:00Z', endDate: '2023-10-27T09:55:01Z', success: true, failureMessage: null },
    ]
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    projectId: 'proj2', // Test Projesi
    method: 'PUT',
    url: 'https://api.example.com/v1/inventory/reconcile',
    enable: false,
    jobInstances: [
       { id: 'i4', jobId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', cronExpression: '0 3 * * 1', jobKey: 'weekly-inventory-reconciliation', enable: false, headers: {}, queryParams: {}, requestBody: {} },
    ],
    jobLogs: []
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    projectId: 'proj1', // Ana Proje
    method: 'DELETE',
    url: 'https://api.example.com/v1/old-data/cleanup',
    enable: true,
    jobInstances: [
      { id: 'i10', jobId: 'd4e5f6a7-b8c9-0123-4567-890abcdef123', cronExpression: '0 0 1 * *', jobKey: 'monthly-cleanup', enable: true, headers: {}, queryParams: {}, requestBody: {} },
    ],
    jobLogs: [
      { id: 'l10', jobId: 'd4e5f6a7-b8c9-0123-4567-890abcdef123', jobKey: 'monthly-cleanup', startDate: '2023-10-01T00:00:00Z', endDate: '2023-10-01T00:02:30Z', success: true, failureMessage: null },
    ]
  },
  {
    id: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
    projectId: 'proj2', // Test Projesi
    method: 'PATCH',
    url: 'https://api.example.com/v1/user-profiles/update',
    enable: false,
    jobInstances: [
      { id: 'i11', jobId: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', cronExpression: '0 0 * * 0', jobKey: 'weekly-profile-update', enable: false, headers: {}, queryParams: {}, requestBody: {} },
    ],
    jobLogs: []
  }
])

const selectedJob = ref(null) // Başlangıçta hiçbir job seçili değil

// Filtered Jobs
const filteredJobs = computed(() => {
  if (!selectedProject.value) return [];
  let filtered = allJobsData.value.filter(job => job.projectId === selectedProject.value.id);

  if (jobsFilterUrl.value) {
    filtered = filtered.filter(job =>
      job.url.toLowerCase().includes(jobsFilterUrl.value.toLowerCase())
    );
  }
  if (jobsFilterStatus.value) {
    const status = jobsFilterStatus.value === 'active';
    filtered = filtered.filter(job => job.enable === status);
  }
  return filtered;
});

// Computed properties for Jobs pagination
const jobsTotalPages = computed(() => Math.ceil(filteredJobs.value.length / jobsPerPage))
const paginatedJobs = computed(() => {
  const start = (jobsCurrentPage.value - 1) * jobsPerPage
  const end = start + jobsPerPage
  return filteredJobs.value.slice(start, end)
})

// Filtered Instances
const filteredInstances = computed(() => {
  if (!selectedJob.value) return [];
  let filtered = selectedJob.value.jobInstances;
  if (instancesFilterKey.value) {
    filtered = filtered.filter(instance =>
      instance.jobKey.toLowerCase().includes(instancesFilterKey.value.toLowerCase())
    );
  }
  if (instancesFilterStatus.value) {
    const status = instancesFilterStatus.value === 'active';
    filtered = filtered.filter(instance => instance.enable === status);
  }
  return filtered;
});

// Computed properties for Job Instances pagination
const instancesTotalPages = computed(() => 
  selectedJob.value ? Math.ceil(filteredInstances.value.length / instancesPerPage) : 0
)
const paginatedInstances = computed(() => {
  if (!selectedJob.value) return []
  const start = (instancesCurrentPage.value - 1) * instancesPerPage
  const end = start + instancesPerPage
  return filteredInstances.value.slice(start, end)
})

// Filtered Logs
const filteredLogs = computed(() => {
  if (!selectedJob.value) return [];
  let filtered = selectedJob.value.jobLogs;
  if (logsFilterJobKey.value) { // Job Key'e göre filtreleme
    filtered = filtered.filter(log =>
      log.jobKey && log.jobKey.toLowerCase().includes(logsFilterJobKey.value.toLowerCase())
    );
  }
  if (logsFilterStatus.value) {
    const status = logsFilterStatus.value === 'success';
    filtered = filtered.filter(log => log.success === status);
  }
  return filtered;
});

// Computed properties for Job Logs pagination
const logsTotalPages = computed(() => 
  selectedJob.value ? Math.ceil(filteredLogs.value.length / logsPerPage) : 0
)
const paginatedLogs = computed(() => {
  if (!selectedJob.value) return []
  const start = (logsCurrentPage.value - 1) * logsPerPage
  const end = start + logsPerPage
  return filteredLogs.value.slice(start, end)
})


const selectJob = (job) => {
  selectedJob.value = job
  isInstancesOpen.value = true
  isLogsOpen.value = true
  expandedInstanceId.value = null
  selectedInstance.value = null; // Job değiştiğinde seçili instance'ı sıfırla
  // Reset pagination and filters for instances and logs when a new job is selected
  instancesCurrentPage.value = 1
  logsCurrentPage.value = 1
  instancesFilterKey.value = ''
  instancesFilterStatus.value = ''
  logsFilterJobKey.value = '' // Job Key filtresini sıfırla
  logsFilterStatus.value = ''
}

const toggleInstanceDetails = (instance) => { // Parametre olarak instance objesini al
  if (expandedInstanceId.value === instance.id) {
    expandedInstanceId.value = null
    selectedInstance.value = null // Kapatıldığında seçimi kaldır
  } else {
    expandedInstanceId.value = instance.id
    selectedInstance.value = instance // Seçili instance'ı ayarla
  }
}

const getMethodClass = (method) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
    case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
  }
}

const openCreateModal = () => {
  jobToEdit.value = null
  showJobModal.value = true
}

const openEditModal = (job) => {
  jobToEdit.value = job
  showJobModal.value = true
}

const closeJobModal = () => {
  showJobModal.value = false
  jobToEdit.value = null
}

const handleJobCreated = (newJobData) => {
  const newJobId = uuidv4();
  const newJob = {
    ...newJobData,
    id: newJobId,
    projectId: selectedProject.value ? selectedProject.value.id : null, // Seçili projeye ata
    jobInstances: newJobData.jobInstances.map(instance => ({
      ...instance,
      id: uuidv4(),
      jobId: newJobId,
    })),
    jobLogs: [],
  };
  allJobsData.value.unshift(newJob); // allJobsData'ya ekle
  closeJobModal();
  // Reset jobs pagination to first page to see the new job
  jobsCurrentPage.value = 1;
};

const handleJobUpdated = (updatedJobData) => {
  const jobIndex = allJobsData.value.findIndex(j => j.id === updatedJobData.id) // allJobsData'da bul
  if (jobIndex !== -1) {
    const existingLogs = allJobsData.value[jobIndex].jobLogs;
    allJobsData.value[jobIndex] = { ...updatedJobData, jobLogs: existingLogs };
    
    if (selectedJob.value && selectedJob.value.id === updatedJobData.id) {
      selectedJob.value = allJobsData.value[jobIndex];
    }
  }
  closeJobModal();
}

const openEditInstanceModal = (instance) => {
  instanceToEdit.value = instance
  showEditInstanceModal.value = true
}

const closeEditInstanceModal = () => {
  showEditInstanceModal.value = false
  instanceToEdit.value = null
}

const handleInstanceUpdated = (updatedInstance) => {
  if (!selectedJob.value) return;
  const job = allJobsData.value.find(j => j.id === selectedJob.value.id); // allJobsData'da bul
  if (job) {
    const instanceIndex = job.jobInstances.findIndex(i => i.id === updatedInstance.id);
    if (instanceIndex !== -1) {
      job.jobInstances[instanceIndex] = { ...job.jobInstances[instanceIndex], ...updatedInstance };
    }
  }
  closeEditInstanceModal();
}

const toggleInstanceStatus = (instance, newStatus) => {
  if (!selectedJob.value) return;
  const job = allJobsData.value.find(j => j.id === selectedJob.value.id); // allJobsData'da bul
  if (job) {
    const instanceToUpdate = job.jobInstances.find(i => i.id === instance.id);
    if (instanceToUpdate) {
      instanceToUpdate.enable = newStatus;
    }
  }
};

const promptStartInstance = (instance) => {
  confirmationConfig.value = {
    title: 'Job Instance Başlat',
    message: `'${instance.jobKey}' anahtarlı job instance'ı başlatmak istediğinizden emin misiniz?`,
    confirmText: 'Başlat',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700',
    onConfirm: () => toggleInstanceStatus(instance, true)
  };
  showConfirmationModal.value = true;
};

const promptStopInstance = (instance) => {
  confirmationConfig.value = {
    title: 'Job Instance Durdur',
    message: `'${instance.jobKey}' anahtarlı job instance'ı durdurmak istediğinizden emin misiniz?`,
    confirmText: 'Durdur',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => toggleInstanceStatus(instance, false)
  };
  showConfirmationModal.value = true;
};

const promptStopAllInstances = (job) => {
  confirmationConfig.value = {
    title: 'Tüm Instance\'ları Durdur',
    message: `'${job.url}' adresine sahip job'ın tüm aktif instance'larını durdurmak istediğinizden emin misiniz?`,
    confirmText: 'Tümünü Durdur',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => stopAllInstances(job)
  };
  showConfirmationModal.value = true;
};

const stopAllInstances = (job) => {
  const targetJob = allJobsData.value.find(j => j.id === job.id); // allJobsData'da bul
  if (targetJob) {
    targetJob.jobInstances.forEach(instance => {
      instance.enable = false;
    });
  }
};

const promptDeleteJob = (job) => {
  confirmationConfig.value = {
    title: 'Job Sil',
    message: `'${job.url}' adresine sahip job'ı ve tüm ilişkili instance'larını ve loglarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
    confirmText: 'Sil',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => deleteJob(job.id)
  };
  showConfirmationModal.value = true;
};

const deleteJob = (jobId) => {
  allJobsData.value = allJobsData.value.filter(j => j.id !== jobId); // allJobsData'dan sil
  if (selectedJob.value && selectedJob.value.id === jobId) {
    selectedJob.value = null; // Silinen job seçiliyse seçimi kaldır
  }
};

const promptDeleteInstance = (instance) => {
  confirmationConfig.value = {
    title: 'Job Instance Sil',
    message: `'${instance.jobKey}' anahtarlı job instance'ı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
    confirmText: 'Sil',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: () => deleteInstance(instance.jobId, instance.id)
  };
  showConfirmationModal.value = true;
};

const deleteInstance = (jobId, instanceId) => {
  const job = allJobsData.value.find(j => j.id === jobId); // allJobsData'da bul
  if (job) {
    job.jobInstances = job.jobInstances.filter(i => i.id !== instanceId);
    if (selectedInstance.value && selectedInstance.value.id === instanceId) {
      selectedInstance.value = null; // Silinen instance seçiliyse seçimi kaldır
      expandedInstanceId.value = null; // Detayları kapat
    }
  }
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
};

const handleConfirmation = () => {
  if (confirmationConfig.value.onConfirm) {
    confirmationConfig.value.onConfirm();
  }
  closeConfirmationModal();
};

// Watchers to reset pagination when filters change
watch([jobsFilterUrl, jobsFilterStatus], () => {
  jobsCurrentPage.value = 1;
});

watch([instancesFilterKey, instancesFilterStatus], () => {
  instancesCurrentPage.value = 1;
});

watch([logsFilterJobKey, logsFilterStatus], () => { // logsFilterMessage yerine logsFilterJobKey kullanıldı
  logsCurrentPage.value = 1;
});

// Watcher for selectedProject to reset job selection and filters
watch(selectedProject, (newProject, oldProject) => {
  if (newProject && newProject.id !== (oldProject ? oldProject.id : null)) {
    selectedJob.value = null; // Proje değiştiğinde seçili job'ı sıfırla
    jobsCurrentPage.value = 1;
    jobsFilterUrl.value = '';
    jobsFilterStatus.value = '';
    instancesCurrentPage.value = 1;
    instancesFilterKey.value = '';
    instancesFilterStatus.value = '';
    logsCurrentPage.value = 1;
    logsFilterJobKey.value = ''; // Job Key filtresini sıfırla
    logsFilterStatus.value = '';
  }
});
</script>
