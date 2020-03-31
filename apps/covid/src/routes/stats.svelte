<script>
  import { onMount } from 'svelte'
  import { styled } from '@studiobear/designspek'
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import sortObjectsArray from 'sort-objects-array'
  import { theme } from '../theme'

  import { C19Stats } from '../libs'
  import { Loading, TableGlobal, MyStatsContext } from '../components'

  $: data = []
  let statsGlobal
  let error = false
  let loading = true

  let url =
    'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?f=json&where=Confirmed%20%3E%200&outFields=Country_Region,Province_State,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active&returnGeometry=true'

  $: flexMain = {
    flexdir: 'column',
    pt: '4rem',
    maxw: '100vw',
  }
  $: flexStyle = {
    flexdir: 'column',
    mt: '0.5rem',
    maxw: '100vw',
    pb: '3rem',
  }
  $: headerStyle = {
    bg: $theme.colors.background,
    fontSize: '3rem',
    lineHeight: '3rem',
    fontWeight: 300,
    textAlign: 'center',
    px: '1rem',
    mt: '1rem',
    mb: 0,
  }

  onMount(async () => {
    let combined = {}
    const resp = await fetch(url)
    let temp = await resp.json()
    if (temp.error) {
      error = true
      loading = false
    } else {
      let records = temp['features']
      statsGlobal = await C19Stats(records)
      loading = false
    }
  })
</script>

<Flex style={flexMain}>
  <Heading as="h1" style={headerStyle}>Context is Everything</Heading>
</Flex>
<Flex style={flexStyle}>
  <TableGlobal {statsGlobal} theme={$theme} {error} {loading} />
</Flex>
<Flex style={flexStyle}>
  <MyStatsContext {statsGlobal} theme={$theme} {error} {loading} />
</Flex>
