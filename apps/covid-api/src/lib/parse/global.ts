import { fatalityRate, recoveryRate } from './index'
export const calcC19Stats = (d: any) => {
  const combined: any = {}
  let totalDeaths = 0
  let totalConfirmed = 0
  let totalActive = 0
  let totalRecovered = 0
  let lastUpdated = 0

  d.map((item: any) => {
    item = item['attributes']
    const buildItem = {
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
      combined[item.Country_Region].Confirmed += buildItem.Confirmed
      combined[item.Country_Region].Active += buildItem.Active
      combined[item.Country_Region].Deaths += buildItem.Deaths
      combined[item.Country_Region].Recovered += buildItem.Recovered
      combined[item.Country_Region].SubRegion = {
        [buildItem.SubRegion.name]: { ...buildItem.SubRegion },
        ...combined[item.Country_Region].SubRegion,
      }
    } else {
      combined[item.Country_Region] = buildItem
      combined[item.Country_Region].SubRegion = {
        [buildItem.SubRegion.name]: { ...buildItem.SubRegion },
      }
    }
    totalDeaths += item.Deaths
    totalConfirmed += item.Confirmed
    totalActive += item.Confirmed - (item.Recovered + item.Deaths)
    totalRecovered += item.Recovered
    lastUpdated =
      item.Last_Update > lastUpdated ? item.Last_Update : lastUpdated
  })
  const updated = new Date(lastUpdated)
  return {
    totalConfirmed: totalConfirmed,
    totalActive: totalActive,
    totalDeaths: totalDeaths,
    totalRecovered: totalRecovered,
    totalFatalityRate: fatalityRate({
      Deaths: totalDeaths,
      Confirmed: totalConfirmed,
    }),
    totalRecoveryRate: recoveryRate({
      Recovered: totalRecovered,
      Confirmed: totalConfirmed,
    }),
    lastUpdated: `${updated.toLocaleDateString()} ${updated.toLocaleTimeString()}`,
    data: combined,
  }
}
