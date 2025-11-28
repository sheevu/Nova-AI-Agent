#!/usr/bin/env bash
set -euo pipefail

# Script: push_new_branch.sh
# Purpose: Safely push the local main branch to a new remote branch (import-local-main)
# Usage: bash scripts/push_new_branch.sh

REPO_URL="https://github.com/sheevu/Nova-AI-Agent.git"
BRANCH_NAME="import-local-main"

echo "Working directory: $(pwd)"

# Ensure we're in a git repo
if [ ! -d ".git" ]; then
  echo ".git not found — initializing repository"
  git init
fi

# Show current remotes
if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already set to: $(git remote get-url origin)"
else
  echo "Adding remote origin -> $REPO_URL"
  git remote add origin "$REPO_URL"
fi

# Fetch remote refs (safe)
echo "Fetching origin..."
git fetch origin || true

# Ensure we have a main branch locally
git checkout -B main

# Stage and commit any uncommitted changes (if any)
if [ -n "$(git status --porcelain)" ]; then
  echo "Staging and committing local changes"
  git add .
  git commit -m "Initial import of Nova-AI-Agent" || true
else
  echo "No local changes to commit"
fi

# Push local main to a new remote branch to avoid overwriting remote main
echo "Pushing local 'main' as 'origin/$BRANCH_NAME' (safe, non-destructive)"
git push -u origin main:"$BRANCH_NAME"

cat <<EOF
Done.
Your local 'main' branch has been pushed to 'origin/$BRANCH_NAME'.
Go to: https://github.com/sheevu/Nova-AI-Agent and create a Pull Request from '$BRANCH_NAME' into 'main' to merge safely.
EOF
