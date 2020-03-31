<script>
  // import { onMount } from 'svelte'
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import { insertCommas } from '../libs'
  import Loading from './Loading.svelte'
  export let theme = $$props.theme || {}
  export let ssr = $$props.ssr || {}
  export let overview
  $: active = overview.active || 0
  $: recovered = overview.recovered || 0
  $: confirmed = overview.confirmed || 0
  $: deaths = overview.deaths || 0
  $: fatalityRate = overview.fatalityRate || 0
  $: recoveryRate = overview.recoveryRate || 0
  $: updated = overview.updated

  // $: console.log('ov', overview, insertCommas, insertCommas(100000))

  $: overviewBox = {
    w: '100%',
    flexdir: 'column',
    align: 'center',
    brd: ['none', 'none', '1px solid', '1px solid', '1px solid'],
    brdCol: [
      'transparent',
      'transparent',
      theme.colors.muted,
      theme.colors.muted,
      theme.colors.muted,
    ],
    mx: 'auto',
  }
  let overviewSingleBox = {
    flexdir: 'column',
    align: 'center',
    w: '100%',
    txtalign: 'center',
    d: 'flex',
    flexdir: 'column',
    alignc: 'stretch',
  }
  let overviewMiddleBox = {
    flexdir: 'row',
    width: '100%',
    alignc: 'stretch',
    pb: '1.5rem',
  }
  $: overviewSingleBoxActive = {
    ...overviewSingleBox,
    bg: theme.colors.quaternary,
    pb: '1.5rem',
  }

  $: overviewBottomBox = {
    ...overviewMiddleBox,
    bg: theme.colors.grey,
  }
  $: ovTitle = {
    letterSpacing: '0.25rem',
    fontWeight: 900,
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
  }
  $: h6 = {
    py: 0,
  }
  $: activeh2 = {
    fontSize: '4rem',
    color: theme.colors.background,
    my: '0.5rem',
  }
  $: middleh6 = {
    color: theme.colors.tertiary,
  }
  $: recoverh3 = {
    color: theme.colors.green,
  }
  $: confirmh3 = {
    color: theme.colors.blue,
  }
  $: deathh3 = {
    color: theme.colors.purple,
  }
  $: ovUpdated = {
    fontSize: '0.8rem',
    color: theme.colors.tertiary,
    txtTran: 'uppercase',
    txtAlign: 'center',
    mb: 0,
    mt: '0.25rem',
    px: '1rem',
  }
  $: btmh6 = {
    color: theme.colors.tertiary,
  }
  $: loadingh6 = {
    color: theme.colors.secondary,
  }
  $: btmh4 = {
    color: theme.colors.text,
    fontSize: '1.5rem',
  }
  $: loading = {
    animation: 'spin 6s infinite',
    mt: '0.5rem',
  }
</script>

<Flex style={overviewBox} {ssr}>
  <Box style={overviewSingleBox} {ssr}>
    <Heading as="h6" style={ovTitle} {ssr}>Global Cases</Heading>
  </Box>
  <Box style={overviewSingleBoxActive} {ssr}>
    {#if active === 0}
      <Loading {theme} fill={theme.colors.primary} style={loading} {ssr} />
      <Heading as="h6" style={loadingh6} {ssr}>Loading...</Heading>
    {:else}
      <Heading as="h6" style={h6} {ssr}>Active</Heading>
      <Heading as="h2" style={activeh2} {ssr}>{insertCommas(active)}</Heading>
    {/if}
  </Box>
  <Flex style={overviewMiddleBox} {ssr}>
    <Box style={overviewSingleBox} {ssr}>
      <Heading as="h6" style={middleh6} {ssr}>Recoveries</Heading>
      <Heading as="h3" style={recoverh3} {ssr}>
        {insertCommas(recovered)}
      </Heading>
    </Box>
    <Box style={overviewSingleBox} {ssr}>
      <Heading as="h6" style={middleh6} {ssr}>Confirmed</Heading>
      <Heading as="h3" style={confirmh3} {ssr}>
        {insertCommas(confirmed)}
      </Heading>
    </Box>
    <Box style={overviewSingleBox} {ssr}>
      <Heading as="h6" style={middleh6} {ssr}>Deaths</Heading>
      <Heading as="h3" style={deathh3} {ssr}>{insertCommas(deaths)}</Heading>
    </Box>
  </Flex>
  <Flex style={overviewBottomBox} {ssr}>
    <Box style={overviewSingleBox} {ssr}>
      <Heading as="h6" style={btmh6} {ssr}>Recovery Rate</Heading>
      <Heading as="h4" style={btmh4} {ssr}>{recoveryRate.toFixed(2)}%</Heading>
    </Box>
    <Box style={overviewSingleBox} {ssr}>
      <Heading as="h6" style={btmh6} {ssr}>Fatality Rate</Heading>
      <Heading as="h4" style={btmh4} {ssr}>{fatalityRate.toFixed(2)}%</Heading>
    </Box>
  </Flex>
  <Text style={ovUpdated} {ssr}>Last updated: {updated}</Text>
</Flex>
