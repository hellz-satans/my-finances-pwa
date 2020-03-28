/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { VERSION } from '@/config/application_properties'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log('[Service Worker] ready...')
    },
    registered () {
      console.log('[Service Worker] registered...')
    },
    cached () {
      console.log('[Service Worker] cached for offline use...')
    },
    updatefound () {
      console.log(`[Service Worker] New content found, new version is ${VERSION}.`)
    },
    updated () {
      console.log(`[Service Worker] Please refresh to donwload version ${VERSION}.`)
    },
    offline () {
      console.log('[Service Worker] App is running in offline mode.')
    },
    error (error) {
      console.error('[Service Worker] Error during service worker registration:', error)
    }
  })
}
