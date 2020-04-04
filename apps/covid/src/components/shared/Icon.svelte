<script>
  import { styled } from '@studiobear/designspek'
  import { SVG } from '@studiobear/designspek-components'

  export let theme = $$props.theme || {}
  export let style = { d: 'none' }
  export let ssr = $$props.ssr || false
  export let fill
  export let viewBox = '0 0 512 512'
  export let name = 'coronavirus-1'

  $: compStyles = styled(style, theme, ssr)
  // $: console.log('SVG:', style, compStyles)
</script>

<SVG {fill} {theme} {viewBox} {...$$props} {style} {ssr}>
  <use xlink:href={`#${name}`} />
</SVG>
