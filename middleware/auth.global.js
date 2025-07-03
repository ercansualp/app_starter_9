export default defineNuxtRouteMiddleware((to) => {
  // Sadece client-side'da çalışsın
  if (process.server) return

  // Auth sayfalarında değilse ve onboarding sayfalarında değilse kontrol et
  if (!to.path.startsWith('/auth/') && !to.path.startsWith('/onboarding/')) {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const twoFactorPending = localStorage.getItem('twoFactorPending')
    
    // 2FA bekleniyorsa 2FA sayfasına yönlendir
    if (twoFactorPending === 'true') {
      const twoFactorProvider = localStorage.getItem('twoFactorProvider')
      if (twoFactorProvider) {
        return navigateTo('/auth/two-factor-verify')
      } else {
        return navigateTo('/auth/two-factor-provider')
      }
    }
    
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isAuthenticated || isAuthenticated !== 'true') {
      return navigateTo('/auth/login')
    }
  }
  
  // Auth sayfalarındaysa ve kullanıcı zaten giriş yapmışsa
  if (to.path.startsWith('/auth/')) {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const twoFactorPending = localStorage.getItem('twoFactorPending')
    
    // 2FA bekleniyorsa ve 2FA sayfalarında değilse
    if (twoFactorPending === 'true' && !to.path.includes('two-factor')) {
      const twoFactorProvider = localStorage.getItem('twoFactorProvider')
      if (twoFactorProvider) {
        return navigateTo('/auth/two-factor-verify')
      } else {
        return navigateTo('/auth/two-factor-provider')
      }
    }
    
    // 2FA tamamlanmışsa ve auth sayfalarındaysa
    if (isAuthenticated === 'true' && !twoFactorPending) {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      if (!onboardingCompleted) {
        return navigateTo('/onboarding/currency')
      } else {
        return navigateTo('/')
      }
    }
  }
})