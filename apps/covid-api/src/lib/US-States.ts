import axios from 'axios'
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

  export const getUSStatesCT = async (url: string) =>
    axios({ method: 'get', url })
      .then(resp => resp.data)
      .catch(err => {
        throw new Error(`getUSStatesCT: ${err}`)
      })

export const parseUSStates = async (data: any, data2: any) => 
  calcUSStates(data, data2, { numberfy: true })
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
