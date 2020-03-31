<script>
  import { onMount } from 'svelte'
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import { calcC19CACountyStats, insertCommas } from '../libs'
  export let theme = $$props.theme || {}
  export let county
  export let region
  $: regStats = {}
  let available = false

  let cntyShort = county.replace(' County', '')
  let regUpper = region.toUpperCase()
  let regLower = region.toLowerCase()
  const cntyUrl = cntyShort.replace(/[\. ,\/\\]+/g, '-').toLowerCase()

  $: cntyActive = 0
  $: cntyRecovered = 0
  $: cntyConfirmed = 0
  $: cntyDeaths = 0
  $: cntyFatalityRate = 0
  $: cntyRecoveryRate = 0

  // const CACountyURL =
  //  'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json'

  const CACountyURL = process.env.CA_COUNTY_URL
  const CA_COUNTY_URL_V2 = process.env.CA_COUNTY_URL_V2
  const API_URL = process.env.API_URL
  const API_CA_COUNTY_FILE = process.env.API_CA_COUNTY_FILE

  const API_CA_COUNTY_URL = `${API_URL}${API_CA_COUNTY_FILE}`

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
  $: overviewMiddleBox = {
    flexdir: 'row',
    width: '100%',
    alignc: 'stretch',
    pb: '1.5rem',
    bg: theme.colors.background,
  }
  $: overviewSingleBoxActive = {
    ...overviewSingleBox,
    bg: theme.colors.quaternary,
  }

  $: overviewBottomBox = {
    ...overviewMiddleBox,
    bg: theme.colors.grey,
  }
  $: ovTitle = {
    letterSpacing: '0.25rem',
    fontWeight: 900,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  }
  $: h6 = {
    txtAlign: 'center',
    py: 0,
  }
  $: activeh2 = {
    fontSize: '4rem',
    color: theme.colors.background,
    my: '0.5rem',
  }
  $: middleh6 = {
    txtAlign: 'center',
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
    txtAlign: 'center',
    color: theme.colors.text,
    px: '1rem',
  }
  $: btmh4 = {
    color: theme.colors.text,
    fontSize: '1.5rem',
  }

  onMount(async function getData() {
    const respCnty = await fetch(`${API_CA_COUNTY_URL}${cntyUrl}.json`)
    let tempCnty = await respCnty.json()
    // console.log('V2 CA CNTY: ', tempCnty)

    if (region === 'California') {
      available = true
    }

    cntyConfirmed = tempCnty.cases.total || 0
    cntyDeaths = tempCnty.deaths.total || 0
    cntyFatalityRate = (cntyDeaths / cntyConfirmed) * 100 || 0
  })
</script>

{#if available}
  <Flex style={overviewBox}>
    <Box style={overviewSingleBoxActive}>
      <Heading as="h6" style={h6}>{county} Cases</Heading>
    </Box>
    <Flex style={overviewMiddleBox}>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>Confirmed</Heading>
        <Heading as="h3" style={recoverh3}>
          {insertCommas(cntyConfirmed)}
        </Heading>
      </Box>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>Deaths</Heading>
        <Heading as="h3" style={confirmh3}>{insertCommas(cntyDeaths)}</Heading>
      </Box>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>Fatality Rate</Heading>
        <Heading as="h3" style={deathh3}>
          {cntyFatalityRate.toFixed(2)}%
        </Heading>
      </Box>
    </Flex>
    <Box style={overviewBottomBox}>
      <Text style={btmh6}>
        {@html `Unfortunately, recoveries are not being tracked or are unavailable at this time at
        the county level. This means we cannot track progress locally. Thus, the local goal is to keep <strong># of confirmed</strong> as low as possible.`}
      </Text>
    </Box>
  </Flex>
{:else}
  <Flex style={overviewBox}>
    <Box style={overviewBottomBox}>
      <Heading as="h6" style={h6}>Local data not yet available</Heading>
      <Text style={btmh6}>
        We're sorry, data from your county/precinct level isn't available or
        connected to this app yet.
      </Text>
    </Box>
  </Flex>
{/if}
