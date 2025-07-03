<template>
  <div class="bg-background p-6 border-t border-border-color">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Headers -->
      <div>
        <h5 class="text-md font-semibold text-text-secondary mb-3 border-b border-border-color pb-2">Headers</h5>
        <div v-if="hasData(instance.headers)" class="bg-input-bg rounded-md p-3 text-sm space-y-2 font-mono max-h-48 overflow-y-auto border border-border-color">
          <div v-for="(value, key) in instance.headers" :key="key" class="flex items-start">
            <span class="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">{{ key }}:</span>
            <span class="text-text-primary break-all">{{ value }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-text-secondary italic mt-2">Header bilgisi yok.</p>
      </div>
      <!-- Query Params -->
      <div>
        <h5 class="text-md font-semibold text-text-secondary mb-3 border-b border-border-color pb-2">Query Params</h5>
        <div v-if="hasData(instance.queryParams)" class="bg-input-bg rounded-md p-3 text-sm space-y-2 font-mono max-h-48 overflow-y-auto border border-border-color">
          <div v-for="(value, key) in instance.queryParams" :key="key" class="flex items-start">
            <span class="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">{{ key }}:</span>
            <span class="text-text-primary break-all">{{ value }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-text-secondary italic mt-2">Query param bilgisi yok.</p>
      </div>
      <!-- Request Body -->
      <div>
        <h5 class="text-md font-semibold text-text-secondary mb-3 border-b border-border-color pb-2">Request Body</h5>
        <div v-if="hasData(instance.requestBody)" class="bg-input-bg rounded-md p-3 text-sm space-y-2 font-mono max-h-48 overflow-y-auto border border-border-color">
          <div v-for="(value, key) in instance.requestBody" :key="key" class="flex items-start">
            <span class="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">{{ key }}:</span>
            <span class="text-text-primary break-all">{{ value }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-text-secondary italic mt-2">Request body bilgisi yok.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  instance: {
    type: Object,
    required: true
  }
})

const hasData = (dict) => {
  return dict && Object.keys(dict).length > 0;
}
</script>
