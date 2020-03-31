export const calcC19Stats = d => {
  let combined = {}
  let total_deaths = 0
  let total_confirmed = 0
  let total_active = 0
  let total_recovered = 0
  let last_updated = 0

  d.map(item => {
    item = item['attributes']
    var build_item = {
      Confirmed: item.Confirmed,
      Active: item.Confirmed - (item.Recovered + item.Deaths),
      Deaths: item.Deaths,
      Recovered: item.Recovered,
      Updated: item.Last_Update,
      SubRegion: {
        name: item.Province_State,
        Confirmed: item.Confirmed,
        Active: item.Active,
        Deaths: item.Deaths,
        Recovered: item.Recovered,
      },
    }
    if (item.Country_Region in combined) {
      combined[item.Country_Region].Confirmed += build_item.Confirmed
      combined[item.Country_Region].Active += build_item.Active
      combined[item.Country_Region].Deaths += build_item.Deaths
      combined[item.Country_Region].Recovered += build_item.Recovered
      combined[item.Country_Region].SubRegion = {
        [build_item.SubRegion.name]: { ...build_item.SubRegion },
        ...combined[item.Country_Region].SubRegion,
      }
    } else {
      combined[item.Country_Region] = build_item
      combined[item.Country_Region].SubRegion = {
        [build_item.SubRegion.name]: { ...build_item.SubRegion },
      }
    }
    total_deaths += item.Deaths
    total_confirmed += item.Confirmed
    total_active += item.Confirmed - (item.Recovered + item.Deaths)
    total_recovered += item.Recovered
    last_updated =
      item.Last_Update > last_updated ? item.Last_Update : last_updated
  })
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
}
