<script>
  import { onMount } from 'svelte'
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
  import { styled } from '@studiobear/designspek'
  import sortObjectsArray from 'sort-objects-array'

  import {
    fatalityRate,
    recoveryRate,
    calcC19CACountyStats,
    insertCommas,
    internalizeCountryName,
    percentChange,
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

  export let theme = $$props.theme || {}

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
  const colCountry = { w: '20%' }
  const colStat = { w: '10%' }
  const colChange = { w: '23%' }

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

  $: pctSpan = styled(
    {
      fontSize: '0.8rem',
      color: theme.colors.tertiary,
    },
    theme,
  )

  $: sorted = ''
  $: colSorted = 'active'

  const API_URL = process.env.API_URL
  const API_CA_COUNTY_FILE = process.env.API_CA_COUNTY_FILE
  const CA_COUNTY_URL_V3 = process.env.CA_COUNTY_URL_V3
  const CACountyURL = `${API_URL}${API_CA_COUNTY_FILE}${CA_COUNTY_URL_V3}`

  export let regionName
  export let countyName

  let countyShort = countyName.replace(' County', '')
  let regionUpper = regionName.toUpperCase()

  let totalConfirmed
  let totalConfirmedDay
  let totalConfirmedDayPct
  let totalConfirmedWeek
  let totalConfirmedWeekPct
  let totalActive
  let totalActiveDay
  let totalActiveDayPct
  let totalActiveWeek
  let totalActiveWeekPct
  let totalRecovered
  let totalDeaths
  let totalDeathsDay
  let totalDeathsDayPct
  let totalDeathsWeek
  let totalDeathsWeekPct
  let totalFatalityRate
  let totalRecoveryRate
  let cntyUpdated
  let countyLoading = true

  $: subRegionData = []
  $: sData = []
  $: sortedSymb = '&nbsp;▼'

  const sortData = sortBy => {
    let opts = sorted === 'desc' ? '' : 'desc'
    sorted = sorted === 'desc' ? '' : 'desc'
    sortedSymb = sorted === 'desc' ? '&nbsp;▼' : '&nbsp;▲'
    switch (sortBy) {
      case 'region':
        colSorted = 'region'
        return (sData = sortObjectsArray(subRegionData.data, 'Name', opts))
        break
      case 'confirmed':
        colSorted = 'confirmed'
        return (sData = sortObjectsArray(subRegionData.data, 'Confirmed', opts))
        break
      case 'recovered':
        colSorted = 'recovered'
        return (sData = sortObjectsArray(subRegionData.data, 'Recovered', opts))
        break
      case 'deaths':
        colSorted = 'deaths'
        return (sData = sortObjectsArray(subRegionData.data, 'Deaths', opts))
        break
      case 'activeChange':
        colSorted = 'activeChange'
        return (sData = sortObjectsArray(subRegionData.data, 'Confirmed', opts))
        break
      case 'deathsChange':
        colSorted = 'deathsChange'
        return (sData = sortObjectsArray(subRegionData.data, 'Deaths', opts))
        break
      default:
        colSorted = 'active'
        return (sData = sortObjectsArray(subRegionData.data, 'Active', opts))
    }
  }

  onMount(async function getData() {
    const resp = await fetch(CACountyURL)
    subRegionData = await resp.json()
    let regionTotals = subRegionData.data.filter(
      reg => reg.name === regionUpper,
    )
    totalConfirmed = regionTotals[0].cases.total
    totalConfirmedDay = regionTotals[0].cases.dayChange
    totalConfirmedWeek = regionTotals[0].cases.weekChange
    totalDeaths = regionTotals[0].deaths.total
    totalDeathsDay = regionTotals[0].deaths.dayChange
    totalDeathsWeek = regionTotals[0].deaths.weekChange
    totalDeathsDayPct = percentChange(totalDeathsDay, totalDeaths)
    totalDeathsWeekPct = percentChange(totalDeathsWeek, totalDeaths)
    totalActive = totalConfirmed - totalDeaths
    totalActiveDay =
      regionTotals[0].cases.dayChange - regionTotals[0].deaths.dayChange
    totalActiveWeek =
      regionTotals[0].cases.weekChange - regionTotals[0].deaths.weekChange
    totalActiveDayPct = percentChange(totalActiveDay, totalActive)
    totalActiveWeekPct = percentChange(totalActiveWeek, totalActive)
    totalRecovered = 0

    console.log(
      'RegionStats: ',
      subRegionData.data
    )

    totalFatalityRate = (regionTotals[0].deaths / regionTotals[0].cases) * 100
    totalRecoveryRate = 0.0
    cntyUpdated = subRegionData.updated
    await sortData('region')
    countyLoading = false
  })
</script>

<Heading as="h2" style={H2}>
  {regionName ? `${regionName} Cases` : 'Loading cases...'}
</Heading>
<Box style={tableContainer}>
  <Table fixed style={tableGlobal}>
    <THead as="colGroup">
      <col style={colCountry} />
      <col style={colStat} />
      <col style={colChange} />
      <col style={colStat} />
      <col style={colStat} />
      <col style={colChange} />
    </THead>
    <THead as="thead" style={tableHeader}>
      <TR>
        <THead style={thCountry} on:click={() => sortData('region')}>
          County Name
          <span>
            {#if colSorted === 'region'}
              {@html sorted !== 'desc' ? '&nbsp;▼' : '&nbsp;▲'}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('active')}>
          Active
          <span>
            {#if colSorted === 'active'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('activeChange')}>
          Active Change
          <span>
            {#if colSorted === 'activeChange'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('confirmed')}>
          Confirmed
          <span>
            {#if colSorted === 'confirmed'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('deaths')}>
          Deaths
          {#if colSorted === 'deaths'}
            {@html sortedSymb}
          {:else}&nbsp;&nbsp;{/if}
        </THead>
        <THead style={th} on:click={() => sortData('deathsChange')}>
          Deaths Change
          {#if colSorted === 'deathsChange'}
            {@html sortedSymb}
          {:else}&nbsp;&nbsp;{/if}
        </THead>
      </TR>
      {#if !countyLoading}
        <TR style={thGlobal}>
          <TD {theme} style={[tdCountry, thGlobal]}>{regionName}</TD>
          <TD
            {theme}
            style={[td, thGlobal, totalRecovered > totalActive && lPurple]}>
            {insertCommas(totalActive)}
          </TD>
          <TD {theme} style={[td, thGlobal]}>
            +{insertCommas(totalActiveDay)}
            <span class={pctSpan}>(+{Math.round(totalActiveDayPct)}%) Day</span>
            {@html '<br>'}
            +{insertCommas(totalActiveWeek)}
            <span class={pctSpan}>
              (+{Math.round(totalActiveWeekPct)}%) Week
            </span>
          </TD>
          <TD {theme} style={[td, thGlobal]}>
            {insertCommas(+totalConfirmed)}
          </TD>
          <TD {theme} style={[td, thGlobal]}>{totalDeaths}</TD>
          <TD {theme} style={[td, thGlobal]}>
            +{insertCommas(totalDeathsDay)}
            <span class={pctSpan}>(+{Math.round(totalDeathsDayPct)}%) Day</span>
            {@html '<br>'}
            +{insertCommas(totalDeathsWeek)}
            <span class={pctSpan}>
              (+{Math.round(totalDeathsWeekPct)}%) Week
            </span>
          </TD>
        </TR>
      {/if}
    </THead>
    <TBody style={tableBody}>
      {#if countyLoading}
        <TR>
          <TD {theme} style={[tableLoading, td]}>&nbsp;</TD>
          <TD {theme} style={td}>&nbsp;</TD>
          <TD {theme} colspan="3" style={[td, tableLoading]}>
            <Loading {theme} fill={theme.colors.secondary} style={loadStyle} />
          </TD>
          <TD {theme} style={td}>&nbsp;</TD>
          <TD {theme} style={td}>&nbsp;</TD>
        </TR>
      {/if}
      {#if !countyLoading}
        {#each Object.keys(sData) as item}
          {#if sData[item].name !== 'CALIFORNIA' && sData[item].name !== 'NA/CDC' && sData[item].name !== 'BAY AREA'}
            <TR>
              <TD {theme} style={tdCountry}>
                {String(JSON.stringify(sData[item].name)).replace(/"/g, '')}
              </TD>
              <TD style={td}>
                {insertCommas(+sData[item].cases.total - +sData[item].deaths.total)}
              </TD>
              <TD style={td}>
                +{insertCommas(sData[item].cases.dayChange - sData[item].deaths.dayChange)}
                <span class={pctSpan}>
                  (+{Math.round(percentChange(sData[item].cases.dayChange - sData[item].deaths.dayChange, sData[item].cases.total - sData[item].deaths.total))}%)
                  Day
                </span>
                {@html '<br>'}
                +{insertCommas(sData[item].cases.weekChange - sData[item].deaths.weekChange)}
                <span class={pctSpan}>
                  (+{Math.round(percentChange(sData[item].cases.weekChange - sData[item].deaths.weekChange, sData[item].cases.total - sData[item].deaths.total))}%)
                  Week
                </span>
              </TD>
              <TD style={td}>{insertCommas(+sData[item].cases.total)}</TD>
              <TD style={td}>{insertCommas(+sData[item].deaths.total)}</TD>
              <TD style={td}>
                +{insertCommas(sData[item].deaths.dayChange)}
                <span class={pctSpan}>
                  (+{Math.round(percentChange(sData[item].deaths.dayChange, sData[item].deaths.total))}%)
                  Day
                </span>
                {@html '<br>'}
                Week: +{insertCommas(sData[item].deaths.weekChange)}
                <span class={pctSpan}>
                  (+{Math.round(percentChange(sData[item].deaths.weekChange, sData[item].deaths.total))}%)
                  Week
                </span>
              </TD>

            </TR>
          {/if}
        {/each}
      {/if}
    </TBody>
  </Table>
</Box>
<Table style={legendBody}>
  <THead as="thead">
    <TR>
      <THead {theme} style={[td, legendTh, lRed]}>
        Higher than Average Fatalities
      </THead>
      <THead {theme} style={[td, legendTh, lGreen]}>
        Lower than Average Fatalities
      </THead>
    </TR>
  </THead>
</Table>
{#if !countyLoading}
  <Text style={{ txtAlign: 'center' }}>Last Updated: {cntyUpdated}</Text>
{/if}
