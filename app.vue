<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Renk modunun sunucu tarafında doğru şekilde başlatılmasını sağlar
// ve istemci tarafında hidrasyon hatalarını önler.
useColorMode()
</script>
