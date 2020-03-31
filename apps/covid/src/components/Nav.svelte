<script>
  import { slide, fade, fly } from 'svelte/transition'
  import { styled } from '@studiobear/designspek'
  import {
    Section,
    Flex,
    Link,
    Heading,
    Button,
  } from '@studiobear/designspek-components'
  import Icon from './Icon.svelte'
  import Overlay from './Overlay.svelte'
  import { theme } from '../theme'
  import storeUserPrefs from '../stores/userPrefs'

  export let segment
  export let ssr

  import Logo from './Logo.svelte'
  import SSR from './styleSSR.svelte'

  let menuVisible = false
  let toTopVisible = true
  let y = 0
  let topOffset = 400

  $: toTopVisible = y > topOffset ? true : false
  // $: console.log('Nav Y:', y)
  function handleOverlay(event) {
    menuVisible = event.detail.close
  }

  $: headStyle = styled(
    {
      pos: 'fixed',
      t: 0,
      w: '100%',
      zIndex: 100,
      bg: $theme.colors.header,
      fontWeight: 300,
      p: '0',
      maxw: '100vw',
    },
    $theme,
  )
  $: flexStyle = {
    justc: 'space-between',
    align: 'stretch',
    px: '.25rem',
    py: '.25rem',
    theme: $theme,
  }
  $: navStyle = styled(
    {
      pos: 'fixed',
      t: 0,
      r: 0,
      w: '250px',
      h: '100vh',
      d: 'flex',
      flexdir: 'column',
      justc: 'stretch',
      align: 'stretch',
      py: '.25rem',
      bg: $theme.colors.muted,
      zIndex: 20,
    },
    $theme,
  )
  $: flexNavStyle = {
    direction: 'column',
    justc: 'center',
    alignC: 'center',
    theme: $theme,
  }
  $: brandStyle = {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 900,
    width: '100%',
    my: '.4rem',
    fontSize: ['2em', '2em', '2.2em', '2.4em', '2.8em', '3em'],
    theme: $theme,
  }
  $: brandLinkStyle = {
    textTransform: 'uppercase',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 900,
    theme: $theme,
  }
  $: menuLinkStyle = {
    color: $theme.colors.tertiary,
    txtTran: 'uppercase',
    textDecoration: 'none',
    fontSize: '1.6rem',
    px: '1.5rem',
    py: '1rem',
    _hover: {
      bg: $theme.colors.secondary,
      color: $theme.colors.background,
    },
  }

  $: menuLinkSelected = {
    ...menuLinkStyle,
    color: $theme.colors.background,
    bg: $theme.colors.primary,
    _hover: {
      bg: $theme.colors.tertiary,
    },
  }

  $: homeLink = segment === undefined ? menuLinkSelected : menuLinkStyle
  $: statsLink = segment === 'stats' ? menuLinkSelected : menuLinkStyle
  $: aboutLink = segment === 'about' ? menuLinkSelected : menuLinkStyle
  $: whyLink = segment === 'why' ? menuLinkSelected : menuLinkStyle

  $: title = segment === undefined ? 'Keep Informed' : segment

  $: navBttn = {
    m: 0,
    pb: 0,
    d: 'block',
    w: '40px',
    h: '30px',
    border: '2px solid',
    borderColor: $theme.colors.tertiary,
    bg: $theme.colors.background,
    pt: '5px',
    px: '8px',
    mt: '12px',
    mr: '12px',
    borderRadius: '5px',
  }
  $: navBttnSpan = styled(
    {
      d: 'block',
      w: '100%',
      h: '2px',
      mb: '3px',
      bg: $theme.colors.tertiary,
    },
    $theme,
  )
  $: navBttnSpanHidden = styled(
    {
      pos: 'absolute',
      l: '-1000px',
      t: 'auto',
      w: '1px',
      h: '1px',
      m: 0,
      overflow: 'hidden',
    },
    $theme,
  )
  $: navClose = styled(
    {
      m: 0,
      p: 0,
      fontSize: '2rem',
      fontWeight: 700,
      pos: 'relative',
      t: '-13px',
      color: $theme.colors.tertiary,
    },
    $theme,
  )
  $: toTop = styled(
    {
      m: 0,
      p: 0,
      pos: 'fixed',
      b: '20px',
      r: '20px',
      size: '50px',
      borderRadius: '25px',
      brdCol: 'none',
      bg: 'rgba(0,0,0,.6)',
      color: $theme.colors.background,
      pt: '5px',
      mt: '12px',
      mr: '12px',
      txtTran: 'uppercase',
      txtAlign: 'center',
      lineHeight: '0rem',
    },
    $theme,
  )
  $: toTopCaret = styled(
    {
      m: 0,
      p: 0,
      fontSize: '2rem',
      fontWeight: 700,
      pos: 'relative',
      t: '-2px',
    },
    $theme,
  )
  $: modeBttn = {
    m: 0,
    p: 0,
    d: 'block',
    size: '2.5rem',
    border: '1px solid',
    brdCol: 'transparent',
    bg: $theme.colors.grey,
    lineHeight: '2.5rem',
    pt: '5px',
    borderRadius: '2.5rem',
    mt: '0.5rem',
    ml: '0.5rem',
  }
  $: modeIcon = {
    size: '1.25rem',
  }
  $: mode = $storeUserPrefs.mode || $theme.mode || 'light'

  const setMode = mode => {
    if (mode === 'light') {
      theme.dark()
      storeUserPrefs.dark()
    } else {
      theme.light()
      storeUserPrefs.light()
    }
  }
