import { objDateToArray, internalizeName } from './index'

interface DefaultOpts {
  numberfy?: boolean
  time?: boolean
}

interface Category {
  total: string | number
  time: any[]
}

const defaultOpts:DefaultOpts = {
  numberfy: false,
  time: true,
}

const parseC19CACountyStats = async (d:any, region:string, opts:DefaultOpts) => {
  let combined: any = {}
  return Promise.all(
    d.map(async (item: any) => {
      let itemData = {}
      let itemCategory = {}
      let dateItems = []
      let category: string | Category = { total: '', time: [] }

      if (opts.time) {
        dateItems = await objDateToArray(item, opts.numberfy)
        category.total = opts.numberfy ? +item.TOTALS : item.TOTALS
        category.time = dateItems
      } else {
        category = opts.numberfy ? +item.TOTALS : item.TOTALS
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
export const calcC19CACountyStats = async (d:any, region:string, opts:DefaultOpts) => {
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

interface ICACountyStatsV2{
  updated?: string
  data?: any
  [key: string]: any
}

type CalcC19CACountyStatsV2 = (d:any, region:string, opts:DefaultOpts) => Promise<ICACountyStatsV2>

export const calcC19CACountyStatsV2: CalcC19CACountyStatsV2 = async (d, region, opts) => {
  const parseData = await parseC19CACountyStats(d, region, {
    ...defaultOpts,
    ...opts,
  })
    .then((res: any) => {
      let tmpUpdated = res.updated
      delete res.updated
      let data = internalizeName(res)
      return { updated: tmpUpdated, data }
    })
    .catch((err: any) => {
      console.log('calcStats err: ', err)
      return {error: 'ERROR!'}
    })
  return parseData
}
