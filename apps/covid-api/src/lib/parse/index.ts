export * from './global'
export * from './county'

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
    const changeSpan = spans[period]
    for (let i = 0; i < changeSpan; i++) {
      const tempValue = d[i]
      console.log(tempValue)
      return (change = { [period]: 0 })
    }
  }
}
