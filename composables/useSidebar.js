import { useState } from '#app'

export const useSidebar = () => {
  // Büyük ekranlarda varsayılan olarak açık, küçük ekranlarda kapalı
  const getInitialState = () => {
    if (process.client) {
      return window.innerWidth >= 1024
    }
    return true // SSR için varsayılan değer
  }

  const isSidebarOpen = useState('isSidebarOpen', getInitialState)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  }
}