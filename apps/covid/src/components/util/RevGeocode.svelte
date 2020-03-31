<script>
  import { onMount, createEventDispatcher } from 'svelte'
  export let lat = ''
  export let lng = ''
  let revGeocode
  const dispatch = createEventDispatcher()

  onMount(async function geocodeRevLkup() {
    let latlng = { lat, lng }
    try {
      revGeocode = async () => {
        const geocoder = await new window.google.maps.Geocoder()
        // await console.log('revGeocode', geocoder, latlng, lat, lng)
        return geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              dispatch('message', {
                status: 'success',
                data: results,
              })
            } else {
              console.log('geocode noResults: ', 'No results found')
            }
          } else {
            console.log('geocode error: ', status)
          }
        })
      }
      const googleScript = document.getElementById('google-maps-api')

      if (window.google) {
        revGeocode()
      } else {
        googleScript.addEventListener('load', () => {
          revGeocode()
        })
      }
    } catch (err) {
      console.log('fetch failed', err)
    }
  })
</script>

<svelte:head>
  <script
    id="google-maps-api"
    type="text/javascript"
    src="https://maps.googleapis.com/maps/api/js?key={process.env.GEOCODING_API_KEY}">

  </script>
</svelte:head>
