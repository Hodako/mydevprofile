-- Admin table for authentication
CREATE TABLE IF NOT EXISTS Admin (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Skills table
CREATE TABLE IF NOT EXISTS Skill (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  iconUrl TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  gradient TEXT NOT NULL,
  projectUrl TEXT,
  technologies TEXT NOT NULL,
  featured INTEGER DEFAULT 1,
  "order" INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- AboutInfo table
CREATE TABLE IF NOT EXISTS AboutInfo (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- ContactInfo table
CREATE TABLE IF NOT EXISTS ContactInfo (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS Message (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skill_category ON Skill(category);
CREATE INDEX IF NOT EXISTS idx_project_featured ON Project(featured);
CREATE INDEX IF NOT EXISTS idx_message_read ON Message(read);
