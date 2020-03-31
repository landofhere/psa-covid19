<script>
  import { styled } from '@studiobear/designspek'
  import Icon from './Icon.svelte'
  export let theme = $$props.theme || { colors: { primary: '#333' } }
  export let style = $$props.style || {}
  export let ssr = $$props.ssr || false
  export let fill = $$props.fill || theme.colors.primary
  export let name = 'virus-3'

  let icon = {
    w: '3rem',
    h: 'auto',
    animation: 'spin 2s infinite',
    _keyframesSpin: {
      from: {
        transform: 'rotate(0)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
    ...style,
  }
  // console.log('Loading: ', icon)
</script>

<Icon {name} {theme} style={icon} {fill} {ssr} />
