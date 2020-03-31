export const getAddress = resp => {
  let address = {}
  resp.map(item => {
    if (item.types.includes('administrative_area_level_2')) {
      let addressNames = {}
      let long = []
      let short = []
      let addressComponents = item.address_components
      addressComponents.map(component => {
        long.push(component.long_name)
        short.push(component.short_name)
      })
      address = {
        formatted: item.formatted_address,
        addressNames: { long, short },
      }
    }
  })

  return address
}
