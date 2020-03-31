<script>
  import { Flex, Heading, Text } from '@studiobear/designspek-components'
  import { theme } from '../theme'

  $: flexStyle = {
    flexdir: 'column',
    py: '4rem',
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
  }
</script>

<svelte:head>
  <title>Why</title>
</svelte:head>

<Flex style={flexStyle}>
  <Heading as="h1" style={headerStyle}>Why?</Heading>

  <Text style={{ color: $theme.colors.tertiary }}>
    This
    <strong>Public Service Application: COVID-19</strong>
    manifested from a curiousity brought about by informational context
    perceived by the initial viewing of the
    <a
      href="https://www.arcgis.com/apps/opsdashboard/index.html"
      target="_blank">
      <em>Coronavirus COVID-19 Global Cases</em>
    </a>
    web application by the Center for Systems Science and Engineering (CSSE) at
    Johns Hopkins University(JHU). I immediately conflated this real world
    conflict with that of a global pathogen strategy/simulation game called
    <a href="https://www.ndemiccreations.com/en/22-plague-inc">
      <em>Plague, Inc.</em>
    </a>
    In
    <em>Plague, Inc.</em>
    , the player takes the role of a pathogen like a bacteria, parasite or virus
    and the goal is to infect, evolve and ultimately eradicate humanity.
    Long-story short, in a brief few seconds, an initial response to the
    COVID-19 Global Cases app conjured up an uncomfortable sense of potential
    doom.
  </Text>
  <Text style={{ color: $theme.colors.tertiary }}>
    Like many in this grand Age of Information, I turned to search engines and,
    surely, answers at my finger tips. I was wrong.
  </Text>
  <Heading as="h4" style={{ color: $theme.colors.tertiary }}>
    To be continued...
  </Heading>
</Flex>
