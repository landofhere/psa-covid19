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
  .then(async (resp:any) => resp)
  .catch((err: any) => {
    throw new Error(`getUSCACounty: ${err}`)
  })
