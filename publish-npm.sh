#!/usr/bin/env bash
set -euo pipefail
set +x  # never allow xtrace to print tokens

export PATH="$HOME/.bun/bin:$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# ── keychain ──────────────────────────────────────────────────────────────────

NPM_TOKEN=$(security find-generic-password -s npm_token -w 2>/dev/null || true)

[[ -z "$NPM_TOKEN" ]] && { echo "✗ missing npm_token in keychain (security add-generic-password -s npm_token -w <token>)"; exit 1; }

# ── temp .npmrc (token never in process args or env of child processes) ───────
TMPRC=$(mktemp)
chmod 600 "$TMPRC"
trap 'rm -f "$TMPRC"' EXIT INT TERM

printf '//registry.npmjs.org/:_authToken=%s\n' "$NPM_TOKEN" >> "$TMPRC"

unset NPM_TOKEN

# ── git sanity checks ─────────────────────────────────────────────────────────
BRANCH=$(git rev-parse --abbrev-ref HEAD)
[[ "$BRANCH" != "main" ]] && { echo "✗ Must be on main (currently: $BRANCH)"; exit 1; }

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✗ Uncommitted changes — stash or commit first"
  exit 1
fi

# ── version bump ──────────────────────────────────────────────────────────────
CURRENT=$(bun -e "import pkg from './package.json' with {type:'json'}; process.stdout.write(pkg.version)")
MAJOR=$(echo "$CURRENT" | cut -d. -f1)
MINOR=$(echo "$CURRENT" | cut -d. -f2)
PATCH=$(echo "$CURRENT" | cut -d. -f3)

BUMP="${BUMP:-patch}"
case "$BUMP" in
  major) MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR+1)); PATCH=0 ;;
  patch) PATCH=$((PATCH+1)) ;;
  *) echo "✗ Unknown BUMP: $BUMP (patch/minor/major)"; exit 1 ;;
esac

NEW="$MAJOR.$MINOR.$PATCH"
TAG="v$NEW"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "✗ Tag $TAG already exists — was a previous publish interrupted?"
  exit 1
fi

echo "Bumping $CURRENT → $NEW"

bun -e "
  import { readFileSync, writeFileSync } from 'fs';
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  pkg.version = '$NEW';
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# ── build + test ──────────────────────────────────────────────────────────────
bun run build
bun test

# ── publish ───────────────────────────────────────────────────────────────────
echo "Publishing to npm..."

NPM_CONFIG_USERCONFIG="$TMPRC" npm publish --access public --ignore-scripts

# ── commit + tag + push ───────────────────────────────────────────────────────
git add package.json bun.lock
git commit -m "chore: release $NEW"
git tag "$TAG"
git push origin HEAD
git push origin "$TAG"

echo ""
echo "✓ $NEW published to npm (tag: $TAG)"

# ── update changelog.md via Claude Code CLI ───────────────────────────────────

PREV_TAG=$(git tag --sort=-version:refname | grep "^v" | grep -v "^$TAG$" | head -1 || true)
if [[ -n "$PREV_TAG" ]]; then
  COMMIT_LOG=$(git log --oneline "$PREV_TAG".."$TAG" 2>/dev/null || true)
else
  COMMIT_LOG=$(git log --oneline "$TAG" | head -20)
fi

# echo ""
# echo "Updating changelog.md (Claude Code)..."

# claude \
#   --model haiku \
#   --no-session-persistence \
#   -p "Update changelog.md for a new release of npm-exists.

# New version: $NEW
# Previous tag: ${PREV_TAG:-none}

# Commits since ${PREV_TAG:-beginning}:
# $COMMIT_LOG

# Instructions:
# - Read changelog.md first (create it if it doesn't exist, with a '# Changelog' heading)
# - Add a new '## v$NEW' section at the very top (directly below the '# Changelog' heading)
# - Only include meaningful changes: features, bug fixes, breaking changes, perf improvements
# - Skip commits that are only: chore, deploy, dist, docs, README, format, CI internals
# - Each bullet: concise, imperative tense, 1 line (e.g. 'Add support for scoped packages')
# - If zero meaningful commits exist, write '- Internal/infrastructure changes only'
# - Do NOT modify any existing changelog entries" \
#   --allowedTools "Read,Edit,Write" 2>&1

# if ! git diff --quiet changelog.md 2>/dev/null; then
#   git add changelog.md
#   git commit -m "docs: update changelog for $NEW"
#   git push origin HEAD
#   echo "✓ changelog.md committed and pushed"
# else
#   echo "  (no changelog changes)"
# fi
