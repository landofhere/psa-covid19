import { objDateToArray, internalizeName, calcChange } from './index'

interface DefaultOpts {
  numberfy?: boolean
  time?: boolean
}

interface Category {
  total: string | number
  dayChange: number
  twoDayChange: number
  weekChange: number
  time?: any[]
}
interface ItemChange {
  day: number
  week: number
  twoDay: number
}
const defaultOpts: DefaultOpts = {
  numberfy: false,
  time: true,
}

const parseC19CACountyStats = async (
  d: any,
  region: string,
  opts: DefaultOpts,
) => {
  let combined: any = {}
  return Promise.all(
    d.map(async (item: any) => {
      let itemData = {}
      let itemCategory = {}
      let dateItems = []
      let category: string | Category = { total: '', dayChange: 0, twoDayChange: 0,weekChange: 0, time: [] }

      dateItems = await objDateToArray(item, opts.numberfy)
      const itemChange: ItemChange = await calcChange(dateItems, [{ day: 1 },{ twoDay: 2 }, { week: 7 }])
      // console.log('parse calcChange', itemChange)
      if (opts.time) {
        category.total = opts.numberfy ? +item.TOTALS : item.TOTALS
        category.dayChange = itemChange.day
        category.twoDayChange = itemChange.twoDay
        category.weekChange = itemChange.week
        category.time = dateItems
      } else {
        category.total = opts.numberfy ? +item.TOTALS : item.TOTALS
        category.dayChange = itemChange.day
        category.twoDayChange = itemChange.twoDay
        category.weekChange = itemChange.week
      }
      itemCategory = { [item.CATEGORY]: category }
      if (item.c2p_pubdate)
        combined = { updated: item.c2p_pubdate, ...combined }
      if (combined.hasOwnProperty(item.GEOGRAPHY)) {
        itemData = {
          [item.GEOGRAPHY]: { ...combined[item.GEOGRAPHY], ...itemCategory },
        }
      } else {
        itemData = { [item.GEOGRAPHY]: itemCategory }
      }
      // console.log('calcCountyItem: ', itemData)
      combined = { ...combined, ...itemData }
    }),
  ).then(res => {
    // console.log('parseC19', res, combined)
    return combined
  })
}

export const calcC19CACountyStats = async (
  d: any,
  region: string,
  opts: DefaultOpts,
) => {
  const parseData = await parseC19CACountyStats(d, region, {
    ...defaultOpts,
    ...opts,
  })
    .then(res => res)
    .catch(err => {
      console.log('calcStats err: ', err)
      return 'ERROR!'
    })
  return parseData
}

interface CACountyStatsV2 {
  updated?: string
  data?: any
  [key: string]: any
}

type CalcC19CACountyStatsV2 = (
  d: any,
  region: string,
  opts: DefaultOpts,
) => Promise<CACountyStatsV2>

export const calcC19CACountyStatsV2: CalcC19CACountyStatsV2 = async (
  d,
  region,
  opts,
) => {
  const parseData = await parseC19CACountyStats(d, region, {
    ...defaultOpts,
    ...opts,
  })
    .then((res: any) => {
      const tmpUpdated = res.updated
      delete res.updated
      const data = internalizeName(res)
      return { updated: tmpUpdated, data }
    })
    .catch((err: any) => {
      console.log('calcStats err: ', err)
      return { error: 'ERROR!' }
    })
  return parseData
}
