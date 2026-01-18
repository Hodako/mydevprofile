'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'Serverless API Platform',
    description: 'Built a scalable serverless API using AWS Lambda, API Gateway, and PostgreSQL with 99.99% uptime. Implemented caching with Cloudflare and deployed to Vercel.',
    technologies: ['AWS Lambda', 'API Gateway', 'Node.js', 'PostgreSQL', 'Cloudflare', 'Vercel'],
    gradient: 'from-purple-500 to-pink-500',
    link: '#'
  },
  {
    title: 'Microservices Architecture',
    description: 'Designed and implemented a microservices architecture using Kubernetes with auto-scaling capabilities. Services communicate via REST APIs and are containerized with Docker.',
    technologies: ['Kubernetes', 'Docker', 'Node.js', 'Redis', 'Nginx'],
    gradient: 'from-cyan-500 to-blue-500',
    link: '#'
  },
  {
    title: 'Real-time Dashboard',
    description: 'Created a real-time analytics dashboard with WebSocket connections and React for optimal performance. Backend runs on Render with PostgreSQL database.',
    technologies: ['React', 'Node.js', 'WebSocket', 'Tailwind CSS', 'PostgreSQL', 'Render'],
    gradient: 'from-green-500 to-teal-500',
    link: '#'
  },
  {
    title: 'CI/CD Pipeline',
    description: 'Automated deployment pipeline using Docker containers and Kubernetes with GitHub Actions integration. Includes automated testing, security scanning, and monitoring.',
    technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS EKS', 'Nginx'],
    gradient: 'from-orange-500 to-red-500',
    link: '#'
  },
  {
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with Stripe integration, real-time inventory management, and Cloudflare CDN for global performance.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Vercel', 'Cloudflare'],
    gradient: 'from-blue-500 to-indigo-500',
    link: '#'
  },
  {
    title: 'SaaS Application',
    description: 'Built a multi-tenant SaaS application with PostgreSQL, deployed on Render. Features include authentication, billing, and real-time notifications.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Render', 'WebSocket'],
    gradient: 'from-pink-500 to-rose-500',
    link: '#'
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
      <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-6 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
        <div className={`w-1.5 h-12 bg-gradient-to-b ${project.gradient} rounded-full mb-4`} />
        <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{project.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed font-sans flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-muted/50 text-foreground text-xs font-mono rounded-xl border border-border/50"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-sans text-sm font-medium"
        >
          View Project
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  return (
    <div className="min-h-screen dark relative overflow-hidden">
      {/* Mobile Background */}
      <div className="fixed inset-0 pointer-events-none md:hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url("/mobile-bg.jpg")',
            animation: 'mobileZoom 20s ease-in-out infinite alternate'
          }}
        />
        <div className="absolute inset-0 dark:bg-black/90 backdrop-blur-[1px]" />
      </div>

      {/* Desktop Background */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url("/desktop-bg.jpg")',
            animation: 'desktopZoom 15s ease-in-out infinite alternate'
          }}
        />
        <div className="absolute inset-0 dark:bg-black/90 backdrop-blur-[1px]" />
      </div>

      {/* Animated Mouse Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, oklch(0.6723 0.1606 244.9955 / 0.12) 0%, transparent 50%)`
        }}
      />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Home</a>
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">About</a>
            <a href="/skills" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Skills</a>
            <a href="/projects" className="text-foreground font-medium transition-colors text-sm font-sans tracking-wide">Projects</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Contact</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight">
                My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
                A selection of my recent work and personal projects
              </p>
            </motion.div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-sans">
            © 2026 Azizul Hakim. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Back to Home</a>
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">About</a>
            <a href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Skills</a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Contact</a>
          </div>
        </div>
      </footer>

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
