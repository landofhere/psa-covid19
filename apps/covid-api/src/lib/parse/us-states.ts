import { DefaultOpts, internalizeName, calcChangeCombinedSums } from './index'

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

type CalcUSSates = (d: any, opts: DefaultOpts) => Promise<USStates>

type parseUSSates = (d: any, opts: DefaultOpts) => Promise<USStates>

const defaultOpts: DefaultOpts = {
  numberfy: false,
  time: true,
}

export const parseUSStatesStats: parseUSSates = async (d, opts) => {
  let combined: any = {
    startDate: '',
    lastDate: '',
  }
  await d.map((item: DataInUSStates, index: number) => {
    let combinedData = {}
    const itemData = {
      fips: item.fips,
      confirmed: +item.cases,
      active: +item.cases - +item.deaths,
      deaths: +item.deaths,
      confirmedDayChange: 0,
      deathsDayChange: 0,
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

  await d.map((item: any) => {
    let change = {}
    if (item.time.length > 0) {
      const revTime = item.time.reverse()

      change = calcChangeCombinedSums(revTime, [
        { day: 1 },
        { twoDay: 2 },
        { week: 7 },
      ])

      const lastTime = item.time[0]
      const itemData = {
        name: item.name,
        fips: item.fips,
        confirmed: lastTime.confirmed,
        active: lastTime.confirmed - lastTime.deaths,
        deaths: lastTime.deaths,
        change,
        time: revTime,
      }
      confirmed += lastTime.confirmed
      deaths += lastTime.deaths
      combined.push(itemData)
    }
  })
  // console.log('proc:', combined)
  return { confirmed, deaths, active: confirmed - deaths, data: combined }
}

export const calcUSStates: CalcUSSates = async (d, opts) => {
  const calcData = await parseUSStatesStats(d, {
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
