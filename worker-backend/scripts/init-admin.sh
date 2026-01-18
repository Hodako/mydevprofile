#!/bin/bash

# Admin Initialization Script for Portfolio Backend
# This script helps you create the initial admin account

set -e

echo "🚀 Portfolio Backend - Admin Initialization"
echo "=========================================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo "📋 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Cloudflare"
    echo "Login with: wrangler login"
    exit 1
fi

echo "✅ Authenticated as: $(wrangler whoami)"
echo ""

# Get worker URL
if [ -z "$1" ]; then
    echo "📝 Enter your worker URL (or pass as first argument):"
    read -r WORKER_URL
else
    WORKER_URL="$1"
fi

if [ -z "$WORKER_URL" ]; then
    echo "❌ Error: Worker URL is required"
    exit 1
fi

# Get username
echo ""
echo "📝 Enter admin username:"
read -r USERNAME

if [ -z "$USERNAME" ]; then
    echo "❌ Error: Username is required"
    exit 1
fi

# Get password
echo ""
echo "📝 Enter admin password (min 8 characters):"
read -rs PASSWORD

if [ ${#PASSWORD} -lt 8 ]; then
    echo "❌ Error: Password must be at least 8 characters"
    exit 1
fi

echo ""
echo "⚠️  Creating admin account..."
echo "   URL: $WORKER_URL"
echo "   Username: $USERNAME"
echo ""

# Confirm
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 0
fi

# Make the request
echo ""
echo "🔄 Creating admin account..."

RESPONSE=$(curl -s -X POST "$WORKER_URL/api/init-admin" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

# Check response
if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Success! Admin account created successfully"
    echo ""
    echo "📌 IMPORTANT: Please remove or comment out the"
    echo "   '/api/init-admin' endpoint in src/index.ts"
    echo "   before deploying to production!"
    echo ""
    echo "🎉 You can now login at: $WORKER_URL/whoisadmin"
else
    echo "❌ Failed to create admin account"
    echo "Response: $RESPONSE"
    exit 1
fi
