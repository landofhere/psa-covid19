import { objDateToArray, internalizeName } from './index'

const defaultOpts = {
  numberfy: false,
  time: true,
}
const parseC19CACountyStats = async (d, region, opts) => {
  let combined = {}
  return Promise.all(
    d.map(async item => {
      let itemData = {}
      let itemCategory = {}
      let dateItems = []
      let category = { total: '', time: [] }

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
export const calcC19CACountyStats = async (d, region, opts) => {
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

export const calcC19CACountyStatsV2 = async (d, region, opts) => {
  const parseData = await parseC19CACountyStats(d, region, {
    ...defaultOpts,
    ...opts,
  })
    .then(res => {
      let tmpUpdated = res.updated
      delete res.updated
      let data = internalizeName(res)
      return { updated: tmpUpdated, data }
    })
    .catch(err => {
      console.log('calcStats err: ', err)
      return 'ERROR!'
    })
  return parseData
}
