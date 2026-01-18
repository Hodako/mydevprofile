# Admin System Setup Guide

## Overview
Your portfolio now has a complete admin system at `/whoisadmin` where you can manage:

1. **Skills** - Add, edit, delete skills with titles, descriptions, and icon URLs
2. **Projects** - Add, edit, delete featured projects with URLs
3. **About Info** - Edit about page content
4. **Contact Info** - Edit contact information
5. **Messages** - View and delete messages from contact form

## Initial Setup

### Step 1: Create Admin User
You need to create an admin account first. Run this command in the terminal:

```bash
curl -X POST http://localhost:3000/api/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password"
  }'
```

Or use any HTTP client (Postman, Thunder Client, etc.) to:
- **URL**: `POST /api/init-admin`
- **Body** (JSON):
  ```json
  {
    "username": "admin",
    "password": "your-secure-password"
  }
  ```

⚠️ **Important**: This endpoint can only be used once. After creating the admin, delete the `/api/init-admin` route for security.

### Step 2: Login to Admin Dashboard
1. Go to `http://localhost:3000/whoisadmin/login`
2. Enter your username and password
3. You'll be redirected to `/whoisadmin/dashboard`

## Admin Features

### Skills Management
- **Add Skill**: Click "Add Skill" button
  - Name: e.g., "React"
  - Description: e.g., "Frontend Framework"
  - Icon URL: e.g., "https://example.com/react.svg" or Font Awesome class like "fa-react"
  - Type: "image" or "font-awesome"
  - Gradient Color: e.g., "from-cyan-400 to-blue-600"
  - Category: Backend, Frontend, Database, Cloud, DevOps, Tooling, Design

- **Edit/Delete**: Hover over any skill card and click edit/delete icons

### Projects Management
- **Add Project**: Click "Add Project" button
  - Title: Project name
  - Description: Project description
  - Gradient: e.g., "from-purple-500 to-pink-500"
  - Project URL: External link (optional)
  - Technologies: Comma-separated list (e.g., "React, Node.js, PostgreSQL")
  - Featured: Check to show on home page

- **Edit/Delete**: Hover over any project card and click edit/delete icons

### About Info Management
- Edit any about page content by typing in the textareas
- Changes are auto-saved
- Click "Add Info Field" to create new content fields

### Contact Info Management
- Edit contact information (email, GitHub, LinkedIn, etc.)
- Changes are auto-saved
- Click "Add Contact Field" to create new fields

### Messages Management
- View all messages sent from the contact form
- Unread messages have a left border highlight
- Click trash icon to delete messages

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (returns session cookie)
- `GET /api/auth/check` - Check if authenticated
- `POST /api/auth/logout` - Logout

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### About Info
- `GET /api/about` - Get all about info
- `PUT /api/about` - Update about info

### Contact Info
- `GET /api/contact-info` - Get all contact info
- `PUT /api/contact-info` - Update contact info

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Submit message (from contact form)
- `PUT /api/messages/[id]` - Mark as read/unread
- `DELETE /api/messages/[id]` - Delete message

## Database Schema

### Admin
- id (String, primary key)
- username (String, unique)
- password (String, hashed)
- createdAt (DateTime)
- updatedAt (DateTime)

### Skill
- id (String, primary key)
- name (String)
- description (String)
- iconUrl (String)
- type (String) - 'image' or 'font-awesome'
- color (String) - gradient color class
- category (String) - Backend, Frontend, Database, Cloud, DevOps, Tooling, Design
- order (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### Project
- id (String, primary key)
- title (String)
- description (String)
- gradient (String) - gradient color class
- projectUrl (String, optional) - external link
- technologies (String) - JSON array
- featured (Boolean) - show on home page
- order (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### AboutInfo
- id (String, primary key)
- key (String, unique) - field identifier
- value (String) - content
- createdAt (DateTime)
- updatedAt (DateTime)

### ContactInfo
- id (String, primary key)
- key (String, unique) - field identifier
- value (String) - content
- createdAt (DateTime)
- updatedAt (DateTime)

### Message
- id (String, primary key)
- name (String)
- email (String)
- message (String)
- read (Boolean) - whether admin has read it
- createdAt (DateTime)

## Security Notes

1. **Session Management**: Uses httpOnly cookies with secure flag in production
2. **Password Hashing**: Uses bcrypt with 10 salt rounds
3. **Session Duration**: 7 days
4. **Production**: Ensure secure cookies and HTTPS

## Troubleshooting

### Can't login?
- Check that admin user exists in database
- Verify password is correct
- Check browser console for errors

### Changes not saving?
- Check browser console for API errors
- Verify database permissions
- Check dev server logs

### Contact form not working?
- Verify `/api/messages` endpoint is accessible
- Check browser console for errors
- Ensure form data is correctly formatted
