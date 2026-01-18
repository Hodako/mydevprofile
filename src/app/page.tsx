'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ChevronDown, Mail, Send } from 'lucide-react'

const skills = [
  { name: 'Node.js', icon: 'fa-node-js', type: 'font-awesome', color: 'from-green-400 to-emerald-600', description: 'Backend Development' },
  { name: 'React', icon: 'fa-react', type: 'font-awesome', color: 'from-cyan-400 to-blue-600', description: 'Frontend Framework' },
  { name: 'Vite', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg', type: 'image', color: 'from-yellow-400 to-orange-600', description: 'Build Tool' },
  { name: 'Tailwind CSS', icon: 'fa-css3-alt', type: 'font-awesome', color: 'from-teal-400 to-cyan-600', description: 'Styling' },
  { name: 'PostgreSQL', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Logo_PostgreSQL.png', type: 'image', color: 'from-blue-400 to-indigo-600', description: 'Database' },
  { name: 'Serverless', icon: 'https://cdn-icons-png.flaticon.com/256/15131/15131906.png', type: 'image', color: 'from-purple-400 to-pink-600', description: 'Cloud Architecture' },
  { name: 'AWS', icon: 'fa-aws', type: 'font-awesome', color: 'from-orange-400 to-red-600', description: 'Cloud Platform' },
  { name: 'Docker', icon: 'fa-docker', type: 'font-awesome', color: 'from-blue-400 to-indigo-600', description: 'Containerization' },
  { name: 'Kubernetes', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg', type: 'image', color: 'from-pink-400 to-rose-600', description: 'Orchestration' },
  { name: 'Nginx', icon: 'https://icon.icepanel.io/Technology/svg/NGINX.svg', type: 'image', color: 'from-green-500 to-emerald-600', description: 'Web Server' },
  { name: 'Vercel', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Vercel_logo_2025.svg', type: 'image', color: 'from-gray-700 to-gray-900', description: 'Deployment' },
  { name: 'Render', icon: 'https://images.seeklogo.com/logo-png/53/1/render-logo-png_seeklogo-532232.png', type: 'image', color: 'from-purple-500 to-pink-500', description: 'Hosting' },
  { name: 'Cloudflare', icon: 'fa-cloudflare', type: 'font-awesome', color: 'from-orange-500 to-amber-600', description: 'CDN & Security' },
  { name: 'Figma', icon: 'fa-figma', type: 'font-awesome', color: 'from-purple-400 to-pink-600', description: 'UI/UX Design' },
  { name: 'Photoshop', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Adobe_Photoshop_CC_2026_icon.svg', type: 'image', color: 'from-blue-500 to-indigo-600', description: 'Graphic Design' },
  { name: 'Illustrator', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg', type: 'image', color: 'from-orange-500 to-red-600', description: 'Graphic Design' },
  { name: 'Git', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg', type: 'image', color: 'from-red-500 to-orange-600', description: 'Version Control' }
]

const projects = [
  {
    title: 'Serverless API Platform',
    description: 'Built a scalable serverless API using AWS Lambda, API Gateway, and PostgreSQL with 99.99% uptime',
    technologies: ['AWS Lambda', 'API Gateway', 'Node.js', 'PostgreSQL'],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Microservices Architecture',
    description: 'Designed and implemented a microservices architecture using Kubernetes with auto-scaling capabilities',
    technologies: ['Kubernetes', 'Docker', 'Node.js', 'Redis'],
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Real-time Dashboard',
    description: 'Created a real-time analytics dashboard with WebSocket connections and React for optimal performance',
    technologies: ['React', 'Node.js', 'WebSocket', 'Tailwind CSS'],
    gradient: 'from-green-500 to-teal-500'
  },
  {
    title: 'CI/CD Pipeline',
    description: 'Automated deployment pipeline using Docker containers and Kubernetes with GitHub Actions integration',
    technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS EKS'],
    gradient: 'from-orange-500 to-red-500'
  }
]

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} rounded-[1.3rem] blur-lg opacity-15 group-hover:opacity-30 transition-opacity duration-300`} />
      <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-6 hover:border-primary/30 transition-all duration-300">
        <div className="w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {skill.type === 'image' ? (
            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
          ) : (
            <i className={`fa-brands ${skill.icon} text-5xl text-foreground`}></i>
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 font-sans">{skill.name}</h3>
        <p className="text-muted-foreground text-sm font-sans leading-relaxed">{skill.description}</p>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, y: -3 }}
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} rounded-[1.3rem] blur-lg opacity-15 group-hover:opacity-25 transition-opacity duration-300`} />
      <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-6 hover:border-primary/30 transition-all duration-300">
        <div className={`w-1.5 h-12 bg-gradient-to-b ${project.gradient} rounded-full mb-4`} />
        <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{project.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed font-sans">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-muted/50 text-foreground text-xs font-mono rounded-xl border border-border/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! I will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen dark relative overflow-hidden">
      {/* Mobile Background - First image */}
      <div className="fixed inset-0 pointer-events-none md:hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url("/mobile-bg.jpg")',
            animation: 'mobileZoom 20s ease-in-out infinite alternate'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 dark:bg-black/90 backdrop-blur-[1px]" />
      </div>

      {/* Desktop Background - Second image with zoom animation */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url("/desktop-bg.jpg")',
            animation: 'desktopZoom 15s ease-in-out infinite alternate'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 dark:bg-black/90 backdrop-blur-[1px]" />
      </div>

      {/* Animated Mouse Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, oklch(0.6723 0.1606 244.9955 / 0.12) 0%, transparent 50%)`
        }}
      />

      {/* Subtle ambient glow effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-8">
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              href="/"
              className="text-foreground font-medium transition-colors text-sm font-sans tracking-wide"
            >
              Home
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide"
            >
              About
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              href="/skills"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide"
            >
              Skills
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              href="/projects"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide"
            >
              Projects
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide"
            >
              Contact
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <FadeInSection delay={0.2}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-serif tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Azizul Hakim
              </span>
            </motion.h1>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 font-sans tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Full Stack Web Developer
            </motion.p>
          </FadeInSection>

          <FadeInSection delay={0.6}>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 font-sans leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Specializing in modern web technologies with expertise in Node.js, React, PostgreSQL, serverless architectures, and cloud deployments on AWS, Vercel, and Cloudflare
            </motion.p>
          </FadeInSection>

          <FadeInSection delay={0.8}>
            <motion.div
              className="flex justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: 'fa-github', href: 'https://github.com/hodako', label: 'GitHub', type: 'font-awesome' },
                { icon: 'fa-linkedin', href: 'https://linkedin.com', label: 'LinkedIn', type: 'font-awesome' },
                { icon: 'https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/email-envelope-white-icon.png', href: '/contact', label: 'Email', type: 'image' }
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-opacity" />
                  <div className="relative w-14 h-14 bg-card/80 backdrop-blur border border-border rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    {social.type === 'image' ? (
                      <img src={social.icon} alt={social.label} className="w-6 h-6 object-contain" />
                    ) : (
                      <i className={`fa-brands ${social.icon} text-xl text-foreground`}></i>
                    )}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </FadeInSection>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground/60" />
          </motion.div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif tracking-tight">
                Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Skills</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
              <p className="text-muted-foreground mt-6 max-w-2xl mx-auto font-sans">
                Technologies I work with to build modern, scalable applications
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {skills.slice(0, 8).map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <motion.a
              href="/skills"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-xl transition-all font-sans inline-flex items-center gap-2"
            >
              View All Skills ({skills.length})
              <ChevronDown className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif tracking-tight">
                Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
              <p className="text-muted-foreground mt-6 max-w-2xl mx-auto font-sans">
                A selection of my recent work and personal projects
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>

          <div className="flex justify-center">
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-xl transition-all font-sans inline-flex items-center gap-2"
            >
              View All Projects
              <ChevronDown className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-sans">
            © 2026 Azizul Hakim. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <a href="https://github.com/hodako" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">
              <i className="fa-brands fa-github mr-1"></i> GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">
              <i className="fa-brands fa-linkedin mr-1"></i> LinkedIn
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans flex items-center gap-2">
              <img src="https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/email-envelope-white-icon.png" alt="Email" className="h-4 w-4 object-contain" />
              Email
            </a>
          </div>
        </div>
      </footer>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes mobileZoom {
          0%, 100% {
            background-size: 105% auto;
          }
          50% {
            background-size: 110% auto;
          }
        }

        @keyframes desktopZoom {
          0%, 100% {
            background-size: 103% auto;
            background-position: center center;
          }
          50% {
            background-size: 100% auto;
            background-position: center center;
          }
        }
      `}</style>
    </div>
  )
}