</script>

<svelte:head>
  <title>PSA Covid-19: {title}</title>
</svelte:head>
<svelte:window bind:scrollY={y} />
<nav class={headStyle} transition:slide={{ delay: 80, duration: 600 }}>
  <Flex style={flexNavStyle} {ssr}>
    <Flex style={flexStyle} {ssr}>
      <Heading as="h1" style={brandStyle} {ssr}>
        <Link href="." style={brandLinkStyle} {ssr}>PSA: COVID-19</Link>
      </Heading>
      <Button
        style={navBttn}
        on:click={() => (menuVisible = !menuVisible)}
        {ssr}>
        <span class={navBttnSpan} />
        <span class={navBttnSpan} />
        <span class={navBttnSpan} />
        <span class={navBttnSpanHidden}>Menu</span>
      </Button>
    </Flex>
    {#if menuVisible}
      <Overlay bind:show={menuVisible} on:message={handleOverlay} />
      <div class={navStyle} transition:fly={{ x: 250, opacity: 1 }}>
        <Flex
          style={{ flexdir: 'row-reverse', justc: 'space-between', px: '0.5rem' }}>
          <Button style={navBttn} on:click={() => (menuVisible = !menuVisible)}>
            <span class={navClose}>&rtri;</span>
            <span class={navBttnSpanHidden}>Menu Close</span>
          </Button>
          <Button style={modeBttn} on:click={setMode(mode)}>
            {#if $theme.mode === 'light'}
              <Icon
                name="virus-2"
                fill={$theme.colors.tertiary}
                style={modeIcon} />
            {:else}
              <Icon
                name="virus-1"
                fill={$theme.colors.tertiary}
                style={modeIcon} />
            {/if}
          </Button>
        </Flex>
        <Flex style={{ flexdir: 'column', py: '1rem' }}>
          <Link
            href="."
            style={homeLink}
            on:click={() => (menuVisible = !menuVisible)}>
            home
          </Link>
          <Link
            href="stats"
            style={statsLink}
            on:click={() => (menuVisible = !menuVisible)}>
            stats
          </Link>
          <Link
            href="why"
            style={whyLink}
            on:click={() => (menuVisible = !menuVisible)}>
            why
          </Link>
          <Link
            href="about"
            style={aboutLink}
            on:click={() => (menuVisible = !menuVisible)}>
            about
          </Link>
        </Flex>
      </div>
    {/if}
  </Flex>
</nav>

{#if toTopVisible}
  <button
    on:click={() => window.scroll({ top: 0, left: 0, behaviour: 'smooth' })}
    transition:fade={{ delay: 50 }}
    class={toTop}>
    <span class={toTopCaret}>&xwedge;</span>
    <span class={navBttnSpanHidden}>To Top</span>
  </button>
{/if}

<SSR theme={$theme} />
