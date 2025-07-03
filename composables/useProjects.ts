import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Bu composable, proje verilerini uygulama genelinde yönetmek için bir "state management" görevi görür.
// Gerçek bir uygulamada bu veriler API'den gelir ve güncellenir.

const getInitialProjects = () => [
  {
    id: 'proj1',
    name: 'Ana Proje',
    isDefaultProject: true,
    ownerId: 'user123',
    isActive: true,
    logo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    apiKeys: [
      { id: uuidv4(), name: 'Default API Key', value: 'some_secret_value_123', expireDate: '2025-12-31', isActive: true },
      { id: uuidv4(), name: 'Test Key', value: 'another_secret_value_456', expireDate: '2024-06-30', isActive: false }
    ],
    users: [
        { id: 'user-1', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet.yilmaz@example.com', role: 'Owner' }
    ],
    invitations: [
        { id: uuidv4(), email: 'davetli@example.com', roleName: 'Developer', status: 'Pending', expireDate: '2024-12-31' }
    ],
    jwtSettings: {
      issuer: 'https://yourdomain.com',
      secret: 'supersecretjwtkeythatisverylongandsecure',
      lifetimeMinutes: 60,
      refreshTokenExpiryDays: 7,
      audience: 'your_app_audience'
    },
    credits: 1500 // Yeni eklenen kredi bilgisi
  },
  {
    id: 'proj2',
    name: 'Test Projesi',
    isDefaultProject: false,
    ownerId: 'user123',
    isActive: false,
    logo: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    apiKeys: [],
    users: [],
    invitations: [],
    jwtSettings: {
      issuer: '',
      secret: '',
      lifetimeMinutes: 0,
      refreshTokenExpiryDays: 0,
      audience: ''
    },
    credits: 50 // Yeni eklenen kredi bilgisi
  }
];

const projects = ref(getInitialProjects());

export const useProjects = () => {

  const getProjectById = (id) => {
    return projects.value.find(p => p.id === id);
  }

  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: uuidv4(),
      ownerId: 'current_user_id', // Placeholder
      apiKeys: [],
      users: [],
      invitations: [],
      jwtSettings: projectData.jwtSettings || { issuer: '', secret: '', lifetimeMinutes: 0, refreshTokenExpiryDays: 0, audience: '' },
      credits: projectData.credits || 0 // Yeni projeye varsayılan kredi değeri
    };
    projects.value.unshift(newProject);
  }

  const updateProject = (updatedProjectData) => {
    const index = projects.value.findIndex(p => p.id === updatedProjectData.id);
    if (index !== -1) {
      // Orijinal state'i korumak için birleştime yapılıyor.
      projects.value[index] = { ...projects.value[index], ...updatedProjectData };
    }
  }
  
  const deleteApiKeyFromProject = (projectId, apiKeyId) => {
    const project = getProjectById(projectId);
    if (project) {
      project.apiKeys = project.apiKeys.filter(key => key.id !== apiKeyId);
    }
  }

  return {
    projects,
    getProjectById,
    addProject,
    updateProject,
    deleteApiKeyFromProject
  }
}
