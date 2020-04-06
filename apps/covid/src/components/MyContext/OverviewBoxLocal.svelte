<script>
  import { onMount } from 'svelte'
  import {
    Grid,
    Flex,
    Box,
    Heading,
    Text,
  } from '@studiobear/designspek-components'
  import { styled } from '@studiobear/designspek'
  import OverviewBoxLocalCounty from './OverviewBoxLocalCounty.svelte'
  import { insertCommas, capitalize, percentChange } from '../../libs'
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
  $: cntryTstTot = 0
  $: cntryTstPos = 0
  $: cntryTstNeg = 0
  $: cntryTstPen = 0
  $: cntryHspTot = 0
  $: cntryHspCur = 0
  $: cntryIcuCur = 0
  $: cntryVntCur = 0

  $: regActive =
    regionData.Confirmed - (regionData.Deaths + regionData.Recovered) || 0
  $: regRecovered = regionData.Recovered || 0
  $: regConfirmed = regionData.Confirmed || 0
  $: regDeaths = regionData.Deaths || 0
  $: regFatalityRate = (regDeaths / regConfirmed) * 100 || 0
  $: regRecoveryRate = (regRecovered / regConfirmed) * 100 || 0
  $: regConfirmedDayChange = 0
  $: regConfirmedWeekChange = 0
  $: regDeathsDayChange = 0
  $: regDeathsWeekChange = 0
  $: regDeathsDayChangePct = 0
  $: regDeathsWeekChangePct = 0
  $: regActiveDayChange = 0
  $: regActiveWeekChange = 0
  $: regActiveDayChangePct = 0
  $: regActiveWeekChangePct = 0
  $: regConfirmedDayChangePct = 0
  $: regConfirmedWeekChangePct = 0
  $: regTstTot = 0
  $: regTstPos = 0
  $: regTstNeg = 0
  $: regTstPen = 0
  $: regHspTot = 0
  $: regHspCur = 0
  $: regIcuCur = 0
  $: regVntCur = 0

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

  $: overviewBoxActiveChange = {
    ...overviewSingleBox,
    bg: theme.colors.quaternary,
    pb: '1.5rem',
    pt: '0.5rem',
    flexdir: 'column',
  }

  $: BoxActiveChangeLower = {
    flexdir: 'row',
    width: '100%',
  }
  $: ActiveChange1 = {
    w: '46%',
    pl: '2%',
    pr: '1%',
    txtAlign: 'center',
  }
  $: ActiveChange2 = {
    minw: '48%',
    pr: '2%',
    pl: '1%',
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
  $: ovh2 = {
    fontSize: ['3rem', '3rem', '3.5rem', '4rem', '4rem'],
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

  let gridTesting = {
    tempcols: '[first] 1fr [line2] 1fr [end]',
    temprows: [
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
    ],
    gridareas: [
      '"header header" "main1" "main2" "footer footer"',
      '"header header" "main1 main2" "footer footer"',
      '"header header" "main1 main2" "footer footer"',
    ],
    w: '100%',
  }
  let gridRTch = {
    p: ['0.25rem', '0.25rem', '0.5rem', '0.75rem', '0.75rem'],
  }

  let rtHead = {
    area: 'header',
  }
  $: rtMain1 = {
    area: 'main1',
    bg: theme.colors.lightBlue,
  }
  $: rtMain2 = {
    area: 'main2',
    bg: theme.colors.lightGreen,
  }
  let rtFoot = {
    area: 'footer',
  }
  $: gridh6 = {
    txtAlign: 'center',
    color: theme.colors.quaternary,
    fontWeight: 400,
    txtTran: 'uppercase',
    lineHeight: '1.2rem',
  }
  $: gridTxt = {
    txtAlign: 'center',
    color: theme.colors.text,
    m: 0,
  }
  $: gridTxtLg = {
    txtAlign: 'center',
    color: theme.colors.text,
    m: 0,
  }

  $: gridBorderTop = {
    bt: '1px solid',
    brdCol: theme.colors.quaternary,
  }
  let gridLabel = {
    fontSize: '0.8rem',
    txtTran: 'uppercase',
  }

  const API_URL = process.env.API_URL
  const API_CA_COUNTY_FILE = process.env.API_CA_COUNTY_FILE
  const US_STATES_URL = process.env.US_STATES_URL
  const US_URL = process.env.US_URL
  const API_US_STATES_URL = `${API_URL}${US_STATES_URL}`
  const API_CA_COUNTY_URL = `${API_URL}${API_CA_COUNTY_FILE}`

  let dataChange = false
  onMount(async function getData() {
    if (country === 'US') {
      const US_CT = await fetch(US_URL)
      const USStates_CT = await fetch(API_US_STATES_URL)
      const respCA = await fetch(`${API_CA_COUNTY_URL}${regLower}.json`)
      let tempUS = await US_CT.json()
      let tempCT = await USStates_CT.json()
      let tempCA = await respCA.json()
      // console.log('V2 CA CNTY: ', tempCA, regionData)
      console.log('US States CT: ', tempUS[0], tempCT, tempCA)
      let regName = capitalize(tempCA.name)
      cntryTstTot = tempUS[0].totalTestResults
      cntryTstPos = tempUS[0].positive
      cntryTstNeg = tempUS[0].negative
      cntryTstPen = tempUS[0].pending
      cntryHspTot = tempUS[0].hospitalizedCumulative
      cntryHspCur = tempUS[0].hospitalizedCurrently
      cntryIcuCur = tempUS[0].inIcuCurrently
      cntryVntCur = tempUS[0].onVentilatorCurrently
      if (regName === region) {
        regConfirmed = tempCA.confirmed || 0
        regDeaths = tempCA.deaths || 0
        regRecovered = 0
        regActive = regConfirmed - (regDeaths + regRecovered) || 0
        regFatalityRate = (regDeaths / regConfirmed) * 100 || 0
        regRecoveryRate = (regRecovered / regConfirmed) * 100 || 0
        regConfirmedDayChange = tempCA.confirmedDayChange || 0
        regConfirmedWeekChange = tempCA.confirmedWeekChange || 0
        regConfirmedDayChangePct = Math.round(
          percentChange(regConfirmedDayChange, regConfirmed),
        )
        regConfirmedWeekChangePct = Math.round(
          percentChange(regConfirmedWeekChange, regConfirmed),
        )
        regDeathsDayChange = tempCA.deathsDayChange || 0
        regDeathsWeekChange = tempCA.deathsWeekChange || 0
        regDeathsDayChangePct = Math.round(
          percentChange(regDeathsDayChange, regDeaths),
        )
        regDeathsWeekChangePct = Math.round(
          percentChange(regDeathsWeekChange, regDeaths),
        )
        regActiveDayChange = regConfirmedDayChange - regDeathsDayChange
        regActiveWeekChange = regConfirmedWeekChange - regDeathsWeekChange
        regActiveDayChangePct = Math.round(
          percentChange(regActiveDayChange, regActive),
        )
        regActiveWeekChangePct = Math.round(
          percentChange(regActiveWeekChange, regActive),
        )

        const stateCTPos = tempCT.data.map(ctSt => ctSt.name).indexOf(regName)
        const stateCTData = tempCT.data[stateCTPos]

        regTstTot = stateCTData.confirmedTests || 0
        regTstPos = stateCTData.positive || 0
        regTstNeg = stateCTData.negative || 0
        regTstPen = stateCTData.pending || 0
        regHspTot = stateCTData.hospitalizedCum || 'N/A'
        regHspCur = stateCTData.hospitalizedCur || 'N/A'
        regIcuCur = stateCTData.icuCur || 'N/A'
        regVntCur = stateCTData.ventCur || 'N/A'
        updated = tempCA.updated || overview.updated || 'Unknown'
        dataChange = true
      }
    }
  })
</script>

<Flex style={overviewBox}>
  <Box style={overviewSingleBox}>
    <Heading as="h6" style={ovTitle}>Cases Near Me</Heading>
  </Box>
  <Box style={overviewSingleBoxActive}>
    <Heading as="h6" style={h6}>{countryLong} Active Cases</Heading>
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
  {#if country === 'US'}
    <Grid container gridgap={'0rem'} style={gridTesting}>
      <Grid style={[gridRTch, rtHead]}>
        <Heading as="h6" style={middleh6}>
          {country} Testing & Treatment
        </Heading>
      </Grid>
      <Grid style={[gridRTch, rtMain1]}>
        <Heading as="h6" style={gridh6}>Test Stats</Heading>
        <Text style={gridTxt}>
          <Text as="span" style={gridLabel}>positive:</Text>
          {insertCommas(cntryTstPos)}
          <br />
          <Text as="span" style={gridLabel}>negative:</Text>
          {insertCommas(cntryTstNeg)}
          <br />
          <Text as="span" style={gridLabel}>Pending:</Text>
          {insertCommas(cntryTstPen)}
        </Text>
        <Text style={[gridTxt, gridBorderTop]}>
          <Text as="span" style={gridLabel}>Administered (All-time):</Text>
          {insertCommas(cntryTstTot)}
        </Text>
      </Grid>
      <Grid style={[gridRTch, rtMain2]}>
        <Heading as="h6" style={gridh6}>Currently</Heading>
        <Text style={gridTxt}>
          <Text as="span" style={gridLabel}>In hospital:</Text>
          {insertCommas(cntryHspCur)}
          <br />
          <Text as="span" style={gridLabel}>In ICU:</Text>
          {insertCommas(cntryIcuCur)}
          <br />
          <Text as="span" style={gridLabel}>On Ventilator:</Text>
          {insertCommas(cntryVntCur)}
        </Text>
        <Text style={[gridTxt, gridBorderTop]}>
          <Text as="span" style={gridLabel}>Hospitalized (All-time):</Text>
          {insertCommas(cntryHspTot)}
        </Text>
      </Grid>
      <Grid style={[gridRTch, rtFoot]}>
        <Text>
          Testing & Treatment stats are updated daily at 4EST and are originally
          sourced from public health authorities at all levels. Data quality
          fluctuates from state to state.
        </Text>
      </Grid>
    </Grid>
  {/if}
  {#if regionData}
    {#if !dataChange}
      <Box style={overviewSingleBoxActive}>
        <Heading as="h6" style={h6}>{region} Active Cases</Heading>
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
    {:else}
      <Flex style={overviewBoxActiveChange}>
        <Box style={overviewSingleBox}>
          <Heading as="h6" style={h6}>{region} Active Cases</Heading>
        </Box>
        <Flex style={BoxActiveChangeLower}>
          <Box style={ActiveChange1}>
            <Heading as="h2" style={[activeh2, ovh2]}>
              {insertCommas(regActive)}
            </Heading>
          </Box>
          <Box style={ActiveChange2}>
            <Heading as="h4" style={changeh4}>
              +{insertCommas(regActiveDayChange)}
              <span class={spanh4}>(+{regActiveDayChangePct}%) Day</span>
            </Heading>
            <Heading as="h4" style={changeh4}>
              +{insertCommas(regActiveWeekChange)}
              <span class={spanh4}>(+{regActiveWeekChangePct}%) Week</span>
            </Heading>
          </Box>
        </Flex>
      </Flex>
      <Flex style={changeMiddleBox}>
        <Flex style={BoxMiddleChange}>
          <Box style={overviewSingleBox}>
            <Heading as="h6" style={middleh6}>{regionShort} Confirmed</Heading>
          </Box>
          <Flex style={BoxMiddleChangeLower}>
            <Box style={MiddleChange1}>
              <Heading as="h3" style={confirmh3}>
                {insertCommas(regConfirmed)}
              </Heading>
            </Box>
            <Box style={MiddleChange1}>
              <Heading as="h4" style={confirmh4}>
                +{insertCommas(regConfirmedDayChange)}
                <span class={spanh4}>(+{regConfirmedDayChangePct}%) Day</span>
              </Heading>
              <Heading as="h4" style={confirmh4}>
                +{insertCommas(regConfirmedWeekChange)}
                <span class={spanh4}>(+{regConfirmedWeekChangePct}%) Week</span>
              </Heading>
            </Box>
          </Flex>
        </Flex>
        <Flex style={BoxMiddleChange}>
          <Box style={overviewSingleBox}>
            <Heading as="h6" style={middleh6}>{regionShort} Deaths</Heading>
          </Box>
          <Flex style={BoxMiddleChangeLower}>
            <Box style={MiddleChange2}>
              <Heading as="h3" style={deathh3}>
                {insertCommas(regDeaths)}
              </Heading>
            </Box>
            <Box style={MiddleChange2}>
              <Heading as="h4" style={deathsh4}>
                +{insertCommas(regDeathsDayChange)}
                <span class={spanh4}>(+{regDeathsDayChangePct}%) Day</span>
              </Heading>
              <Heading as="h4" style={deathsh4}>
                +{insertCommas(regDeathsWeekChange)}
                <span class={spanh4}>(+{regDeathsWeekChangePct}%) Week</span>
              </Heading>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    {/if}
    {#if country === 'US'}
      <Grid container gridgap={'0rem'} style={gridTesting}>
        <Grid style={[gridRTch, rtHead]}>
          <Heading as="h6" style={middleh6}>
            {region} Testing & Treatment
          </Heading>
        </Grid>
        <Grid style={[gridRTch, rtMain1]}>
          <Heading as="h6" style={gridh6}>Test Stats</Heading>
          <Text style={gridTxt}>
            <Text as="span" style={gridLabel}>positive:</Text>
            {insertCommas(regTstPos)}
            <br />
            <Text as="span" style={gridLabel}>negative:</Text>
            {insertCommas(regTstNeg)}
            <br />
            <Text as="span" style={gridLabel}>Pending:</Text>
            {insertCommas(regTstPen)}
          </Text>
          <Text style={[gridTxt, gridBorderTop]}>
            <Text as="span" style={gridLabel}>Administered (All-time):</Text>
            {insertCommas(regTstTot)}
          </Text>
        </Grid>
        <Grid style={[gridRTch, rtMain2]}>
          <Heading as="h6" style={gridh6}>Currently</Heading>
          <Text style={gridTxt}>
            <Text as="span" style={gridLabel}>In hospital:</Text>
            {insertCommas(regHspCur)}
            <br />
            <Text as="span" style={gridLabel}>In ICU:</Text>
            {insertCommas(regIcuCur)}
            <br />
            <Text as="span" style={gridLabel}>On Ventilator:</Text>
            {insertCommas(regVntCur)}
          </Text>
          <Text style={[gridTxt, gridBorderTop]}>
            <Text as="span" style={gridLabel}>Hospitalized (All-time):</Text>
            {insertCommas(regHspTot)}
          </Text>
        </Grid>
      </Grid>
    {/if}
  {/if}
  {#if region === 'California'}
    <OverviewBoxLocalCounty {theme} {county} {region} />
  {/if}
  <Text style={ovUpdated}>Local data updated: {updated}</Text>
</Flex>
