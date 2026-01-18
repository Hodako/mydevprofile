'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

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

export default function About() {
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
            <a href="/about" className="text-foreground font-medium transition-colors text-sm font-sans tracking-wide">About</a>
            <a href="/skills" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Skills</a>
            <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Projects</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Contact</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight">
                About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Me</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </motion.div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-8 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[1.3rem] blur-3xl" />
              <div className="relative space-y-6">
                <p className="text-lg text-foreground leading-relaxed font-sans">
                  I'm a passionate full-stack web developer with deep expertise in building scalable, high-performance applications. My journey in web development has led me to master cutting-edge technologies and best practices.
                </p>

                <p className="text-lg text-foreground leading-relaxed font-sans">
                  I specialize in creating serverless architectures that maximize efficiency and minimize operational overhead. With extensive experience in AWS, Docker, and Kubernetes, I design and deploy cloud-native solutions that scale seamlessly.
                </p>

                <p className="text-lg text-foreground leading-relaxed font-sans">
                  My expertise spans the entire development lifecycle, from frontend interfaces built with React and Tailwind CSS to backend services powered by Node.js and PostgreSQL. I'm proficient in using Vercel and Render for deployments, and Cloudflare for CDN and security.
                </p>

                <p className="text-lg text-foreground leading-relaxed font-sans">
                  I'm committed to writing clean, maintainable code and implementing robust CI/CD pipelines. My experience includes configuring Nginx reverse proxies, optimizing database performance, and implementing microservices architectures.
                </p>

                <p className="text-lg text-foreground leading-relaxed font-sans">
                  When I'm not coding, I enjoy staying updated with the latest tech trends, contributing to open-source projects, and mentoring fellow developers.
                </p>
              </div>
            </div>
          </FadeInSection>

          <div className="flex justify-center mt-12 gap-6 flex-wrap">
            <motion.a
              href="/skills"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-xl transition-all font-sans"
            >
              My Skills
            </motion.a>
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-card border border-border text-foreground font-medium rounded-xl transition-all font-sans hover:border-primary/30"
            >
              View Projects
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-card border border-border text-foreground font-medium rounded-xl transition-all font-sans hover:border-primary/30"
            >
              Get In Touch
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
          <div className="flex gap-6">
            <a href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Skills</a>
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
