<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'
  import { styled } from '@studiobear/designspek'
  export let theme = $$props.theme || {}
  export let style = $$props.style || {}
  $: overlay = styled(
    {
      pos: 'fixed',
      t: 0,
      l: 0,
      r: 0,
      b: 0,
      bg: 'rgba(0, 0, 0, 0.4)',
      zIndex: 10,
      d: 'flex',
      flexDir: 'column',
      align: 'center',
      ...style,
    },
    theme,
  )

  export let show = false
  const dispatch = createEventDispatcher()
  // console.log('overlay: ', show)
  function overlayClick(e) {
    if ('close' in e.target.dataset) show = false
    dispatch('message', {
      close: false,
    })
  }
</script>

{#if show}
  <div
    class={overlay}
    data-close
    on:click={overlayClick}
    transition:fade={{ duration: 150 }}>
    <slot />
  </div>
{/if}
