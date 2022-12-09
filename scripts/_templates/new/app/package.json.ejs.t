---
to: <%= file_path %>/package.json
---

{
  "name": "app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "18.11.12",
    "@types/react": "18.0.26",
    "@types/react-dom": "18.0.9",
    "next": "13.0.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "4.9.4"
  }
}
