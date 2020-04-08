<script>
  import {
    Grid,
    Flex,
    Box,
    Heading,
    Text,
    Card,
    CardHead,
    CardBody,
  } from '@studiobear/designspek-components'
  import { Icon } from '../shared'

  export let theme = $$props.theme || {}
  export let ssr = $$props.ssr || {}

  $: gridStyle = {
    py: '4rem',
    tempcols: '[first] 1fr [line2] 1fr [end]',
    temprows: [
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
      '[row1-start] auto [row1-end] auto [row2-end] auto [row-end]',
    ],
    gridareas: [
      '"header header" "emphasis emphasis"',
      '"header header" "emphasis emphasis"',
      '"header header" "emphasis emphasis"',
    ]
  }
  $: flexStyle = {
    area: 'main',
    flexdir: ['column','column', 'row', 'row', 'row']
  }
  $: headerStyle = {
    area: 'header',
    bg: theme.colors.background,
    fontSize: '3rem',
    lineHeight: '3rem',
    fontWeight: 300,
    textAlign: 'center',

    px: '1rem',
    my: '1rem',
  }

  let emphasisCard = {
    area: 'emphasis',
    bg: theme.colors.tertiary,
  }
  let h3Emphasis = {
    fontWeight: 700,
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: '3rem',
    my: '1rem',
    color: theme.colors.background,
  }
  let icon = {
    w: '6rem',
    h: 'auto',
    mr: '1rem',
    maxw: '4rem'
  }
</script>

<Grid container style={gridStyle} {ssr} >
  <Heading as="h1" style={headerStyle} {ssr} >Take Care & Stay Aware</Heading>
  <Card theme={theme} style={emphasisCard}>
    <CardBody>
      <Heading as="h3" style={h3Emphasis}>
        The best way to protect yourself and everyone else is to avoid being
        exposed to the virus.
      </Heading>
    </CardBody>
  </Card>
    <Card theme={theme}>
      <CardHead>
        <Icon name="infection" style={icon} fill={theme.colors.tertiary} />
        <Heading as="h3">Social Distancing for the Win</Heading>
      </CardHead>
      <CardBody>
        <Text>
          <strong>Virus is most likely spread from person-to-person.</strong>
          Try to stay at least 6 feet (~2m) away from other people out in public.
          Virus can travel through respitory droplets from infected cough or
          sneeze landing on surfaces, skin and mucas membranes or inhaled.
        </Text>
      </CardBody>
    </Card>
    <Card theme={theme}>
      <CardHead>
        <Icon name="coronavirus-2" style={icon} fill={theme.colors.tertiary} />
        <Heading as="h3">Wash your hands often.</Heading>
      </CardHead>
      <CardBody>
        <Text>
          <strong>Best: Warm water and soap for 20 seconds.</strong>
          Alcohol-based sanitizers with at least 70% alcohol will do in a pinch
          too.
        </Text>
      </CardBody>
    </Card>
    <Card theme={theme}>
      <CardHead>
        <Icon name="coronavirus-1" style={icon} fill={theme.colors.tertiary} />
        <Heading as="h3">Keep your germs to yourself</Heading>
      </CardHead>
      <CardBody>
        <Text>
          <strong>If sick, stay home except to get medical care.</strong>
          Cover coughs and sneezes and after immediately wash hands. Facemasks are
          best worn if your sick and out in public; otherwise, save them for
          caregivers.
        </Text>
      </CardBody>
    </Card>
    <Card theme={theme}>
      <CardHead>
        <Icon name="hand" style={icon} fill={theme.colors.tertiary} />
        <Heading as="h3">Clean AND Disinfect often</Heading>
      </CardHead>
      <CardBody>
        <Text>
          <strong>
            All the surfaces you touch frequently - handles, knobs, devices,
            counters, sinks
          </strong>
          Use diluted household bleach (4tsp/qt of water), 70% alcohol solutions
          or EPA-registered household disinfectants. A list of
          <a
            href="https://www.epa.gov/pesticide-registration/list-n-disinfectants-use-against-sars-cov-2"
            target="_blank">
            disenfectants for use against viral pathogens
          </a>
          by the United States Environmental Protection Agency — note the
          recommended surface contact times!
        </Text>
      </CardBody>
    </Card>
</Grid>
