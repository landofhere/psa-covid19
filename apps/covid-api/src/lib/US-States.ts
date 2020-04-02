import { csv2JSON } from './csv2json'
import { writeFile } from './fs'
import { calcC19CACountyStats, calcC19CACountyStatsV2 } from './parse'
import fs from 'fs'

export const getUSStates = async (filePath?:string) => csv2JSON(filePath)
  .then(async resp => {
    console.log('getUSStates: ', resp)
    return resp
  })
  .catch(err => {
    throw new Error(`getUSStates: ${err}`)
  })

