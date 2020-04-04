<script>
  import { onMount } from 'svelte'
  import {styled } from '@studiobear/designspek'
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import { calcC19CACountyStats, insertCommas, percentChange } from '../../libs'
  export let theme = $$props.theme || {}
  export let county
  export let region
  $: regStats = {}
  let available = false
  let change = false

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
  $: cntyConfirmedDay = 0
  $: cntyConfirmedDayPct = 0
  $: cntyConfirmedWeek = 0
  $: cntyConfirmedWeekPct = 0
  $: cntyDeathsDay = 0
  $: cntyDeathsDayPct = 0
  $: cntyDeathsWeek = 0
  $: cntyDeathsWeekPct = 0

  // const CACountyURL =
  //  'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json'

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
  $: changeMiddleBox = {
    flexdir: 'row',
    width: '100%',
    alignc: 'stretch',
    pb: '0.5rem',
    bg: theme.colors.background,
  }

  $: BoxMiddleChange = {
    flexdir: 'column',
    minw: '50%',
  }

  $: BoxMiddleChangeLower = {
    flexdir: 'column',
  }

  $: MiddleChange1 = {
    w: '94%',
    pl: '5%',
    pr: '1%',
    txtAlign: 'center',
  }
  $: MiddleChange2 = {
    w: '94%',
    pr: '5%',
    pl: '1%',
    txtAlign: 'center',
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
  $: changeh4 = {
    color: theme.colors.lightYellow,
    fontSize: '1rem',
    fontWeight: '700',
    lineHeight: '1.3rem',
  }

  $: deathsh4 = {
    color: theme.colors.purple,
    fontSize: '1rem',
    fontWeight: '700',
    lineHeight: '1.3rem',
  }
  $: confirmh4 = {
    color: theme.colors.blue,
    fontSize: '1rem',
    fontWeight: '700',
    lineHeight: '1.3rem',
  }

  $: spanh4 = styled(
    {
      fontSize: '1rem',
      fontWeight: '300',
      lineHeight: '1.3rem',
      txtTran: 'uppercase',
    },
    theme,
  )

  onMount(async function getData() {
    const respCnty = await fetch(`${API_CA_COUNTY_URL}${cntyUrl}.json`)
    let tempCnty = await respCnty.json()
    console.log('V2 CA CNTY: ', tempCnty)

    if (region === 'California') {
      available = true
    }
    if (tempCnty.hasOwnProperty('confirmedDayChange') && tempCnty.hasOwnProperty('deathsDayChange')) change = true
    cntyConfirmed = tempCnty.confirmed || 0
    cntyDeaths = tempCnty.deaths || 0
    cntyConfirmedDay = tempCnty.confirmedDayChange || 0
    cntyConfirmedDayPct = percentChange(cntyConfirmedDay, cntyConfirmed) || 0
    cntyConfirmedWeek = tempCnty.confirmedWeekChange || 0
    cntyConfirmedWeekPct = percentChange(cntyConfirmedWeek, cntyConfirmed) || 0
    cntyDeathsDay = tempCnty.deathsDayChange || 0
    cntyDeathsDayPct = percentChange(cntyDeathsWeek, cntyDeaths) || 0
    cntyDeathsWeek = tempCnty.deathsWeekChange || 0
    cntyDeathsWeekPct = percentChange(cntyDeathsWeek, cntyDeaths) || 0
  })
</script>

{#if available}
  {#if change}
    <Flex style={overviewBox}>
      <Box style={overviewSingleBoxActive}>
        <Heading as="h6" style={h6}>{county} Cases</Heading>
      </Box>
      <Flex style={changeMiddleBox}>
        <Flex style={BoxMiddleChange}>
          <Box style={overviewSingleBox}>
            <Heading as="h6" style={middleh6}>Confirmed</Heading>
          </Box>
          <Flex style={BoxMiddleChangeLower}>
            <Box style={MiddleChange1}>
              <Heading as="h3" style={confirmh3}>
                {insertCommas(cntyConfirmed)}
              </Heading>
            </Box>
            <Box style={MiddleChange1}>
              <Heading as="h4" style={confirmh4}>
                +{insertCommas(cntyConfirmedDay)}
                <span class={spanh4}>(+{cntyConfirmedDayPct}%) Day</span>
              </Heading>
              <Heading as="h4" style={confirmh4}>
                +{insertCommas(cntyConfirmedWeek)}
                <span class={spanh4}>(+{cntyConfirmedWeekPct}%) Week</span>
              </Heading>
            </Box>
          </Flex>
        </Flex>
        <Flex style={BoxMiddleChange}>
          <Box style={overviewSingleBox}>
            <Heading as="h6" style={middleh6}>Deaths</Heading>
          </Box>
          <Flex style={BoxMiddleChangeLower}>
            <Box style={MiddleChange2}>
              <Heading as="h3" style={deathh3}>
                {insertCommas(cntyDeaths)}
              </Heading>
            </Box>
            <Box style={MiddleChange2}>
              <Heading as="h4" style={deathsh4}>
                +{insertCommas(cntyDeathsDay)}
                <span class={spanh4}>(+{cntyDeathsDayPct}%) Day</span>
              </Heading>
              <Heading as="h4" style={deathsh4}>
                +{insertCommas(cntyDeathsWeek)}
                <span class={spanh4}>(+{cntyDeathsWeekPct}%) Week</span>
              </Heading>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box style={overviewBottomBox}>
        <Text style={btmh6}>
          {@html `Unfortunately, recoveries are not being tracked or are unavailable at this time at
          the state and county level. This means we cannot track progress locally. Thus, the local goal is to keep <strong># of confirmed</strong> as low as possible.`}
        </Text>
      </Box>
    </Flex>
  {:else}
    <Flex style={overviewBox}>
      <Flex style={overviewMiddleBox}>
        <Box style={overviewSingleBox}>
          <Heading as="h6" style={middleh6}>Confirmed</Heading>
          <Heading as="h3" style={confirmh3}>
            {insertCommas(cntyConfirmed)}
          </Heading>
        </Box>
        <Box style={overviewSingleBox}>
          <Heading as="h6" style={middleh6}>Deaths</Heading>
          <Heading as="h3" style={deathh3}>{insertCommas(cntyDeaths)}</Heading>
        </Box>
      </Flex>
      <Box style={overviewBottomBox}>
        <Text style={btmh6}>
          {@html `Unfortunately, recoveries are not being tracked or are unavailable at this time at
          the state and county level. This means we cannot track progress locally. Thus, the local goal is to keep <strong># of confirmed</strong> as low as possible.`}
        </Text>
      </Box>
    </Flex>
  {/if}
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
