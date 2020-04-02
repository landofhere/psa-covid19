import { DefaultOpts, internalizeName } from './index'

interface USStates {
  updated?: string
  data?: any
  [key: string]: any
}

type CalcUSSates = (
  d: any,
  opts: DefaultOpts,
) => Promise<USStates>

type parseUSSates = (
  d: any,
  opts: DefaultOpts,
) => Promise<USStates>

const defaultOpts: DefaultOpts = {
  numberfy: false,
  time: true,
}

export const parseUSStatesStats: parseUSSates = async (
  d,
  opts,
) => {
  const parseData = d
  return  parseData
}

export const calcUSStates: CalcUSSates = async (
  d,
  opts,
) => {
  const calcData = await parseUSStatesStats(d, {
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
  return calcData
}