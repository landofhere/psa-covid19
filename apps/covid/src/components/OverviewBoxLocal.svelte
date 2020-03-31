<script>
  import { onMount } from 'svelte'
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import OverviewBoxLocalCounty from './OverviewBoxLocalCounty.svelte'
  import { insertCommas, capitalize } from '../libs'
  export let theme = $$props.theme || {}
  export let data
  export let local
  export let overview
  let dataCountry
  let dataRegion

  $: active = overview.active || 0
  $: recovered = overview.recovered || 0
  $: confirmed = overview.confirmed || 0
  $: deaths = overview.deaths || 0
  $: fatalityRate = overview.fatalityRate || 0
  $: recoveryRate = overview.recoveryRate || 0
  $: updated = overview.updated

  $: longLength = local.addressNames.long.length
  $: shortLength = local.addressNames.short.length
  $: countryLong =
    longLength === 2
      ? local.addressNames.long[1]
      : local.addressNames.long[2] || 'United States'
  $: country =
    shortLength === 2
      ? local.addressNames.short[1]
      : local.addressNames.short[2] || 'US'
  $: region =
    longLength === 2
      ? local.addressNames.long[0]
      : local.addressNames.long[1] || 'California'
  $: regionShort =
    shortLength === 2
      ? local.addressNames.short[0]
      : local.addressNames.short[1] || 'CA'
  $: county = local.addressNames.short[0] || 'No County'
  $: regUpper = region.toUpperCase()
  $: regLower = region.toLowerCase()

  $: {
    for (let i = 0; i < data.length; i++) {
      if (data[i].Name == country || data[i].Name == countryLong) {
        dataCountry = data[i]
        break
      }
    }
  }

  $: countryData = dataCountry || false
  $: subRegionData = countryData ? countryData.SubRegion || false : false

  $: {
    for (let [name, val] of Object.entries(subRegionData)) {
      if (name == region || name == regionShort) {
        dataRegion = val
        break
      }
    }
  }

  $: regionData = dataRegion || false
  // $: console.log('ov', countryData, subRegionData, regionData)

  $: cntryActive = countryData.Active || 0
  $: cntryRecovered = countryData.Recovered || 0
  $: cntryConfirmed = countryData.Confirmed || 0
  $: cntryDeaths = countryData.Deaths || 0
  $: cntryFatalityRate = (cntryDeaths / cntryConfirmed) * 100 || 0
  $: cntryRecoveryRate = (cntryRecovered / cntryConfirmed) * 100 || 0
  $: cntryUpdated = overview.updated

  $: regActive =
    regionData.Confirmed - (regionData.Deaths + regionData.Recovered) || 0
  $: regRecovered = regionData.Recovered || 0
  $: regConfirmed = regionData.Confirmed || 0
  $: regDeaths = regionData.Deaths || 0
  $: regFatalityRate = (regDeaths / regConfirmed) * 100 || 0
  $: regRecoveryRate = (regRecovered / regConfirmed) * 100 || 0

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
    pb: '1.5rem',
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
    color: theme.colors.tertiary,
  }
  $: btmh4 = {
    color: theme.colors.text,
    fontSize: '1.5rem',
  }

  const API_URL = process.env.API_URL
  const API_CA_COUNTY_FILE = process.env.API_CA_COUNTY_FILE

  const API_CA_COUNTY_URL = `${API_URL}${API_CA_COUNTY_FILE}`
  onMount(async function getData() {
    const respCA = await fetch(`${API_CA_COUNTY_URL}${regLower}.json`)
    let tempCA = await respCA.json()
    // console.log('V2 CA CNTY: ', tempCA, regionData)
    let regName = capitalize(tempCA.name)
    if (regName === region) {
      regConfirmed = tempCA.cases.total || 0
      regDeaths = tempCA.deaths.total || 0
      regRecovered = 0
      regActive = regConfirmed - (regDeaths + regRecovered) || 0
      regFatalityRate = (regDeaths / regConfirmed) * 100 || 0
      regRecoveryRate = (regRecovered / regConfirmed) * 100 || 0
    }
  })
</script>

<Flex style={overviewBox}>
  <Box style={overviewSingleBox}>
    <Heading as="h6" style={ovTitle}>Cases Near Me</Heading>
  </Box>
  <Box style={overviewSingleBoxActive}>
    <Heading as="h6" style={h6}>{countryLong} Active</Heading>
    <Heading as="h2" style={activeh2}>{insertCommas(cntryActive)}</Heading>
  </Box>
  <Flex style={overviewMiddleBox}>
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={middleh6}>{country} Recoveries</Heading>
      <Heading as="h3" style={recoverh3}>
        {insertCommas(cntryRecovered)}
      </Heading>
    </Box>
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={middleh6}>{country} Confirmed</Heading>
      <Heading as="h3" style={confirmh3}>
        {insertCommas(cntryConfirmed)}
      </Heading>
    </Box>
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={middleh6}>{country} Deaths</Heading>
      <Heading as="h3" style={deathh3}>{insertCommas(cntryDeaths)}</Heading>
    </Box>
  </Flex>
  <Flex style={overviewBottomBox}>
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={btmh6}>{country} Recovery Rate</Heading>
      <Heading as="h4" style={btmh4}>{cntryRecoveryRate.toFixed(2)}%</Heading>
    </Box>
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={btmh6}>{country} Fatality Rate</Heading>
      <Heading as="h4" style={btmh4}>{cntryFatalityRate.toFixed(2)}%</Heading>
    </Box>
  </Flex>
  {#if regionData}
    <Box style={overviewSingleBoxActive}>
      <Heading as="h6" style={h6}>{region} Active</Heading>
      <Heading as="h2" style={activeh2}>{insertCommas(regActive)}</Heading>
    </Box>
    <Flex style={overviewMiddleBox}>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>{regionShort} Recoveries</Heading>
        <Heading as="h3" style={recoverh3}>
          {insertCommas(regRecovered)}
        </Heading>
      </Box>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>{regionShort} Confirmed</Heading>
        <Heading as="h3" style={confirmh3}>
          {insertCommas(regConfirmed)}
        </Heading>
      </Box>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={middleh6}>{regionShort} Deaths</Heading>
        <Heading as="h3" style={deathh3}>{insertCommas(regDeaths)}</Heading>
      </Box>
    </Flex>
    <Flex style={overviewBottomBox}>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={btmh6}>{regionShort} Recovery Rate</Heading>
        <Heading as="h4" style={btmh4}>{regRecoveryRate.toFixed(2)}%</Heading>
      </Box>
      <Box style={overviewSingleBox}>
        <Heading as="h6" style={btmh6}>{regionShort} Fatality Rate</Heading>
        <Heading as="h4" style={btmh4}>{regFatalityRate.toFixed(2)}%</Heading>
      </Box>
    </Flex>
  {/if}
  {#if region === 'California'}
    <OverviewBoxLocalCounty {theme} {county} {region} />
  {/if}

</Flex>
