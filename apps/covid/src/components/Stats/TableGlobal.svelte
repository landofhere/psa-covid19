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

  import { fatalityRate, recoveryRate } from '../../libs'
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
  export let error = false
  export let loading = true
  export let loading2 = true
  export let statsGlobal
  // $: console.log(statsGlobal, error, loading)

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

  $: data = statsGlobal
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
  $: sortedSymb = '&nbsp;▼'

  const sortData = sortBy => {
    let opts = sorted === 'desc' ? '' : 'desc'
    sorted = sorted === 'desc' ? '' : 'desc'
    sortedSymb = sorted === 'desc' ? '&nbsp;▼' : '&nbsp;▲'
    switch (sortBy) {
      case 'country':
        colSorted = 'country'
        return (sData = sortObjectsArray(data.data, 'Name', opts))
        break
      case 'confirmed':
        colSorted = 'confirmed'
        return (sData = sortObjectsArray(data.data, 'Confirmed', opts))
        break
      case 'recovered':
        colSorted = 'recovered'
        return (sData = sortObjectsArray(data.data, 'Recovered', opts))
        break
      case 'deaths':
        colSorted = 'deaths'
        return (sData = sortObjectsArray(data.data, 'Deaths', opts))
        break
      default:
        colSorted = 'active'
        return (sData = sortObjectsArray(data.data, 'Active', opts))
    }
  }
  $: {
    if (!error & !loading) {
      total_confirmed = data.totalConfirmed
      total_active = data.totalActive
      total_recovered = data.totalRecovered
      total_deaths = data.totalDeaths
      total_fatality_rate = data.totalFatalityRate
      total_recovery_rate = data.totalRecoveryRate
      last_updated = data.lastUpdated

      sortData('active')
      loading2 = false
    }
  }
</script>

<Heading as="h2" style={H2}>Cases By Country:</Heading>

<Box style={tableContainer}>
  <Table fixed style={tableGlobal}>
    <THead as="colGroup">
      <col style={colCountry} />
      <col style={colStat} />
      <col style={colStat} />
      <col style={colStat} />
      <col style={colStat} />
      <col style={colStat} />
      <col style={colStat} />
    </THead>
    <THead as="thead" style={tableHeader}>
      <TR>
        <THead style={thCountry} on:click={() => sortData('country')}>
          Country Name
          <span>
            {#if colSorted === 'country'}
              {@html sortedSymb}
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
        <THead style={th} on:click={() => sortData('confirmed')}>
          Confirmed
          <span>
            {#if colSorted === 'confirmed'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('fatality')}>
          Fatality Rate
          <span>
            {#if colSorted === 'fatality'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('recovery')}>
          Recovery Rate
          <span>
            {#if colSorted === 'recovery'}
              {@html sortedSymb}
            {:else}&nbsp;&nbsp;{/if}
          </span>
        </THead>
        <THead style={th} on:click={() => sortData('recovered')}>
          Recovered
          <span>
            {#if colSorted === 'recovered'}
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
      </TR>
      {#if !error && !loading2}
        <TR style={thGlobal}>
          <TD {theme} style={[tdCountry, thGlobal]}>Global</TD>
          <TD
            {theme}
            style={[td, thGlobal, total_recovered > total_active && lPurple]}>
            {total_active}
          </TD>
          <TD {theme} style={[td, thGlobal]}>{total_confirmed}</TD>
          <TD {theme} style={[td, thGlobal]}>
            {total_fatality_rate.toFixed(2)}%
          </TD>
          <TD {theme} style={[td, thGlobal]}>
            {total_recovery_rate.toFixed(2)}%
          </TD>
          <TD
            {theme}
            style={[td, thGlobal, total_recovered > total_active && lPurple]}>
            {total_recovered}
          </TD>
          <TD {theme} style={[td, thGlobal]}>{total_deaths}</TD>
        </TR>
      {/if}
    </THead>
    <TBody style={tableBody}>
      {#if !error && loading2}
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
      {#if error && !loading2}
        <TR>
          <TD colspan="7" {theme} style={[td, tableError]}>
            We're sorry, the data wasn't able to be loaded at this time.
          </TD>
        </TR>
      {/if}
      {#if !error && !loading}
        {#each Object.keys(sData) as item}
          <TR
            {theme}
            style={sData[item]['Recovered'] > sData[item]['Active'] && lBlue}>
            <TD {theme} style={tdCountry}>
              {String(JSON.stringify(sData[item]['Name'])).replace(/"/g, '')}
            </TD>
            <TD style={td}>{JSON.stringify(sData[item]['Active'])}</TD>
            <TD style={td}>{JSON.stringify(sData[item]['Confirmed'])}</TD>
            <TD
              {theme}
              style={[td, fatalityRate(sData[item]) > total_fatality_rate && lRed, fatalityRate(sData[item]) < total_fatality_rate && lGreen]}>
              {fatalityRate(sData[item]).toFixed(2)}%
            </TD>
            <TD
              style={[td, recoveryRate(sData[item]) < total_recovery_rate && lYellow, recoveryRate(sData[item]) > total_recovery_rate && lGreen]}>
              {recoveryRate(sData[item]).toFixed(2)}%
            </TD>
            <TD {theme} style={td}>
              {JSON.stringify(sData[item]['Recovered'])}
            </TD>
            <TD style={td}>{JSON.stringify(sData[item]['Deaths'])}</TD>
          </TR>
        {/each}
      {/if}
    </TBody>
  </Table>
</Box>
<Table style={legendBody}>
  <THead as="thead">
    <TR>
      <THead {theme} style={[td, legendTh, lBlue]}>
        More Recovered than active
      </THead>
      <THead {theme} style={[td, legendTh, lYellow]}>
        Lower Avg Recoveries
      </THead>
      <THead {theme} style={[td, legendTh, lRed]}>Higher Avg Fatalities</THead>
      <THead {theme} style={[td, legendTh, lGreen]}>
        Higher Avg Recoveries OR Lower Avg Fatalities
      </THead>
    </TR>
  </THead>
</Table>
{#if !error && !loading}
  <Text style={{ txtAlign: 'center' }}>Last Updated: {last_updated}</Text>
{/if}
