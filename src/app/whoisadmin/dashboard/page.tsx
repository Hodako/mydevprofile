'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit, X, LogOut, MessageSquare, Briefcase, Palette, Settings, Mail } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'

interface Skill {
  id: string
  name: string
  description: string
  iconUrl: string
  type: string
  color: string
  category: string
  order: number
}

interface Project {
  id: string
  title: string
  description: string
  gradient: string
  projectUrl: string | null
  technologies: string
  featured: boolean
  order: number
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

type TabType = 'skills' | 'projects' | 'about' | 'contact' | 'messages'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('skills')
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [aboutInfo, setAboutInfo] = useState<Record<string, string>>({})
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Modal states
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Form states
  const [skillForm, setSkillForm] = useState({ name: '', description: '', iconUrl: '', type: 'image', color: '', category: 'Backend' })
  const [projectForm, setProjectForm] = useState({ title: '', description: '', gradient: '', projectUrl: '', technologies: '', featured: true })

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_CHECK, {
        credentials: 'include'
      })
      const data = await response.json()
      if (!data.authenticated) {
        router.push('/whoisadmin/login')
      }
    } catch (error) {
      router.push('/whoisadmin/login')
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [skillsRes, projectsRes, aboutRes, contactRes, messagesRes] = await Promise.all([
        fetch(API_ENDPOINTS.SKILLS, { credentials: 'include' }),
        fetch(API_ENDPOINTS.PROJECTS, { credentials: 'include' }),
        fetch(API_ENDPOINTS.ABOUT, { credentials: 'include' }),
        fetch(API_ENDPOINTS.CONTACT_INFO, { credentials: 'include' }),
        fetch(API_ENDPOINTS.MESSAGES, { credentials: 'include' })
      ])

      const skillsData = await skillsRes.json()
      const projectsData = await projectsRes.json()
      const aboutData = await aboutRes.json()
      const contactData = await contactRes.json()
      const messagesData = await messagesRes.json()

      setSkills(skillsData.skills || [])
      setProjects(projectsData.projects || [])
      setAboutInfo(aboutData.aboutInfo || {})
      setContactInfo(contactData.contactInfo || {})
      setMessages(messagesData.messages || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch(API_ENDPOINTS.AUTH_LOGOUT, { 
      method: 'POST',
      credentials: 'include'
    })
    router.push('/whoisadmin/login')
  }

  const handleSaveSkill = async () => {
    const url = editingSkill ? API_ENDPOINTS.SKILL_BY_ID(editingSkill.id) : API_ENDPOINTS.SKILLS
    const method = editingSkill ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(skillForm)
      })

      if (response.ok) {
        setShowSkillModal(false)
        setEditingSkill(null)
        setSkillForm({ name: '', description: '', iconUrl: '', type: 'image', color: '', category: 'Backend' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(API_ENDPOINTS.SKILL_BY_ID(id), { 
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setSkillForm({
      name: skill.name,
      description: skill.description,
      iconUrl: skill.iconUrl,
      type: skill.type,
      color: skill.color,
      category: skill.category
    })
    setShowSkillModal(true)
  }

  const handleSaveProject = async () => {
    const url = editingProject ? API_ENDPOINTS.PROJECT_BY_ID(editingProject.id) : API_ENDPOINTS.PROJECTS
    const method = editingProject ? 'PUT' : 'POST'

    try {
      const technologiesArray = projectForm.technologies.split(',').map(t => t.trim()).filter(t => t)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...projectForm,
          technologies: technologiesArray
        })
      })

      if (response.ok) {
        setShowProjectModal(false)
        setEditingProject(null)
        setProjectForm({ title: '', description: '', gradient: '', projectUrl: '', technologies: '', featured: true })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(API_ENDPOINTS.PROJECT_BY_ID(id), { 
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      gradient: project.gradient,
      projectUrl: project.projectUrl || '',
      technologies: JSON.parse(project.technologies).join(', '),
      featured: project.featured
    })
    setShowProjectModal(true)
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGE_BY_ID(id), { 
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleSaveAbout = async (key: string, value: string) => {
    try {
      await fetch(API_ENDPOINTS.ABOUT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value })
      })
    } catch (error) {
      console.error('Failed to save about info:', error)
    }
  }

  const handleSaveContact = async (key: string, value: string) => {
    try {
      await fetch(API_ENDPOINTS.CONTACT_INFO, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value })
      })
    } catch (error) {
      console.error('Failed to save contact info:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen dark flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'skills' as TabType, label: 'Skills', icon: Palette },
    { id: 'projects' as TabType, label: 'Projects', icon: Briefcase },
    { id: 'about' as TabType, label: 'About Info', icon: Settings },
    { id: 'contact' as TabType, label: 'Contact Info', icon: Mail },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen dark bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground font-serif">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors font-sans"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <main className="pt-32 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground font-serif">Skills Management</h2>
                <button
                  onClick={() => { setEditingSkill(null); setSkillForm({ name: '', description: '', iconUrl: '', type: 'image', color: '', category: 'Backend' }); setShowSkillModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(skill => (
                  <motion.div
                    key={skill.id}
                    className="bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSkill(skill)} className="text-muted-foreground hover:text-foreground">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground font-sans">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground font-sans mt-1">{skill.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-muted rounded-lg text-xs font-mono">{skill.category}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground font-serif">Projects Management</h2>
                <button
                  onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', gradient: '', projectUrl: '', technologies: '', featured: true }); setShowProjectModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(project => (
                  <motion.div
                    key={project.id}
                    className="bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-mono ${project.featured ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                        {project.featured ? 'Featured' : 'Draft'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProject(project)} className="text-muted-foreground hover:text-foreground">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)} className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground font-sans">{project.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans mt-1">{project.description}</p>
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 block font-sans">
                        Project URL →
                      </a>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {JSON.parse(project.technologies).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded-lg text-xs font-mono">{tech}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground font-serif">About Information</h2>
              <div className="space-y-4">
                {Object.entries(aboutInfo).map(([key, value]) => (
                  <div key={key} className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4">
                    <label className="block text-sm font-medium text-foreground mb-2 font-sans capitalize">{key}</label>
                    <textarea
                      value={value}
                      onChange={(e) => {
                        setAboutInfo({ ...aboutInfo, [key]: e.target.value })
                        handleSaveAbout(key, e.target.value)
                      }}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans transition-all min-h-[100px]"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newKey = prompt('Enter new info key:')
                    if (newKey) {
                      setAboutInfo({ ...aboutInfo, [newKey]: '' })
                      handleSaveAbout(newKey, '')
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  <Plus className="w-4 h-4" />
                  Add Info Field
                </button>
              </div>
            </motion.div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground font-serif">Contact Information</h2>
              <div className="space-y-4">
                {Object.entries(contactInfo).map(([key, value]) => (
                  <div key={key} className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4">
                    <label className="block text-sm font-medium text-foreground mb-2 font-sans capitalize">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        setContactInfo({ ...contactInfo, [key]: e.target.value })
                        handleSaveContact(key, e.target.value)
                      }}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newKey = prompt('Enter new contact info key:')
                    if (newKey) {
                      setContactInfo({ ...contactInfo, [newKey]: '' })
                      handleSaveContact(newKey, '')
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact Field
                </button>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground font-serif">Messages</h2>
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 ${!message.read ? 'border-l-4 border-l-primary' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-foreground font-sans">{message.name}</h3>
                        <p className="text-sm text-muted-foreground font-sans">{message.email}</p>
                        <p className="text-xs text-muted-foreground font-sans mt-1">{new Date(message.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-foreground font-sans mt-2">{message.message}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-muted-foreground font-sans">No messages yet</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground font-serif">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setShowSkillModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Name</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Description</label>
                <input
                  type="text"
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Icon URL</label>
                <input
                  type="text"
                  value={skillForm.iconUrl}
                  onChange={(e) => setSkillForm({ ...skillForm, iconUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                  placeholder="https://example.com/icon.svg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Type</label>
                <select
                  value={skillForm.type}
                  onChange={(e) => setSkillForm({ ...skillForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                >
                  <option value="image">Image</option>
                  <option value="font-awesome">Font Awesome</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Gradient Color</label>
                <input
                  type="text"
                  value={skillForm.color}
                  onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                  placeholder="from-green-400 to-emerald-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                >
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tooling">Tooling</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveSkill}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  {editingSkill ? 'Update' : 'Add'} Skill
                </button>
                <button
                  onClick={() => setShowSkillModal(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-sans"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground font-serif">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Gradient</label>
                <input
                  type="text"
                  value={projectForm.gradient}
                  onChange={(e) => setProjectForm({ ...projectForm, gradient: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                  placeholder="from-purple-500 to-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Project URL (Optional)</label>
                <input
                  type="text"
                  value={projectForm.projectUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                  placeholder="https://example.com/project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-foreground font-sans">Featured on Home Page</label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProject}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-sans"
                >
                  {editingProject ? 'Update' : 'Add'} Project
                </button>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-sans"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
