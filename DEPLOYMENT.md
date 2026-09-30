# Deployment Guide

This project is a Vite React app inside the `client` folder. It is ready for static hosting.

## Netlify
1. Create a new Netlify site.
2. Set the project root to the repository root.
3. Use the following values:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`
4. Deploy.

The repository also includes a `netlify.toml` file for the same setup.

## Vercel
1. Import the repository into Vercel.
2. Set the project root to the repository root.
3. Set the framework to Vite.
4. Use the root directory as the project folder, or set the app root to `client` in the Vercel UI.
5. Build command: `cd client && npm install && npm run build`
6. Output directory: `client/dist`

## Local production check
Run:

```bash
cd client
npm run build
```

This produces a production-ready bundle in `client/dist`.
