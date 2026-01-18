export const API_BASE_URL = 'https://sweet-credit-392b.azizulhakim886.workers.dev'

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_CHECK: `${API_BASE_URL}/api/auth/check`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,

  // Skills
  SKILLS: `${API_BASE_URL}/api/skills`,
  SKILL_BY_ID: (id: string) => `${API_BASE_URL}/api/skills/${id}`,

  // Projects
  PROJECTS: `${API_BASE_URL}/api/projects`,
  PROJECT_BY_ID: (id: string) => `${API_BASE_URL}/api/projects/${id}`,

  // About
  ABOUT: `${API_BASE_URL}/api/about`,

  // Contact Info
  CONTACT_INFO: `${API_BASE_URL}/api/contact-info`,

  // Messages
  MESSAGES: `${API_BASE_URL}/api/messages`,
  MESSAGE_BY_ID: (id: string) => `${API_BASE_URL}/api/messages/${id}`,

  // Init Admin
  INIT_ADMIN: `${API_BASE_URL}/api/init-admin`
}
