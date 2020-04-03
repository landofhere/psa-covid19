export * from './global'
export * from './county'
export * from './us-states'

export interface DefaultOpts {
  numberfy?: boolean
  time?: boolean
}

interface FatalityRate {
  Deaths: number
  Confirmed: number
}

interface RecoveryRate {
  Recovered: number
  Confirmed: number
}

export const fatalityRate = (d: FatalityRate) => (d.Deaths / d.Confirmed) * 100
export const recoveryRate = (d: RecoveryRate) =>
  (d.Recovered / d.Confirmed) * 100

export const insertCommas = (num: number): string => {
  if (typeof num === 'number' && num > 999) {
    const numParts = num.toString().split('.')
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numParts.join('.')
  }
  return num.toString()
}

export const internalizeName = (data: any) => {
  const newData = []
  for (const prop in data) {
    const newObj = { name: prop, ...data[prop] }
    newData.push(newObj)
  }
  return newData
}

type ObjDateArray = [{ key: string; value: string | number }]
// numberfy: force type to number (use carefully)
export const objDateToArray = async (obj: ObjDateArray, numberfy = false) => {
  const dateArray = []
  const dateRegex = /(\d)+(\/){1}(\d)+(\/){1}(\d)+/
  for (const [key, value] of Object.entries(obj)) {
    if (dateRegex.test(key))
      numberfy
        ? dateArray.push({ [key]: +value })
        : dateArray.push({ [key]: value })
  }
  return dateArray
}

export const calcChange = (d: any[], spans: any[]): any => {
  let change: object = {}
  for (const period in spans) {
    let tempValue = 0
    const periodKeyObj: any[] = Object.keys(spans[period])
    const periodKey: string = periodKeyObj[0]
    const changeSpan = spans[period][periodKey]
    for (let i = 0; i < changeSpan; i++) {
      const tmpVal: number[] = Object.values(d[i])
      tempValue += tmpVal[0]
      // console.log(tempValue)
    }
    change = { ...change, [periodKey]: tempValue }
  }
  return change
}

export const calcChangeCombinedSums = (d: any[], spans: any[]): any => {
  let change: object = {}
  for (const period in spans) {
    let tempConfirmed = 0
    let tempActive = 0
    let tempDeaths = 0
    let changedConfirmed = 0
    let changedActive = 0
    let changedDeaths = 0
    const periodKeyObj: any[] = Object.keys(spans[period])
    const periodKey: string = periodKeyObj[0]
    const changeSpan =
      d.length > spans[period][periodKey]
        ? spans[period][periodKey]
        : d.length - 1
    for (let i = 0; i <= changeSpan; i++) {
      const tmpVal: number[] = Object.values(d[i])
      if (i > 0) {
        changedConfirmed += tempConfirmed - tmpVal[1]
        changedActive += tempActive - tmpVal[2]
        changedDeaths += tempDeaths - tmpVal[3]
      }
      tempConfirmed = tmpVal[1]
      tempActive = tmpVal[2]
      tempDeaths = tmpVal[3]
    }
    change = {
      ...change,
      [periodKey]: {
        confirmed: changedConfirmed,
        active: changedActive,
        deaths: changedDeaths,
      },
    }
    // console.log('calcChange:', change)
  }
  return change
}
