<script>
  import { Flex, Box, Heading, Text } from '@studiobear/designspek-components'
  import { theme } from '../theme'

  $: flexStyle = {
    flexdir: 'column',
    mb: '4rem',
    mt: '4rem',
    px: ['1.5rem', '1.5rem', '1.5rem', '1.5rem', '2rem'],
  }

  $: headerStyle = {
    bg: $theme.colors.background,
    fontSize: '3rem',
    lineHeight: '3rem',
    fontWeight: 300,
    textAlign: 'center',
    px: '1rem',
    my: '1rem',
    color: $theme.colors.tertiary,
  }
</script>

<svelte:head>
  <title>About the App</title>
</svelte:head>

<Flex style={flexStyle}>
  <h1>About the App</h1>

  <h3>Data Sources</h3>
  <ul>
    <li>
      <a
        href="https://coronavirus-disasterresponse.hub.arcgis.com/"
        target="_blank">
        esri COVID-19 GIS Hub
      </a>
    </li>
    <li>
      <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">
        John Hopkins University CSSE data sources Github repository
      </a>
    </li>
  </ul>

  <h3>Resources</h3>
  <ul>
    <li>
      Hosting by
      <a href="https://www.netlify.com/" target="_blank">Netlify</a>
    </li>
    <li>
      Continuouse Integration/Deployment provided by
      <a href="https://semaphoreci.com/" target="_blank">Semaphore CI</a>
    </li>
    <li>
      Icons made by
      <a href="https://www.flaticon.com/authors/freepik" target="_blank">
        Freepik
      </a>
      from
      <a href="https://flaticon.com" target="_blak">flaticon.com</a>
    </li>
  </ul>

  <h3>Technical</h3>
  <ul>
    <li>
      This project is opensource and can be found on Github in the
      <a
        href="https://github.com/Studiobear/core/tree/master/apps/covid"
        target="_blank">
        Studiobear monorepo
      </a>
    </li>
    <li>
      Powered with
      <a href="https://svelte.dev/" target="_blank">Svelte</a>
      and
      <a href="https://sapper.svelte.dev/" target="_blank">Sapper</a>
    </li>
    <li>
      Utilizes reactive design specifications and Svelte-based components from
      <a href="https://github.com/Studiobear/designspek" target="_blank">
        Designspek
      </a>
    </li>
  </ul>

  <h3>Inspiration</h3>
  <ul>
    <li>
      <a
        href="https://www.arcgis.com/apps/opsdashboard/index.html"
        target="_blank">
        Coronavirus COVID-19 Global Cases by the Center for Systems Science and
        Engineering (CSSE) at Johns Hopkins University (JHU)
      </a>
    </li>
    <li>
      Plague, Inc screenshot:
      <a
        href="https://www.mobygames.com/game/windows-phone/plague-inc/screenshots/gameShotId,945108/"
        target="_blank">
        Moby Games
      </a>
    </li>
  </ul>
</Flex>
