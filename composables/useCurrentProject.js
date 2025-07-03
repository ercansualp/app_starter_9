export const useCurrentProject = () => {
  const { projects } = useProjects()
  const currentProject = ref(null)

  const setCurrentProject = (project) => {
    currentProject.value = project
    if (process.client) {
      localStorage.setItem('selectedProjectId', project.id)
    }
  }

  const getCurrentProject = () => {
    if (process.client) {
      const savedProjectId = localStorage.getItem('selectedProjectId')
      if (savedProjectId) {
        const project = projects.value.find(p => p.id === savedProjectId)
        if (project) {
          currentProject.value = project
          return project
        }
      }
      
      // Varsayılan projeyi bul
      const defaultProject = projects.value.find(p => p.isDefaultProject)
      if (defaultProject) {
        currentProject.value = defaultProject
        localStorage.setItem('selectedProjectId', defaultProject.id)
        return defaultProject
      }
    }
    return null
  }

  const refreshCurrentProject = () => {
    if (currentProject.value) {
      const updatedProject = projects.value.find(p => p.id === currentProject.value.id)
      if (updatedProject) {
        currentProject.value = updatedProject
      }
    }
  }

  return {
    currentProject: readonly(currentProject),
    setCurrentProject,
    getCurrentProject,
    refreshCurrentProject
  }
}
