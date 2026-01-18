'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { Send, Github, Linkedin, Mail } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'

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

export default function Contact() {
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

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Thank you for your message! I will get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/hodako', label: 'GitHub', faIcon: 'fa-github', type: 'font-awesome' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', faIcon: 'fa-linkedin', type: 'font-awesome' },
    { icon: Mail, href: 'mailto:azizulhakim886@outlook.com', label: 'Email', src: 'https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/email-envelope-white-icon.png', type: 'image' }
  ]

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
            <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans font-medium tracking-wide">Projects</a>
            <a href="/contact" className="text-foreground font-medium transition-colors text-sm font-sans tracking-wide">Contact</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight">
                Get In <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
                Have a project in mind or want to collaborate? Feel free to reach out.
              </p>
            </motion.div>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <FadeInSection delay={0.2}>
              <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[1.3rem] blur-3xl" />
                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 font-sans">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 font-sans">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 font-sans">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-sans"
                      placeholder="Your message..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-xl transition-all flex items-center justify-center gap-2 font-sans"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </FadeInSection>

            {/* Contact Info */}
            <FadeInSection delay={0.4}>
              <div className="space-y-6">
                <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[1.3rem] blur-3xl" />
                  <div className="relative">
                    <h2 className="text-xl font-bold text-foreground mb-6 font-serif">Let's Connect</h2>
                    <p className="text-muted-foreground mb-6 font-sans leading-relaxed">
                      I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                    </p>
                    <div className="space-y-4">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-all group"
                          target={social.href.startsWith('http') ? '_blank' : undefined}
                          rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            {social.type === 'image' ? (
                              <img src={social.src} alt={social.label} className="w-6 h-6 object-contain" />
                            ) : (
                              <i className={`fa-brands ${social.faIcon} text-primary-foreground text-lg`}></i>
                            )}
                          </div>
                          <span className="text-foreground font-sans">{social.label}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-[1.3rem] p-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[1.3rem] blur-3xl" />
                  <div className="relative">
                    <h2 className="text-xl font-bold text-foreground mb-6 font-serif">Quick Info</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground font-sans mb-1">Location</p>
                        <p className="text-foreground font-sans">Available Worldwide (Remote)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-sans mb-1">Availability</p>
                        <p className="text-foreground font-sans">Open to Opportunities</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-sans mb-1">Response Time</p>
                        <p className="text-foreground font-sans">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
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
            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">About</a>
            <a href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Skills</a>
            <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Projects</a>
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
