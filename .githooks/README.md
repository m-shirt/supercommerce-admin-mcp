# Git Hooks

This directory contains git hooks for local validation.

## Setup

To enable these hooks, run:

```bash
git config core.hooksPath .githooks
```

## Available Hooks

### pre-commit
- Validates tool definitions before commit
- Checks for syntax errors in paths.js
- Detects duplicate tool registrations
- Runs tool validation script

This prevents committing broken tool configurations locally, catching issues before they reach CI/CD.