<script>
  import { tick } from 'svelte'
  import {
    Flex,
    Box,
    Heading,
    Button,
    Text,
  } from '@studiobear/designspek-components'
  import { GetContextFab, RevGeocode } from '../util'
  import Modal from '../Modal.svelte'
  import Loading from '../Loading.svelte'
  import OverviewBoxLocal from '../OverviewBoxLocal.svelte'
  import { insertCommas, getAddress, setStorageItem } from '../../libs'
  import { storeUserPrefs, lfUserPrefs } from '../../stores/userPrefs'
  export let theme = $$props.theme || {}
  export let ssr = $$props.ssr || {}
  export let data
  export let overview
  let getLocation = true
  let locationType = 'default'
  let modalVisible = false

  $: locationData = {
    status: 'start',
    message: '',
    lat: '',
    lng: '',
    data: {},
  }

  $: updateLocationData =
    $storeUserPrefs.hasOwnProperty('location') &&
    $storeUserPrefs.location &&
    $storeUserPrefs.location.hasOwnProperty('message') &&
    $storeUserPrefs.location.hasOwnProperty('data')
  // Abusing Svelte reactivity? Change state by watching UserPrefs store state.
  $: {
    if (updateLocationData) {
      getLocation = false
      locationData = $storeUserPrefs.location
    }
  }

  $: overviewBox = {
    flexdir: 'column',
    align: 'center',
    bg: theme.colors.muted,
    mx: 'auto',
    py: '1rem',
    w: '100%',
  }
  let overviewSingleBox = {
    flexdir: 'column',
    align: 'center',
    w: '100%',
    txtalign: 'center',
    d: 'flex',
    flexdir: 'column',
    alignc: 'stretch',
    my: '0.5rem',
  }
  let overviewMiddleBox = {
    flexdir: 'row',
    width: '100%',
    alignc: 'stretch',
    pb: '1.5rem',
  }
  $: overviewSingleBoxActive = {
    ...overviewSingleBox,
    bg: theme.colors.quaternary,
    pb: '1.5rem',
  }

  $: overviewBottomBox = {
    ...overviewMiddleBox,
    bg: theme.colors.grey,
  }

  $: modalTitle = {
    fontWeight: 400,
    color: theme.colors.secondary,
    fontSize: '1.4rem',
    lineHeight: '1.6rem',
    txtAlign: 'center',
  }

  $: ovTitle = {
    letterSpacing: '0.25rem',
    fontWeight: 900,
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
  }

  $: nmTitle = {
    ...ovTitle,
    txtAlign: 'center',
    lineHeight: '1.2rem',
  }

  $: changeLocBttn = {
    bg: theme.colors.background,
    brdCol: theme.colors.quaternary,
  }

  $: changeLocTxt = {
    letterSpacing: '0.25rem',
    fontWeight: 400,
    color: theme.colors.text,
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    txtdeco: 'underline',
  }

  let modal = {
    py: '1.5rem',
    px: '1.25rem',
    maxw: '80vw',
  }

  $: loading = {
    animation: 'spin 6s infinite',
  }

  let geoLocText = {
    lineHeight: '1.2rem',
    txtAlign: 'center',
  }

  const openModal = async e => {
    locationData.status = 'start'
    getLocation = true
    modalVisible = e.detail.go
  }

  function closeModal(e) {
    modalVisible = e.detail.close
  }

  const chooseLocation = () => {
    locationData.status = 'received'
    locationData.message = `You are in <br /> California, USA`
    locationData.data = {
      formatted: 'Napa County, California, USA',
      addressNames: {
        long: ['Napa County', 'California', 'United States'],
        short: ['Napa County', 'CA', 'US'],
      },
    }
  }

  const handleAddress = async e => {
    const addressStatus = e.detail.status
    const addressData = e.detail.data
    let address = await getAddress(addressData)
    locationData.status = 'received'
    locationData.message = `You are in <br /> ${address.formatted}`
    locationData.data = address
    delete locationData.lat
    delete locationData.lng
    if (process.browser) setStorageItem('location', locationData, lfUserPrefs)
    // console.log('handleAddress', addressStatus, addressData, locationData)
  }

  const getGeoLocation = () => {
    locationData.status = 'loading'
    const success = position => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      locationData.message = `Latitude: ${latitude}°, Longitude: ${longitude}°`
      locationData.lat = latitude
      locationData.lng = longitude
      getLocation = false
      locationData.status = 'geocoding'
    }

    const error = err => {
      locationData.error = true
      locationData.status = 'error'
      err.code = 'PERMISSION_DENIED'
      switch (err.code) {
        case 'PERMISSION_DENIED':
          locationData.message =
            'Location services disabled or denied. Check privacy settings.'
          break
        case 'POSITION_UNAVAILABLE':
          locationData.message =
            'Location unavailable at this time. Try manual location.'
          break
        case 'TIMEOUT':
          locationData.message = 'Location timed out. Try manual location.'
          break
        default:
          locationData.message = `Unable to retrieve your location: ${err.code}`
      }
    }

    if (!navigator.geolocation) {
      locationData.status = 'error'
      locationData.message = 'Geolocation is not supported by your browser'
    } else {
      locationData.message = 'Locating…'
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  // $: console.log('locationData:', locationData)
</script>

<Modal style={modal} bind:show={modalVisible} on:message={closeModal}>
  {#if getLocation && locationData.status === 'start'}
    <Heading as="h4" style={modalTitle}>
      Get case statistics based on your location
    </Heading>
    <Button on:click={getGeoLocation}>
      <Heading as="h6" style={nmTitle}>Use My location</Heading>
    </Button>
    <Text style={geoLocText}>
      Uses device geolocation to set your country, region and county. Stored on
      your device and does not get transmitted off.
    </Text>
    <Heading as="h4" style={nmTitle}>Or</Heading>
    <Button on:click={chooseLocation}>
      <Heading as="h6" style={nmTitle}>Use California, USA</Heading>
    </Button>
  {:else if locationData.status === 'loading'}
    <Loading {theme} fill={theme.colors.primary} style={loading} />
    <Heading as="h6" style={nmTitle}>Use My location</Heading>
  {:else}
    <Heading as="h6" style={nmTitle}>Use My location</Heading>
  {/if}
</Modal>

<Flex style={overviewBox} {ssr}>
  {#if getLocation && locationData.status === 'start'}
    <Box style={overviewSingleBox} {ssr}>
      <GetContextFab {theme} {ssr} on:message={openModal} />
      <Heading as="h6" style={ovTitle} {ssr}>Cases Near Me</Heading>
    </Box>
  {:else if locationData.status === 'loading'}
    <Box style={overviewSingleBox}>
      <Loading {theme} fill={theme.colors.primary} style={loading} />
      <Heading as="h6" style={nmTitle}>loading...</Heading>
    </Box>
  {:else if locationData.status === 'geocoding'}
    <Box style={overviewSingleBox}>
      <Loading {theme} fill={theme.colors.secondary} style={loading} />
      <Heading as="h6" style={nmTitle}>getting local data...</Heading>
      <RevGeocode
        lat={locationData.lat}
        lng={locationData.lng}
        on:message={handleAddress} />
    </Box>
  {:else if locationData.status === 'error'}
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={nmTitle}>{locationData.message}</Heading>
      <GetContextFab {theme} on:message={openModal} />
      <Heading as="h6" style={nmTitle}>Try again, maybe?</Heading>
    </Box>
  {:else if locationData.status === 'received'}
    <Box style={overviewSingleBox}>
      <OverviewBoxLocal local={locationData.data} {overview} {data} {theme} />
      <Heading as="h6" style={nmTitle}>
        {@html locationData.message}
      </Heading>
      <Button
        style={changeLocBttn}
        on:click={() => openModal({ detail: { go: true } })}>
        <Heading as="h6" style={changeLocTxt}>Change Location</Heading>
      </Button>
    </Box>
  {:else}
    <Box style={overviewSingleBox}>
      <Heading as="h6" style={ovTitle}>
        Current Location: {locationData.message}
      </Heading>
    </Box>
  {/if}
</Flex>
