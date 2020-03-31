<script>
  import {
    Heading,
    Text,
    Table,
    THead,
    TBody,
    TR,
    TD,
    Box,
  } from '@studiobear/designspek-components'
  import sortObjectsArray from 'sort-objects-array'

  import {
    fatalityRate,
    recoveryRate,
    internalizeCountryName,
  } from '../../libs'
  import Loading from '../Loading.svelte'
  import {
    H2,
    H4,
    table,
    tableContainer,
    tableHeader,
    tableBody,
  } from './styles'
  import TableRegional from './TableRegional.svelte'
  import TableSubRegional from './TableSubRegional.svelte'

  export let theme = $$props.theme || {}
  export let error = false
  export let loading = true
  export let loading2 = true
  export let local
  export let statsGlobal
  let dataCountry
  let dataRegion
  $: console.log('TableRegional:', statsGlobal, local, error, loading)

  $: data = statsGlobal
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

  $: countryDataLoaded = false
  let getCountryData = data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].Name == country || data[i].Name == countryLong) {
        dataCountry = data[i]
        countryDataLoaded = true
        break
      }
    }
  }
  $: {
    console.log('TR status', error, loading, data)
    if (!error && !loading && data) {
      getCountryData(data.data)
    }
  }

  $: console.log(
    'TableRegional Names:',
    country,
    countryLong,
    region,
    regionShort,
    county,
  )

  $: countryData = dataCountry || false
  $: rawRegionData = countryData ? countryData.SubRegion || false : false

  $: regionData = []

  $: regionDataLoaded = false
  let getRegionData = data => {
    regionData = internalizeCountryName(data)
    console.log('regionData:', regionData)
    regionDataLoaded = true
    return
  }

  $: {
    if (countryDataLoaded && regionData) {
      getRegionData(rawRegionData)
    }
  }

  const legendBody = { w: ['100%', '100%', 'auto', 'auto', 'auto'] }
  $: legendTh = {
    ...td,
    display: ['block', 'block', 'table-cell', 'table-cell', 'table-cell'],
    fontSize: '0.8rem',
    color: theme.colors.text,
    px: ['0.75rem', '0.75rem', '0.5rem', '0.5rem', '0.5rem'],
    py: ['0.25rem', '0.25rem', '0.5rem', '0.5rem', '0.5rem'],
    textAlign: 'center',
  }

  $: lBlue = { bg: theme.colors.lightBlue }
  $: lYellow = { bg: theme.colors.lightYellow }
  $: lRed = { bg: theme.colors.lightRed }
  $: lGreen = { bg: theme.colors.lightGreen }
  $: lPurple = { bg: theme.colors.lightPurple }

  const tableGlobal = { minw: '30rem' }
  const colCountry = { w: '22%' }
  const colStat = { w: '13%' }

  $: th = {
    pos: 'sticky',
    t: 0,
    color: theme.colors.background,
    p: ['0.25rem', '0.25rem', '0.5rem', '0.75rem', '0.75rem'],
    bg: theme.colors.quaternary,
    txtAlign: 'center',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    verticalAlign: 'middle',
  }

  $: thCountry = {
    pos: 'sticky',
    t: 0,
    color: theme.colors.background,
    py: ['0.25rem', '0.25rem', '0.5rem', '0.75rem', '0.75rem'],
    pyx: ['0.5rem', '0.5rem', '0.75rem', '1rem', '1rem'],
    bg: theme.colors.quaternary,
    txtAlign: 'right',
    pr: '0.5rem',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    verticalAlign: 'middle',
  }

  $: thGlobal = {
    pos: 'sticky',
    t: ['1.6275rem', '1.6275rem', '2.125rem', '2.625rem', '2.625rem'],
    bg: theme.colors.muted,
  }

  $: tableError = {
    py: '2rem',
    px: '4rem',
    bg: theme.colors.lightYellow,
  }
  $: tableLoading = {
    p: '2rem',
    bg: theme.colors.background,
    txtAlign: 'center',
  }

  $: td = {
    color: theme.colors.text,
    p: ['0.25rem', '0.25rem', '0.5rem', '0.75rem', '0.75rem'],
    wordBreak: 'break-word',
    txtAlign: 'center',
  }
  $: tdCountry = {
    color: theme.colors.text,
    p: ['0.25rem', '0.25rem', '0.5rem', '0.75rem', '0.75rem'],
    wordBreak: 'break-word',
    txtAlign: 'right',
    pr: '0.5rem',
  }
  $: loadStyle = {
    animation: 'spin 6s infinite',
  }

  $: sorted = ''
  $: colSorted = 'active'

  let total_confirmed
  let total_active
  let total_recovered
  let total_deaths
  let total_fatality_rate
  let total_recovery_rate
  let last_updated
  $: sData = []

  const sortData = sortBy => {
    let opts = sorted === 'desc' ? '' : 'desc'
    sorted = sorted === 'desc' ? '' : 'desc'
    switch (sortBy) {
      case 'country':
        colSorted = 'region'
        return (sData = sortObjectsArray(regionData, 'Name', opts))
        break
      case 'confirmed':
        colSorted = 'confirmed'
        return (sData = sortObjectsArray(regionData, 'Confirmed', opts))
        break
      case 'recovered':
        colSorted = 'recovered'
        return (sData = sortObjectsArray(regionData, 'Recovered', opts))
        break
      case 'deaths':
        colSorted = 'deaths'
        return (sData = sortObjectsArray(regionData, 'Deaths', opts))
        break
      default:
        colSorted = 'active'
        return (sData = sortObjectsArray(regionData, 'Active', opts))
    }
  }
  $: {
    if (countryDataLoaded && regionDataLoaded) {
      total_confirmed = countryData.Confirmed
      total_active = countryData.Active
      total_recovered = countryData.Recovered
      total_deaths = countryData.Deaths
      total_fatality_rate = fatalityRate(countryData)
      total_recovery_rate = recoveryRate(countryData)
      let updated = new Date(countryData.Updated)
      last_updated = `${updated.toLocaleDateString()} ${updated.toLocaleTimeString()}`

      sortData('confirmed')
      loading2 = false
    }
  }
</script>

<TableRegional
  {countryData}
  {regionData}
  {theme}
  loading={!countryDataLoaded && !regionDataLoaded}
  countryName={countryLong}
  updated={last_updated} />

<TableSubRegional
  {regionData}
  regionName={region}
  countyName={county}
  loading={!countryDataLoaded && !regionDataLoaded}
  {theme} />
