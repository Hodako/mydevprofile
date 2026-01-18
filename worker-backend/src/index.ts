import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { setCookie, deleteCookie } from 'hono/cookie'
import { verify, sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
  SESSION_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware
app.use('*', cors({
  origin: '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Utility: Generate CUID
function generateCuid(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `c${timestamp}${random}`
}

// Utility: Generate Session Token
async function generateSessionToken(secret: string): Promise<string> {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    iat: Math.floor(Date.now() / 1000),
  }
  return await sign(payload, secret)
}

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json()

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400)
    }

    const result = await c.env.DB.prepare('SELECT * FROM Admin WHERE username = ?')
      .bind(username)
      .first()

    if (!result) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isValidPassword = await bcrypt.compare(password, result.password as string)

    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const token = await generateSessionToken(c.env.SESSION_SECRET)

    setCookie(c, 'session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    return c.json({ success: true, message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Check Authentication
app.get('/api/auth/check', async (c) => {
  try {
    const session = c.req.header('cookie')?.match(/session=([^;]+)/)?.[1]

    if (!session) {
      return c.json({ authenticated: false }, 401)
    }

    const payload = await verify(session, c.env.SESSION_SECRET)

    if (!payload) {
      return c.json({ authenticated: false }, 401)
    }

    return c.json({ authenticated: true })
  } catch (error) {
    return c.json({ authenticated: false }, 401)
  }
})

// Logout
app.post('/api/auth/logout', async (c) => {
  deleteCookie(c, 'session', {
    path: '/',
    secure: true,
  })

  return c.json({ success: true, message: 'Logout successful' })
})

// ==================== SKILLS ROUTES ====================

// Get all skills
app.get('/api/skills', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM Skill ORDER BY "order" ASC, createdAt ASC')
      .all()

    return c.json({ skills: result.results })
  } catch (error) {
    console.error('Get skills error:', error)
    return c.json({ error: 'Failed to fetch skills' }, 500)
  }
})

