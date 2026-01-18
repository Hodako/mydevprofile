'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const skills = [
  { name: 'Node.js', icon: 'fa-node-js', type: 'font-awesome', color: 'from-green-400 to-emerald-600', description: 'Backend Development', category: 'Backend' },
  { name: 'React', icon: 'fa-react', type: 'font-awesome', color: 'from-cyan-400 to-blue-600', description: 'Frontend Framework', category: 'Frontend' },
  { name: 'Vite', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg', type: 'image', color: 'from-yellow-400 to-orange-600', description: 'Build Tool', category: 'Tooling' },
  { name: 'Tailwind CSS', icon: 'fa-css3-alt', type: 'font-awesome', color: 'from-teal-400 to-cyan-600', description: 'Styling', category: 'Frontend' },
  { name: 'PostgreSQL', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Logo_PostgreSQL.png', type: 'image', color: 'from-blue-400 to-indigo-600', description: 'Database', category: 'Database' },
  { name: 'Serverless', icon: 'https://cdn-icons-png.flaticon.com/256/15131/15131906.png', type: 'image', color: 'from-purple-400 to-pink-600', description: 'Cloud Architecture', category: 'Cloud' },
  { name: 'AWS', icon: 'fa-aws', type: 'font-awesome', color: 'from-orange-400 to-red-600', description: 'Cloud Platform', category: 'Cloud' },
  { name: 'Docker', icon: 'fa-docker', type: 'font-awesome', color: 'from-blue-400 to-indigo-600', description: 'Containerization', category: 'DevOps' },
  { name: 'Kubernetes', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg', type: 'image', color: 'from-pink-400 to-rose-600', description: 'Orchestration', category: 'DevOps' },
  { name: 'Nginx', icon: 'https://icon.icepanel.io/Technology/svg/NGINX.svg', type: 'image', color: 'from-green-500 to-emerald-600', description: 'Web Server', category: 'DevOps' },
  { name: 'Vercel', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Vercel_logo_2025.svg', type: 'image', color: 'from-gray-700 to-gray-900', description: 'Deployment', category: 'Cloud' },
  { name: 'Render', icon: 'https://images.seeklogo.com/logo-png/53/1/render-logo-png_seeklogo-532232.png', type: 'image', color: 'from-purple-500 to-pink-500', description: 'Hosting', category: 'Cloud' },
  { name: 'Cloudflare', icon: 'fa-cloudflare', type: 'font-awesome', color: 'from-orange-500 to-amber-600', description: 'CDN & Security', category: 'Cloud' },
  { name: 'Figma', icon: 'fa-figma', type: 'font-awesome', color: 'from-purple-400 to-pink-600', description: 'UI/UX Design', category: 'Design' },
  { name: 'Photoshop', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Adobe_Photoshop_CC_2026_icon.svg', type: 'image', color: 'from-blue-500 to-indigo-600', description: 'Graphic Design', category: 'Design' },
  { name: 'Illustrator', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg', type: 'image', color: 'from-orange-500 to-red-600', description: 'Graphic Design', category: 'Design' },
  { name: 'Git', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg', type: 'image', color: 'from-red-500 to-orange-600', description: 'Version Control', category: 'Tooling' }
]

const categories = ['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Tooling', 'Design']

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
      transition={{ duration: 0.5, delay: index * 0.05 }}
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

export default function Skills() {
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
            <a href="/skills" className="text-foreground font-medium transition-colors text-sm font-sans tracking-wide">Skills</a>
            <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Projects</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Contact</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight">
                My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Skills</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
                Technologies I work with to build modern, scalable applications
              </p>
            </motion.div>
          </FadeInSection>

          {categories.map((category, catIndex) => (
            <FadeInSection key={category} delay={catIndex * 0.1}>
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{category}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {skills.filter(s => s.category === category).map((skill, index) => (
                    <SkillCard key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
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
            <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Projects</a>
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
