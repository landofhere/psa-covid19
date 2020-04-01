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

export const fatalityRate = (d:FatalityRate) => (d.Deaths / d.Confirmed) * 100
export const recoveryRate = (d: RecoveryRate) => (d.Recovered / d.Confirmed) * 100

export const insertCommas = (num: number): string => {
  if (typeof num === 'number' && num > 999) {
    let num_parts = num.toString().split('.')
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return num_parts.join('.')
  }
  return num.toString()
}

export const internalizeName = (data: any) => {
  let newData = []
  for (const prop in data) {
    let newObj = { name: prop, ...data[prop] }
    newData.push(newObj)
  }
  return newData
}

type ObjDateArray = [{key: string, value: string | number}]
// numberfy: force type to number (use carefully)
export const objDateToArray = async (obj: ObjDateArray, numberfy: boolean = false) => {
  let dateArray = []
  const dateRegex = /(\d)+(\/){1}(\d)+(\/){1}(\d)+/
  for (let [key, value] of Object.entries(obj)) {
    if (dateRegex.test(key))
      numberfy
        ? dateArray.push({ [key]: +value })
        : dateArray.push({ [key]: value })
  }
  return dateArray
}
