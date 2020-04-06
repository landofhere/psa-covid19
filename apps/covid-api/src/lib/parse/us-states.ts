import { DefaultOpts, internalizeName, calcChangeCombinedSums } from './index'
import { stateNames } from '../util'

interface USStates {
  updated?: string
  data?: any
  [key: string]: any
}

interface DataInUSStates {
  date: string
  state: string
  fips: string
  cases: string
  deaths: string
}

type CalcUSStates = (d: any, d2: any, opts: DefaultOpts) => Promise<USStates>

type parseUSStates = (d: any, d2: any, opts: DefaultOpts) => Promise<USStates>

const defaultOpts: DefaultOpts = {
  numberfy: false,
  time: true,
}

export const parseUSStatesStats: parseUSStates = async (d, d2, opts) => {
  let combined: any = {
    startDate: '',
    lastDate: '',
  }
  await d.map((item: DataInUSStates, index: number) => {
    let combinedData = {}
    let stateAbbrev = 'N/A'
    let stateCTData = {
      totalTestResults: 0,
      positive: 0,
      negative: 0,
      pending: 0,
      hospitalizedCurrently: 0,
      hospitalizedCumulative: 0,
      inIcuCurrently: 0,
      inIcuCumulative: 0,
      onVentilatorCurrently: 0,
      onVentilatorCumulative: 0,
      recovered: 0,
      deaths: 0,
    }
    const stateName = item.state

    // Get State name abbreviation
    const stateNamePos = stateNames.map((st: any) => st.name).indexOf(stateName)
    stateAbbrev =
      stateNamePos !== -1 &&
      stateNames[stateNamePos].hasOwnProperty('abbreviation')
        ? stateNames[stateNamePos].abbreviation
        : 'N/A'

    // Get covidtracking.com data for that state
    if (stateAbbrev) {
      const stateCTPos = d2.map((ctSt: any) => ctSt.state).indexOf(stateAbbrev)
      stateCTData = d2[stateCTPos]
    }
    // console.log('stateCTData: ', stateCTData)
    const stateConfirmed =
      stateCTData.totalTestResults > +item.cases
        ? stateCTData.totalTestResults
        : +item.cases
    const stateDeaths =
      stateCTData.deaths > +item.deaths ? stateCTData : +item.deaths
    const stateRecovered = stateCTData.recovered > 0 ? stateCTData.recovered : 0
    const stateActive = stateConfirmed - (+stateDeaths + +stateRecovered)
    // Defaults: Compare Data
    const itemData = {
      abbrev: stateAbbrev,
      fips: item.fips,
      confirmed: stateConfirmed,
      active: stateActive,
      recovered: stateRecovered,
      deaths: stateDeaths,
      confirmedDayChange: 0,
      deathsDayChange: 0,
      confirmedWeekChange: 0,
      deathsWeekChange: 0,
      confirmedTests: stateCTData.totalTestResults,
      positive: stateCTData.positive,
      negative: stateCTData.negative,
      pending: stateCTData.pending,
      hospitalizedCur: stateCTData.hospitalizedCurrently,
      hospitalizedCum: stateCTData.hospitalizedCumulative,
      icuCur: stateCTData.inIcuCurrently,
      icuCum: stateCTData.inIcuCumulative,
      ventCur: stateCTData.onVentilatorCurrently,
      ventCum: stateCTData.onVentilatorCumulative,
    }
    const itemTime = {
      date: item.date,
      confirmed: +itemData.confirmed,
      active: +itemData.active,
      deaths: +itemData.deaths,
    }
    if (index === 0) combined.startDate = item.date
    combined.lastDate = item.date
    if (combined.hasOwnProperty(item.state)) {
      if (combined[item.state].time.length > 0) {
        const lastTimeItem =
          combined[item.state].time.length > 0 &&
          combined[item.state].time.slice(-1)
        itemData.confirmedDayChange =
          +itemData.confirmed - lastTimeItem[0].confirmed
        itemData.deathsDayChange = +itemData.deaths - lastTimeItem[0].deaths
      }
      combinedData = {
        [item.state]: {
          ...itemData,
          time:
            combined[item.state].time.length > 0 &&
            combined[item.state].time.concat(itemTime),
        },
      }
    } else {
      combinedData = { [item.state]: { ...itemData, time: [itemTime] } }
    }
    combined = {
      ...combined,
      ...combinedData,
    }
  })
  return combined
}

export const procUSStates = async (d: any) => {
  const combined: any[] = []
  let confirmed = 0
  let deaths = 0
  let active = 0
  let recovered = 0
  // console.log('procStates:', d)
  await d.map((item: any) => {
    let change = {}
    if (item.time.length > 0) {
      const revTime = item.time.reverse()

      change = calcChangeCombinedSums(revTime, [
        { day: 1 },
        { twoDay: 2 },
        { week: 7 },
      ])

      const itemData = {
        name: item.name,
        fips: item.fips,
        change,
        time: revTime,
      }
      confirmed += item.confirmed
      deaths += item.deaths
      active += item.active
      recovered += item.recovered
      combined.push({ ...itemData, ...item })
    }
  })
  // console.log('proc:', combined)
  return { confirmed, deaths, active, recovered, data: combined }
}

export const calcUSStates: CalcUSStates = async (d, d2, opts) => {
  const calcData = await parseUSStatesStats(d, d2, {
    ...defaultOpts,
    ...opts,
  })
    .then(async (res: any) => {
      const tmpStartDate = res.startDate
      const tmpLastDate = res.lastDate
      delete res.startDate
      delete res.lastDate
      const data = await internalizeName(res)
      const calcData = await procUSStates(data)
      return { startDate: tmpStartDate, lastDate: tmpLastDate, ...calcData }
    })
    .catch((err: any) => {
      console.log('calcStats err: ', err)
      return { error: 'ERROR!' }
    })
  return calcData
}
