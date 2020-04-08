<script>
  import { onMount } from 'svelte'
  import { styled } from '@studiobear/designspek'
  import Image from 'svelte-image'
  import {
    Flex,
    Box,
    Heading,
    Text,
    Card,
    CardHead,
    CardBody,
  } from '@studiobear/designspek-components'
  import { theme } from '../theme'
  import { Nav, SSR, OverviewBoxGlobal, Icon, MyContext, CareCards } from '../components'

  import { fatalityRate, recoveryRate, C19Stats } from '../libs'

  let ssr = true
  let data = []
  let statsGlobal = []
  let total_deaths = 0
  let total_confirmed = 0
  let total_active = 0
  let total_recovered = 0
  let total_fatality_rate = 0
  let total_recovery_rate = 0
  let total_compare = 0
  let last_updated = 0
  let overview = {}

  let url =
    'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?where=1%3D1&outFields=Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths&orderByFields=Confirmed%20DESC&f=json'

  $: flexStyle = {
    flexdir: 'column',
    py: '4rem',
  }
  $: headerStyle = {
    bg: $theme.colors.background,
    fontSize: '3rem',
    lineHeight: '3rem',
    fontWeight: 300,
    textAlign: 'center',

    px: '1rem',
    my: '1rem',
  }

  $: banner = styled(
    {
      w: '100%',
      h: 'auto',
    },
    $theme,
  )
  $: bannerProps = ssr ? { style: banner } : { class: banner }
  let emphasisCard = {
    bg: $theme.colors.tertiary,
  }
  let h3Emphasis = {
    fontWeight: 700,
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: '3rem',
    my: '1rem',
    color: $theme.colors.background,
  }
  let icon = {
    w: '6rem',
    h: 'auto',
    mr: '1rem',
  }
  onMount(async function getData() {
    ssr = false
    let combined = {}
    const resp = await fetch(url)
    let temp = await resp.json()
    // let temp = {}
    let records = temp['features']
    if (records) statsGlobal = await C19Stats(records)

    overview = {
      confirmed: statsGlobal.totalConfirmed,
      active: statsGlobal.totalActive,
      recovered: statsGlobal.totalRecovered,
      deaths: statsGlobal.totalDeaths,
      fatalityRate: statsGlobal.totalFatalityRate,
      recoveryRate: statsGlobal.totalRecoveryRate,
      updated: statsGlobal.lastUpdated,
    }
    data = statsGlobal.data
  })
</script>

<Flex style={flexStyle}>
  <Box style={{ h: 'auto', objectFit: 'cover' }}>
    <Image
      class={banner}
      src="23313_lores.jpg"
      width="700"
      height="454"
      alt="Computer generated rendering of Covid 19 [Source: CDC Public Health
      Image Library (https://phil.cdc.gov/)]" />
    <!--
    <img
      src="23313_lores.jpg"
      width="700"
      height="454"
      {...bannerProps}
       />
       -->
  </Box>
  <Heading as="h1" style={headerStyle} {ssr}>Keep Calm & Stay Informed</Heading>
  <OverviewBoxGlobal {overview} theme={$theme} {ssr} />
  <MyContext {overview} {data} theme={$theme} {ssr} />
  <CareCards theme={$theme} {ssr} />
</Flex>
