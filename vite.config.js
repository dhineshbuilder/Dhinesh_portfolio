import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const loadLocalEnv = () => {
  const envPath = path.join(rootDir, '.env')

  if (!fs.existsSync(envPath)) {
    return
  }

  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/g)
    .forEach((line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) {
        return
      }

      const equalsIndex = trimmed.indexOf('=')

      if (equalsIndex === -1) {
        return
      }

      const key = trimmed.slice(0, equalsIndex).trim()
      const rawValue = trimmed.slice(equalsIndex + 1).trim()
      const value = rawValue.replace(/^["']|["']$/g, '')

      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    })
}

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body.trim()) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })

const createDevResponse = (res) => {
  const response = {
    status(code) {
      res.statusCode = code
      return response
    },
    json(payload) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json')
      }

      res.end(JSON.stringify(payload))
      return response
    },
    end(payload = '') {
      res.end(payload)
      return response
    },
  }

  return response
}

const portfolioChatDevApi = () => ({
  name: 'portfolio-chat-dev-api',
  apply: 'serve',
  configureServer(server) {
    loadLocalEnv()

    server.middlewares.use('/api/chat', async (req, res) => {
      try {
        req.body = await readJsonBody(req)
        await chatHandler(req, createDevResponse(res))
      } catch {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          answer: 'Invalid chatbot request body.',
          sourceBadges: [],
        }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioChatDevApi()],
  server: {
    proxy: {
      '/api/leetcode': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leetcode/, '/graphql')
      }
    }
  }
})
