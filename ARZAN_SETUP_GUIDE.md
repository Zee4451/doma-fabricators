# Setup Guide for Arzan - Doma Fabricators Website

## Welcome! 👋

This guide will help you set up the Doma Fabricators website project on your laptop so you can start contributing to the `arzan-development` branch.

---

## Prerequisites

Before starting, make sure you have these installed:

1. **Git** - Version control system
   - Download from: https://git-scm.com/downloads
   - Install with default settings

2. **Code Editor** (Recommended: VS Code)
   - Download from: https://code.visualstudio.com/
   - Install with default settings

3. **Web Browser** (Chrome, Firefox, or Edge)
   - For testing the website

---

## Step-by-Step Setup

### Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Create your account with username, email, and password
4. Verify your email address

### Step 2: Set Up Git on Your Laptop

Open **Git Bash** (Windows) or **Terminal** (Mac/Linux) and run:

```bash
# Set your Git username (use your GitHub username)
git config --global user.name "Your Name"

# Set your Git email (use the same email as your GitHub account)
git config --global user.email "your.email@example.com"

# Verify the settings
git config --list
```

### Step 3: Clone the Repository

Open your terminal/command prompt and navigate to where you want to store the project:

```bash
# Navigate to your projects folder (create one if needed)
cd Desktop
mkdir projects
cd projects

# Clone the specific branch
git clone -b arzan-development https://github.com/Zee4451/doma-fabricators.git

# Navigate into the project folder
cd doma-fabricators
```

### Step 4: Verify You're on the Correct Branch

```bash
# Check which branch you're on
git branch

# You should see:
# * arzan-development
```

If you're not on `arzan-development`, switch to it:

```bash
git checkout arzan-development
```

### Step 5: Open the Project in VS Code

```bash
# Open the project in VS Code
code .
```

Or manually:
1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to the `doma-fabricators` folder
4. Click "Select Folder"

---

## Project Structure Overview

```
doma-fabricators/
├── assets/              # Images and media files
├── pages/
│   ├── css/            # Stylesheets
│   │   └── index.css   # Main CSS file (shared across all pages)
│   └── js/             # JavaScript files
├── index.html          # Homepage
├── about.html          # About page
├── service.html        # Services page
├── industries.html     # Industries page
├── project.html        # Projects page
└── docs/               # Documentation
```

---

## How to Run the Website Locally

### Option 1: Simple File Opening (Easiest)

1. Navigate to the project folder in File Explorer
2. Double-click `index.html`
3. The website will open in your default browser

### Option 2: Using VS Code Live Server (Recommended)

1. In VS Code, go to Extensions (Ctrl+Shift+X)
2. Search for "Live Server"
3. Install "Live Server" by Ritwick Dey
4. Right-click on `index.html`
5. Click "Open with Live Server"
6. Browser will automatically open with live reload

---

## Making Changes

### Step 1: Create a Feature Branch (Optional but Recommended)

```bash
# Create a new branch for your specific feature
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/update-colors
```

### Step 2: Make Your Changes

- Edit HTML files for content/structure
- Edit `pages/css/index.css` for styling
- Edit `pages/js/` files for functionality

### Step 3: Test Your Changes

1. Refresh your browser to see changes
2. Test on different screen sizes (use browser DevTools: F12)
3. Make sure nothing is broken

### Step 4: Commit Your Changes

```bash
# Check what files changed
git status

# Stage all changes
git add .

# OR stage specific files
git add index.html pages/css/index.css

# Commit with a descriptive message
git commit -m "Description of what you changed"

# Example:
git commit -m "Update hero section styling and fix navigation spacing"
```

### Step 5: Push Changes to GitHub

```bash
# Push to your branch
git push origin arzan-development

# OR if you created a feature branch
git push origin feature/your-feature-name
```

---

## Common Git Commands

```bash
# Check current status
git status

# See recent changes
git log --oneline

# Pull latest changes from GitHub
git pull origin arzan-development

# Undo changes to a file (before staging)
git restore filename.html

# See differences
git diff

# Switch branches
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name
```

---

## Best Practices

### ✅ DO:
- Pull latest changes before starting work: `git pull origin arzan-development`
- Make small, focused commits
- Write clear commit messages
- Test changes in browser before committing
- Keep the `main` branch clean - work on `arzan-development`

### ❌ DON'T:
- Don't commit files with console errors
- Don't push without testing
- Don't work directly on `main` branch
- Don't leave changes uncommitted for long periods

---

## Commit Message Examples

```bash
# Good commit messages:
git commit -m "Fix navigation link visibility on mobile"
git commit -m "Update contact form spacing for 4K displays"
git commit -m "Add hover effects to service cards"
git commit -m "Optimize images for faster loading"

# Bad commit messages:
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

---

## Troubleshooting

### Issue: "Permission denied" when pushing
**Solution:** Make sure you're authenticated with GitHub
```bash
# Check authentication
git remote -v

# If needed, re-authenticate
git push origin arzan-development
# GitHub will prompt for login
```

### Issue: Conflicts when pulling
**Solution:**
```bash
# See what's conflicting
git status

# Manually resolve conflicts in the files
# Then:
git add .
git commit -m "Resolve merge conflicts"
```

### Issue: Accidentally committed to main branch
**Solution:**
```bash
# Switch to correct branch
git checkout arzan-development

# Cherry-pick your commit (replace COMMIT_HASH)
git cherry-pick COMMIT_HASH
```

---

## Getting Help

If you encounter issues:

1. **Check Git status:** `git status`
2. **View recent commits:** `git log --oneline -10`
3. **Check remote URL:** `git remote -v`
4. **Ask for help:** Contact the main developer

---

## Quick Start Checklist

- [ ] Git installed
- [ ] GitHub account created
- [ ] Git configured with username and email
- [ ] Repository cloned
- [ ] On `arzan-development` branch
- [ ] Project opened in VS Code
- [ ] Website tested locally
- [ ] Made a test commit and push

---

## Repository Links

- **Main Repository:** https://github.com/Zee4451/doma-fabricators
- **Your Branch:** https://github.com/Zee4451/doma-fabricators/tree/arzan-development
- **Create Pull Request:** https://github.com/Zee4451/doma-fabricators/pulls

---

## Next Steps

Once you're comfortable with the setup:

1. Review the current code structure
2. Pick a task or feature to work on
3. Make changes on your branch
4. Test thoroughly
5. Push your changes
6. Create a pull request to merge into main

---

**Happy Coding! 🚀**
