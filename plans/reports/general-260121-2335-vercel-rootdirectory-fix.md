# Vercel Root Directory Fix

## Problem

Vercel can't detect Next.js because it's looking at the repository root, but the app is in `apps/web`.

Error: `No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.`

## Solution

Set **Root Directory** to `apps/web` in Vercel project settings.

## Option 1: Dashboard (Recommended)

1. Go to: https://vercel.com/bonetheextroverts-projects/electric_contact_book/settings/general
2. Scroll to **"Root Directory"**
3. Click **"Edit"**
4. Enter: `apps/web`
5. Click **"Save"**

## Option 2: API

Using Vercel CLI or REST API:

```bash
vercel project update electric_contact_book --root-directory=apps/web
```

Or with REST API:

```bash
curl --request PATCH \
  --url "https://api.vercel.com/v9/projects/prj_OUFspSn4gkNV0hboy5ir0JhIqMvd?teamId=team_SP7FhTrPKbQNbVLmBI5vx2vP" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"rootDirectory": "apps/web"}'
```

## After Setting Root Directory

Remove `vercel.json` build commands (they'll be auto-detected):

```json
{
  "framework": "nextjs"
}
```

Or delete `vercel.json` entirely and let Vercel auto-detect everything.

## Project Info

- **Project ID**: `prj_OUFspSn4gkNV0hboy5ir0JhIqMvd`
- **Team ID**: `team_SP7FhTrPKbQNbVLmBI5vx2vP`
- **Dashboard**: https://vercel.com/bonetheextroverts-projects/electric_contact_book
