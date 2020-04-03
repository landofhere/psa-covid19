import { DefaultOpts, internalizeName } from './index'

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
      confirmed: +item.cases,
      active: +item.cases - +item.deaths,
      deaths: +item.deaths,
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
      combinedData = {
        [item.state]: {
          time:
            combined[item.state].time.length > 0 &&
            combined[item.state].time.concat(itemTime),
        },
      }
    } else {
      combinedData = { [item.state]: { ...itemData, time: [itemTime] } }
    }
    // console.log('calcCountyItem: ', itemData)
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
  const lastConfirmed = 0
  const lastDeaths = 0
  const confirmedChange = 0
  const confirmedDeaths = 0
  await d.map((item: any) => {
    const lastTime = item.time.slice(-1)
    const itemData = {
      name: item.name,
      confirmed: lastTime[0].confirmed,
      active: lastTime[0].confirmed - lastTime[0].deaths,
      deaths: lastTime[0].deaths,
      time: item.time,
    }
    confirmed += lastTime[0].confirmed
    deaths += lastTime[0].deaths
    combined.push(itemData)
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
      // console.log('calc:', res)
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
