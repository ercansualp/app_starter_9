<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-md m-4">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
          </div>
          <div class="mt-0 text-left">
            <h3 class="text-lg font-semibold leading-6 text-text-primary" id="modal-title">{{ title }}</h3>
            <div class="mt-2">
              <p class="text-sm text-text-secondary">{{ message }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-background px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
        <button 
          type="button" 
          @click="$emit('confirm')" 
          :class="confirmButtonClass"
          class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
        >
          {{ confirmText }}
        </button>
        <button 
          type="button" 
          @click="$emit('close')" 
          class="mt-3 inline-flex w-full justify-center rounded-md bg-card px-4 py-2 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-border-color hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto"
        >
          İptal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: String,
  confirmButtonClass: String
})
defineEmits(['close', 'confirm'])
</script>
