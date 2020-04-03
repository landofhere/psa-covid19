import { csv2JSON } from './csv2json'
import { writeFile } from './fs'
import { calcUSStates } from './parse'
import fs from 'fs'

export const getUSStates = async (filePath?: string) =>
  csv2JSON(filePath)
    .then(async resp => {
      // console.log('getUSStates: ', resp)
      return resp
    })
    .catch(err => {
      throw new Error(`getUSStates: ${err}`)
    })

export const parseUSStates = async (data: any) =>
  calcUSStates(data, { numberfy: true })
    .then((resp: any) => resp)
    .catch((err: any) => {
      throw new Error(`getUSCACounty: ${err}`)
    })

export const writeUSStates = async (data: any, filePath: fs.PathLike) =>
  writeFile(
    JSON.stringify(data, null, 2),
    () => {
      return 'Success'
    },
    filePath,
  )
