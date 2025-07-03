<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" @click.self="$emit('close')">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-border-color flex justify-between items-center">
        <h3 class="text-2xl font-semibold text-text-primary">{{ formTitle }}</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form @submit.prevent="handleFormSubmit" class="flex-grow overflow-y-auto">
        <div class="p-6 space-y-6">
          <!-- Template Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Ad <span class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" id="name" placeholder="Şablon Adı" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
            </div>
            <div>
              <label for="channel" class="block text-sm font-medium text-text-secondary mb-1">Kanal <span class="text-red-500">*</span></label>
              <select v-model="formData.channel" id="channel" required class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                <option v-for="channel in messageChannels" :key="channel" :value="channel">{{ channel }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label for="subject" class="block text-sm font-medium text-text-secondary mb-1">Konu (Sadece Email için)</label>
              <input v-model="formData.subject" type="text" id="subject" placeholder="Email Konusu" :disabled="formData.channel !== 'Email'" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed">
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Açıklama</label>
              <textarea v-model="formData.description" id="description" rows="3" placeholder="Şablonun kısa açıklaması" class="w-full bg-input-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"></textarea>
            </div>
          </div>

          <!-- Body - Rich Text Editor -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-text-secondary mb-1">Body <span class="text-red-500">*</span></label>
            <ClientOnly>
              <div class="bg-input-bg text-text-primary rounded-md border border-border-color">
                <div v-if="editor" class="flex flex-wrap p-2 border-b border-border-color">
                  <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v16h6a6 6 0 0 0 6-6v-2Z"></path><line x1="6" y1="12" x2="13" y2="12"></line></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4H2v4h5.17a3 3 0 0 0 5.66 0H22v-4h-4.83A3 3 0 0 0 16 4ZM2 16h20v4H2Z"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15v-3c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v3"></path><path d="M18 15v-3c0-1.1-.9-2-2-2h-2"></path><path d="M6 15v-1c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v1"></path><path d="M18 15v-1c0-1.1-.9-2-2-2h-2"></path><path d="M6 19v-1c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v1"></path><path d="M18 19v-1c0-1.1-.9-2-2-2h-2"></path><path d="M6 23v-1c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v1"></path><path d="M18 23v-1c0-1.1-.9-2-2-2h-2"></path><path d="M6 11V7c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4"></path><path d="M18 11V7c0-1.1-.9-2-2-2h-2"></path><path d="M6 3v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V3"></path><path d="M18 3v1c0 1.1-.9 2-2 2h-2"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M17 10h3v8h-3"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M17 10h3v8h-3"></path>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M17 10h3v8h-3"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 4-4 4-4-4"></path><path d="m4 12-4 4-4-4"></path><path d="m14.5 4-5 16"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6H3"></path><path d="M21 18H7"></path><path d="M7 21V3"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().setHardBreak().run()" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6"></path><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 12H20c2.2 0 3 1.5 3 3s-.8 3-3 3H9.5"></path><path d="M12 15 9.5 12 12 9"></path></svg>
                  </button>
                  <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="p-2 hover:bg-gray-100 rounded-md text-text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 12H4c-2.2 0-3 1.5-3 3s.8 3 3 3h10.5"></path><path d="M12 15 14.5 12 12 9"></path></svg>
                  </button>
                </div>
                <EditorContent :editor="editor" class="min-h-[200px] p-4 prose prose-invert max-w-none focus:outline-none" />
              </div>
            </ClientOnly>
          </div>
        </div>
        <div class="p-6 bg-card border-t border-border-color flex justify-end gap-4 sticky bottom-0">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-md text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors font-semibold">
            İptal
          </button>
          <button type="submit" class="px-4 py-2 rounded-md text-white bg-primary hover:bg-blue-500 transition-colors font-semibold">
            {{ submitButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <ClientOnly>
    <ConfirmationModal
      :show="showConfirmationModal"
      title="Değişiklikleri Kaydet?"
      message="Mesaj şablonunda yaptığınız değişiklikleri kaydetmek istediğinizden emin misiniz?"
      confirm-text="Kaydet"
      confirm-button-class="bg-primary hover:bg-blue-500"
      @close="showConfirmationModal = false"
      @confirm="submitForm"
    />
  </ClientOnly>
</template>

<script setup>
import { ref, watch, watchEffect, computed, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ConfirmationModal from '~/components/ConfirmationModal.vue'

const props = defineProps({
  templateToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'create-template', 'update-template'])

const isEditing = computed(() => !!props.templateToEdit)
const formTitle = computed(() => isEditing.value ? 'Şablonu Düzenle' : 'Yeni Mesaj Şablonu Oluştur')
const submitButtonText = computed(() => isEditing.value ? 'Değişiklikleri Kaydet' : 'Şablon Oluştur')

// C# MessageChannelEnum değerleri
const messageChannels = ['Email', 'SMS', 'PushNotification', 'InApp', 'Webhook']

const formData = ref({
  name: '',
  description: '',
  body: '',
  channel: messageChannels[0], // Default to Email
  subject: ''
})

const editor = useEditor({
  content: formData.value.body,
  extensions: [
    StarterKit,
  ],
  onUpdate: ({ editor }) => {
    formData.value.body = editor.getHTML()
  },
  editorProps: {
    attributes: {
      class: 'prose prose-invert max-w-none focus:outline-none',
    },
  },
})

watchEffect(() => {
  if (props.templateToEdit && editor.value) {
    // Update properties individually to maintain reactivity of the original formData object
    // This block only runs when templateToEdit is provided (editing mode)
    formData.value.name = props.templateToEdit.name || '';
    formData.value.description = props.templateToEdit.description || '';
    formData.value.body = props.templateToEdit.body || '';
    formData.value.channel = props.templateToEdit.channel || messageChannels[0];
    formData.value.subject = props.templateToEdit.subject || '';

    // Only set content if it's different to avoid infinite loops or unnecessary updates
    if (editor.value.getHTML() !== formData.value.body) {
      editor.value.commands.setContent(formData.value.body, false);
    }
  }
  // No 'else' block needed. When templateToEdit is null,
  // the component's initial formData ref will be used,
  // and the key prop in the parent will ensure re-mount for new instances.
})

// Watch for changes in formData.body and update the editor content
watch(() => formData.value.body, (newVal) => {
  if (editor.value && editor.value.getHTML() !== newVal) {
    editor.value.commands.setContent(newVal, false)
  }
}, { immediate: true })


onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

const showConfirmationModal = ref(false)

const handleFormSubmit = () => {
  if (!formData.value.name || !formData.value.body || !formData.value.channel) {
    alert('Lütfen gerekli tüm alanları (Ad, Body, Kanal) doldurun.');
    return;
  }

  if (isEditing.value) {
    showConfirmationModal.value = true; // Show confirmation for edits
  } else {
    submitForm(); // Directly submit for new creations
  }
}

const submitForm = () => {
  const payload = {
    name: formData.value.name,
    description: formData.value.description || null,
    body: formData.value.body,
    channel: formData.value.channel,
    subject: formData.value.channel === 'Email' ? (formData.value.subject || null) : null
  }
  
  if (isEditing.value) {
    payload.id = props.templateToEdit.id // Use id from props.templateToEdit for update
    emit('update-template', payload)
  } else {
    emit('create-template', payload)
  }
  showConfirmationModal.value = false; // Close confirmation modal after submission
}
</script>

<style>
/* Tiptap Editor için temel stil ayarlamaları */
/* Bu stiller Tailwind CSS ile birleştirilebilir veya özelleştirilebilir */
.ProseMirror {
  min-height: 200px;
  padding: 1rem;
  color: var(--color-text-primary);
  outline: none; /* Remove default focus outline */
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-text-secondary);
  pointer-events: none;
  height: 0;
}

/* Tiptap toolbar butonları için aktif durum */
.is-active {
  background-color: var(--color-primary);
  color: white;
}

/* Tiptap'ın varsayılan stillerini Tailwind ile ezmek için */
.prose :where(h1):not(:where([class~="not-prose"] *)) {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700; /* font-bold */
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose :where(h2):not(:where([class~="not-prose"] *)) {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose :where(h3):not(:where([class~="not-prose"] *)) {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose :where(h4):not(:where([class~="not-prose"] *)) {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose :where(strong):not(:where([class~="not-prose"] *)) {
  font-weight: 700; /* font-bold */
}

.prose :where(a):not(:where([class~="not-prose"] *)) {
  color: var(--color-primary);
  text-decoration: underline;
}

.prose :where(ul):not(:where([class~="not-prose"] *)) {
  list-style-type: disc;
  padding-left: 1.5em;
}

.prose :where(ol):not(:where([class~="not-prose"] *)) {
  list-style-type: decimal;
  padding-left: 1.5em;
}

.prose :where(li):not(:where([class~="not-prose"] *)) {
  margin-bottom: 0.5em;
}

.prose :where(blockquote):not(:where([class~="not-prose"] *)) {
  border-left: 4px solid var(--color-border-color);
  padding-left: 1em;
  color: var(--color-text-secondary);
  font-style: italic;
}

.prose :where(code):not(:where([class~="not-prose"] *)) {
  background-color: var(--color-background);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: var(--color-text-primary);
}

.prose :where(pre):not(:where([class~="not-prose"] *)) {
  background-color: var(--color-background);
  padding: 1em;
  border-radius: 0.375rem;
  overflow-x: auto;
  color: var(--color-text-primary);
}

.prose :where(hr):not(:where([class~="not-prose"] *)) {
  border-top: 1px solid var(--color-border-color);
  margin: 2em 0;
}
</style>
