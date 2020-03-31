import { writable } from 'svelte/store'
import { typography } from '@studiobear/designspek'
import sourceSansProTheme from '@studiobear/typography-theme-source-sans-pro'

import mainTheme from './themeMain'

const basic = typography(mainTheme, sourceSansProTheme)
let dark = JSON.parse(JSON.stringify(basic))
dark.colors = mainTheme.colors.modes.dark
if (dark.colors.antialias) {
  dark.styles.body['antialias'] = 'subpixel-antialiased'
}
dark.mode = 'dark'
basic.mode = 'light'
// console.log('themes: ', basic.styles.body, dark.styles.body)
function createTheme() {
  const { subscribe, set, update } = writable(basic)

  return {
    subscribe,
    dark: () => update(t => dark),
    light: () => update(t => basic),
    reset: set(basic),
  }
}

const theme = createTheme()

export { theme, basic, dark }
export default theme