// Create skill
app.post('/api/skills', async (c) => {
  try {
    const { name, description, iconUrl, type, color, category, order } = await c.req.json()

    if (!name || !description || !iconUrl) {
      return c.json({ error: 'Name, description, and iconUrl are required' }, 400)
    }

    const id = generateCuid()
    const now = new Date().toISOString()

    await c.env.DB.prepare(`
      INSERT INTO Skill (id, name, description, iconUrl, type, color, category, "order", createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      name,
      description,
      iconUrl,
      type || 'image',
      color || 'from-primary to-accent',
      category || 'Backend',
      order || 0,
      now,
      now
    ).run()

    const result = await c.env.DB.prepare('SELECT * FROM Skill WHERE id = ?').bind(id).first()

    return c.json({ skill: result })
  } catch (error) {
    console.error('Create skill error:', error)
    return c.json({ error: 'Failed to create skill' }, 500)
  }
})

// Update skill
app.put('/api/skills/:id', async (c) => {
  try {
    const { id } = c.req.param()
    const { name, description, iconUrl, type, color, category, order } = await c.req.json()

    const now = new Date().toISOString()

    await c.env.DB.prepare(`
      UPDATE Skill
      SET name = ?, description = ?, iconUrl = ?, type = ?, color = ?, category = ?, "order" = ?, updatedAt = ?
      WHERE id = ?
    `).bind(
      name,
      description,
      iconUrl,
      type,
      color,
      category,
      order,
      now,
      id
    ).run()

    const result = await c.env.DB.prepare('SELECT * FROM Skill WHERE id = ?').bind(id).first()

    if (!result) {
      return c.json({ error: 'Skill not found' }, 404)
    }

    return c.json({ skill: result })
  } catch (error) {
    console.error('Update skill error:', error)
    return c.json({ error: 'Failed to update skill' }, 500)
  }
})

// Delete skill
app.delete('/api/skills/:id', async (c) => {
  try {
    const { id } = c.req.param()

    await c.env.DB.prepare('DELETE FROM Skill WHERE id = ?').bind(id).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete skill error:', error)
    return c.json({ error: 'Failed to delete skill' }, 500)
  }
})

// ==================== PROJECTS ROUTES ====================

// Get all projects
app.get('/api/projects', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM Project ORDER BY "order" ASC, createdAt ASC')
      .all()

    return c.json({ projects: result.results })
  } catch (error) {
    console.error('Get projects error:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

// Create project
app.post('/api/projects', async (c) => {
  try {
    const { title, description, gradient, projectUrl, technologies, featured, order } = await c.req.json()

    if (!title || !description || !technologies) {
      return c.json({ error: 'Title, description, and technologies are required' }, 400)
    }

    const id = generateCuid()
    const now = new Date().toISOString()
    const technologiesJson = JSON.stringify(technologies)

    await c.env.DB.prepare(`
      INSERT INTO Project (id, title, description, gradient, projectUrl, technologies, featured, "order", createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      title,
      description,
      gradient || 'from-primary to-accent',
      projectUrl || null,
      technologiesJson,
      featured ? 1 : 0,
      order || 0,
      now,
      now
    ).run()

    const result = await c.env.DB.prepare('SELECT * FROM Project WHERE id = ?').bind(id).first()

    return c.json({ project: result })
  } catch (error) {
    console.error('Create project error:', error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

// Update project
app.put('/api/projects/:id', async (c) => {
  try {
    const { id } = c.req.param()
    const { title, description, gradient, projectUrl, technologies, featured, order } = await c.req.json()

    const now = new Date().toISOString()
    const technologiesJson = JSON.stringify(technologies)

    await c.env.DB.prepare(`
      UPDATE Project
      SET title = ?, description = ?, gradient = ?, projectUrl = ?, technologies = ?, featured = ?, "order" = ?, updatedAt = ?
      WHERE id = ?
    `).bind(
      title,
      description,
      gradient,
      projectUrl,
      technologiesJson,
      featured ? 1 : 0,
      order,
      now,
      id
    ).run()

    const result = await c.env.DB.prepare('SELECT * FROM Project WHERE id = ?').bind(id).first()

    if (!result) {
      return c.json({ error: 'Project not found' }, 404)
    }

    return c.json({ project: result })
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

// Delete project
app.delete('/api/projects/:id', async (c) => {
  try {
    const { id } = c.req.param()

    await c.env.DB.prepare('DELETE FROM Project WHERE id = ?').bind(id).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return c.json({ error: 'Failed to delete project' }, 500)
  }
})

// ==================== ABOUT INFO ROUTES ====================

// Get all about info
app.get('/api/about', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM AboutInfo').all()

    const aboutInfo: Record<string, string> = {}
    for (const row of result.results) {
      aboutInfo[row.key as string] = row.value as string
    }

    return c.json({ aboutInfo })
  } catch (error) {
    console.error('Get about info error:', error)
    return c.json({ error: 'Failed to fetch about info' }, 500)
  }
})

// Update about info
app.put('/api/about', async (c) => {
  try {
    const { key, value } = await c.req.json()

    if (!key || value === undefined) {
      return c.json({ error: 'Key and value are required' }, 400)
    }

    const now = new Date().toISOString()

    // Check if key exists
    const existing = await c.env.DB.prepare('SELECT id FROM AboutInfo WHERE key = ?')
      .bind(key)
      .first()

    if (existing) {
      await c.env.DB.prepare('UPDATE AboutInfo SET value = ?, updatedAt = ? WHERE key = ?')
        .bind(value, now, key)
        .run()
    } else {
      const id = generateCuid()
      await c.env.DB.prepare('INSERT INTO AboutInfo (id, key, value, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
        .bind(id, key, value, now, now)
        .run()
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Update about info error:', error)
    return c.json({ error: 'Failed to update about info' }, 500)
  }
})

// ==================== CONTACT INFO ROUTES ====================

// Get all contact info
app.get('/api/contact-info', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM ContactInfo').all()

    const contactInfo: Record<string, string> = {}
    for (const row of result.results) {
      contactInfo[row.key as string] = row.value as string
    }

    return c.json({ contactInfo })
  } catch (error) {
    console.error('Get contact info error:', error)
    return c.json({ error: 'Failed to fetch contact info' }, 500)
  }
})

// Update contact info
app.put('/api/contact-info', async (c) => {
  try {
    const { key, value } = await c.req.json()

    if (!key || value === undefined) {
      return c.json({ error: 'Key and value are required' }, 400)
    }

    const now = new Date().toISOString()

    // Check if key exists
    const existing = await c.env.DB.prepare('SELECT id FROM ContactInfo WHERE key = ?')
      .bind(key)
      .first()

    if (existing) {
      await c.env.DB.prepare('UPDATE ContactInfo SET value = ?, updatedAt = ? WHERE key = ?')
        .bind(value, now, key)
        .run()
    } else {
      const id = generateCuid()
      await c.env.DB.prepare('INSERT INTO ContactInfo (id, key, value, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
        .bind(id, key, value, now, now)
        .run()
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Update contact info error:', error)
    return c.json({ error: 'Failed to update contact info' }, 500)
  }
})

// ==================== MESSAGES ROUTES ====================

// Get all messages
app.get('/api/messages', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM Message ORDER BY createdAt DESC')
      .all()

    return c.json({ messages: result.results })
  } catch (error) {
    console.error('Get messages error:', error)
    return c.json({ error: 'Failed to fetch messages' }, 500)
  }
})

// Create message
app.post('/api/messages', async (c) => {
  try {
    const { name, email, message } = await c.req.json()

    if (!name || !email || !message) {
      return c.json({ error: 'Name, email, and message are required' }, 400)
    }

    const id = generateCuid()
    const now = new Date().toISOString()

    await c.env.DB.prepare(`
      INSERT INTO Message (id, name, email, message, read, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, name, email, message, 0, now).run()

    const result = await c.env.DB.prepare('SELECT * FROM Message WHERE id = ?').bind(id).first()

    return c.json({ message: result })
  } catch (error) {
    console.error('Create message error:', error)
    return c.json({ error: 'Failed to create message' }, 500)
  }
})

// Mark message as read
app.put('/api/messages/:id', async (c) => {
  try {
    const { id } = c.req.param()
    const { read } = await c.req.json()

    await c.env.DB.prepare('UPDATE Message SET read = ? WHERE id = ?')
      .bind(read ? 1 : 0, id)
      .run()

    const result = await c.env.DB.prepare('SELECT * FROM Message WHERE id = ?').bind(id).first()

    if (!result) {
      return c.json({ error: 'Message not found' }, 404)
    }

    return c.json({ message: result })
  } catch (error) {
    console.error('Update message error:', error)
    return c.json({ error: 'Failed to update message' }, 500)
  }
})

// Delete message
app.delete('/api/messages/:id', async (c) => {
  try {
    const { id } = c.req.param()

    await c.env.DB.prepare('DELETE FROM Message WHERE id = ?').bind(id).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return c.json({ error: 'Failed to delete message' }, 500)
  }
})

// ==================== INIT ADMIN ====================

// Initialize admin account (run once)
app.post('/api/init-admin', async (c) => {
  try {
    const { username, password } = await c.req.json()

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400)
    }

    // Check if admin already exists
    const existing = await c.env.DB.prepare('SELECT id FROM Admin WHERE username = ?')
      .bind(username)
      .first()

    if (existing) {
      return c.json({ error: 'Admin already exists' }, 400)
    }

    const id = generateCuid()
    const now = new Date().toISOString()
    const hashedPassword = await bcrypt.hash(password, 10)

    await c.env.DB.prepare(`
      INSERT INTO Admin (id, username, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, username, hashedPassword, now, now).run()

    return c.json({ success: true, message: 'Admin account created' })
  } catch (error) {
    console.error('Init admin error:', error)
    return c.json({ error: 'Failed to create admin' }, 500)
  }
})

// ==================== HEALTH CHECK ====================

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Portfolio API is running' })
})

export default app
