export const fatalityRate = d => (d.Deaths / d.Confirmed) * 100

export const recoveryRate = d => (d.Recovered / d.Confirmed) * 100

export const internalizeCountryName = data => {
  let newData = []
  for (const prop in data) {
    let newObj = { Name: prop, ...data[prop] }
    newData.push(newObj)
  }
  return newData
}

const parseC19GlobalStats = async (d, region) => {
  let combined = {}
  let total_deaths = 0
  let total_confirmed = 0
  let total_active = 0
  let total_recovered = 0
  let last_updated = 0
  return Promise.all(
    d.map(item => {
      item = item['attributes']
      let build_item = {
        Name: item.Country_Region,
        Confirmed: item.Confirmed,
        Active: item.Confirmed - (item.Recovered + item.Deaths),
        Deaths: item.Deaths,
        Recovered: item.Recovered,
        Updated: item.Last_Update,
        SubRegion: null,
      }
      let build_subRegion = {
        name: item.Province_State,
        Confirmed: item.Confirmed,
        Active: item.Active,
        Deaths: item.Deaths,
        Recovered: item.Recovered,
      }
      if (item.Country_Region in combined) {
        combined[item.Country_Region].Confirmed += build_item.Confirmed
        combined[item.Country_Region].Active += build_item.Active
        combined[item.Country_Region].Deaths += build_item.Deaths
        combined[item.Country_Region].Recovered += build_item.Recovered
        if (build_subRegion.name !== null) {
          combined[item.Country_Region].SubRegion = {
            [build_subRegion.name]: { ...build_subRegion },
            ...combined[item.Country_Region].SubRegion,
          }
        }
      } else {
        combined[item.Country_Region] = build_item
        if (build_subRegion.name !== null) {
          combined[item.Country_Region].SubRegion = {
            [build_subRegion.name]: { ...build_subRegion },
            ...combined[item.Country_Region].SubRegion,
          }
        }
      }
      total_deaths += item.Deaths
      total_confirmed += item.Confirmed
      total_active += item.Confirmed - (item.Recovered + item.Deaths)
      total_recovered += item.Recovered
      last_updated =
        item.Last_Update > last_updated ? item.Last_Update : last_updated
    }),
  )
    .then(res => {
      // console.log('parseC19', res, combined)
      let updated = new Date(last_updated)
      return {
        totalConfirmed: total_confirmed,
        totalActive: total_active,
        totalDeaths: total_deaths,
        totalRecovered: total_recovered,
        totalFatalityRate: fatalityRate({
          Deaths: total_deaths,
          Confirmed: total_confirmed,
        }),
        totalRecoveryRate: recoveryRate({
          Recovered: total_recovered,
          Confirmed: total_confirmed,
        }),
        lastUpdated: `${updated.toLocaleDateString()} ${updated.toLocaleTimeString()}`,
        data: combined,
      }
    })
    .catch(err => {
      console.log('parseStats err: ', err)
      return 'Parse ERROR!'
    })
}

export const calcC19GlobalStats = async d => {
  const parseData = await parseC19GlobalStats(d)
    .then(async res => {
      let newData = await internalizeCountryName(res.data)
      res.data = newData
      return res
    })
    .catch(err => {
      console.log('calcStats err: ', err)
      return 'Calc ERROR!'
    })
  return parseData
}

export const C19Stats = async d => {
  const stats = await calcC19GlobalStats(d)
    .then(res => res)
    .catch(err => {
      console.log('C19Stats err: ', err)
      return 'Stats ERROR!'
    })

  return stats
}

export const insertCommas = num => {
  if (typeof num === 'number' && num > 999) {
    let num_parts = num.toString().split('.')
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return num_parts.join('.')
  }
  return num
}

const objDateToArray = async obj => {
  let dateArray = []
  const dateRegex = /(\d)+(\/){1}(\d)+(\/){1}(\d)+/g
  for (let [key, value] of Object.entries(obj)) {
    if (dateRegex.test(key)) dateArray.push(obj)
  }
  return dateArray
}

export const calcC19CACountyStats = async (d, region) => {
  let combined = {}
  let category = {}

  await d.map(async item => {
    let itemData = {}
    let itemCategory = {}
    let dateItems = await objDateToArray(item)
    category = {
      total: item.TOTALS,
      time: dateItems,
    }
    itemCategory = { [item.CATEGORY]: category }
    if (item.c2p_pubdate) combined = { updated: item.c2p_pubdate, ...combined }
    if (combined.hasOwnProperty(item.GEOGRAPHY)) {
      itemData = {
        [item.GEOGRAPHY]: { ...combined[item.GEOGRAPHY], ...itemCategory },
      }
    } else {
      itemData = { [item.GEOGRAPHY]: itemCategory }
    }
    // console.log('calcCountyItem: ', itemData)
    combined = { ...combined, ...itemData }
  })
  // console.log('calcCounty: ', combined)
  return combined
}
