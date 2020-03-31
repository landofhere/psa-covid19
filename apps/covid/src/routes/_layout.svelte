<script>
  import { onMount } from 'svelte'
  import { addGlobal, styled, removeSSR } from '@studiobear/designspek'
  import { Section, Button, Box } from '@studiobear/designspek-components'

  import { theme } from '../theme'
  import { storeUserPrefs, lfUserPrefs } from '../stores/userPrefs'
  import { getStorageKeys, getStorageItem, setStorageItem } from '../libs'
  import { Nav, SSR, Icons } from '../components'

  if (process.browser) {
    lfUserPrefs
      .ready()
      .then(async () => {
        let keys = await getStorageKeys(lfUserPrefs)
        if (keys.includes('mode')) {
          let mode = await getStorageItem('mode', lfUserPrefs)
          mode === 'light' ? theme.light() : theme.dark()
        } else {
          setStorageItem('mode', 'light', lfUserPrefs)
          theme.light()
        }
        if (keys.includes('location')) {
          let loc = await getStorageItem('location', lfUserPrefs)
          await storeUserPrefs.location(loc)
        }
      })
      .catch(function(e) {
        console.log(e)
      })
  }

  // $: background = $theme.colors.background || '#fff'
  export let segment
  let ssr = true

  $: bodyStyle = {
    bg: $theme.colors.background,
  }

  $: mainStyle = {
    maxWidth: '56rem',
    bg: $theme.colors.background,
    p: ['0rem', '0rem', '1rem', '2rem', '3rem'],
    mx: 'auto',
    pt: '6.25rem',
    width: '100vw',
  }
  $: addGlobal($theme)
  onMount(() => {
    // removeSSR()
    ssr = false
  })
</script>

<style>
  :global(html) {
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  :global(body) {
    margin: 0;
  }
</style>

<svelte:options immutable={true} />
<svelte:head>
  <link href="index.css" rel="stylesheet" type="text/css" />
  <meta
    name="Description"
    content="A curated compilation of information, tips and stats about COVID-19
    for the purpose of maintaining a calm and informed persective" />
</svelte:head>

<Box style={bodyStyle} {ssr}>
  <Nav {segment} {ssr} />
  <Section as="main" style={mainStyle} {ssr}>
    <slot />
  </Section>
</Box>
<Icons />
<SSR theme={$theme} active={ssr} />
