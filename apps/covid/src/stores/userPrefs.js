import { writable } from 'svelte/store'
import {
  createStorageInstance,
  setStorageItem,
  getStorageItem,
  getStorageKeys,
} from '../libs'

const lfUserPrefs = createStorageInstance('userPrefs')
let prefs = { mode: 'light', location: undefined }

const setMode = (prev, mode) => {
  // console.log('setMode: ', mode)
  setStorageItem('mode', mode, lfUserPrefs)
  return { ...prev, mode }
}

const setLocation = (prev, loc) => {
  // console.log('setLocation: ', prev, loc)
  setStorageItem('location', loc, lfUserPrefs)
  return { ...prev, location: loc }
}

const createUserPrefs = () => {
  const { subscribe, set, update } = writable(prefs)

  return {
    subscribe,
    location: loc => update(n => setLocation(n, loc)),
    dark: () => update(n => setMode(n, 'dark')),
    light: () => update(n => setMode(n, 'light')),
    reset: set(prefs),
  }
}

const storeUserPrefs = createUserPrefs()

export { storeUserPrefs, lfUserPrefs }
export default storeUserPrefs
