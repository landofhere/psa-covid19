<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { styled } from '@studiobear/designspek'
  import { Flex, Button, Box } from '@studiobear/designspek-components'
  import Overlay from './Overlay.svelte'
  export let style = $$props.style || {}
  export let theme = $$props.theme || { colors: { background: '#fff' } }
  $: modal = {
    bg: theme.colors.background,
    mx: 'auto',
    my: '1em',
    p: '0.5em',
    boxShadow: '0 3px 10px #555',
    zIndex: 20,
    minh: '10rem',
    maxh: '20rem',
    maxw: '60vw',
    flexdir: 'column',
    align: 'center',
    justc: 'center',
    pos: 'relative',
    ...style,
  }

  $: closeModal = {
    m: 0,
    p: 0,
    size: '2rem',
    borderRadius: '2rem',
    brd: '1px solid',
    brdCol: 'transparent',
    bg: 'rgba(255,255,255,.5)',
    color: theme.colors.tertiary,
    txtTran: 'uppercase',
    txtAlign: 'center',
    lineHeight: '0',
    fontSize: '4rem',
    pos: 'absolute',
    b: '-25%',
    l: 'calc(50% - 1rem)',
    d: 'inline-flex',
    align: 'baseline',
    _active: {
      bg: 'rgba(80,119,119,.6)',
    },
    theme,
  }

  export let show = false
  const dispatch = createEventDispatcher()
  function handleModal(e) {
    if ('close' in e.target.dataset) show = false
    dispatch('message', {
      close: false,
    })
  }
  function handleOverlay(event) {
    show = event.detail.close
  }
</script>

<Overlay
  {theme}
  style={{ bg: 'rgba(0, 0, 0, 0.6)' }}
  bind:show
  on:message={handleOverlay}>
  <Flex {theme} style={modal}>
    <slot />
    <Button on:click={handleOverlay} style={closeModal}>&Cross;</Button>
  </Flex>
</Overlay>
