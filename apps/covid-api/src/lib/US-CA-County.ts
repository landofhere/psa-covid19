import axios from 'axios'
import { writeFile } from './fs'
import { calcC19CACountyStats, calcC19CACountyStatsV2 } from './parse'
import fs from 'fs'

const CACountyURL =
  'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json'

export const getUSCACounty = async () =>
  axios({
    method: 'get',
    url:
      'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json',
  })
    .then(async resp => resp.data)
    .catch(err => {
      throw new Error(`getUSCACounty: ${err}`)
    })

export const parseUSCACounty = async (data: any) =>
  calcC19CACountyStats(data, 'CALIFORNIA', { numberfy: true })
    .then(async resp => resp)
    .catch(err => {
      throw new Error(`getUSCACounty: ${err}`)
    })

export const parseUSCACountyNoTime = async (data: any) =>
  calcC19CACountyStatsV2(data, 'CALIFORNIA', { numberfy: true, time: false })
    .then(async resp => resp)
    .catch(err => {
      throw new Error(`getUSCACounty: ${err}`)
    })

export const writeUSCACounty = async (data: any, filePath: fs.PathLike) =>
  writeFile(
    JSON.stringify(data, null, 2),
    () => {
      return 'Success'
    },
    filePath,
  )

interface CountyData {
  name: string
  confirmed: number
  confirmedDayChange: number
  confirmedTwoDayChange: number
  confirmedWeekChange: number
  deaths: number
  deathsDayChange: number
  confirmeddeathsTwoDayChange: number
  deathsWeekChange: number
}

export const parseUSCACountyIndv = async (data: any) =>
  calcC19CACountyStatsV2(data, 'CALIFORNIA', { numberfy: true, time: true })
    .then(async resp => {
      const tmpData = resp.data ? resp.data : null
      const date = new Date();
      const dateStr = date.toLocaleString(); 
      if (tmpData.length > 0) {
        tmpData.map((c: CountyData) => {
          const cntyName = c.name
          const cntyNameShort = cntyName.replace(' County', '')
          const cntyUrl = cntyNameShort
            .replace(/[\. ,\/\\]+/g, '-')
            .toLowerCase()
          
          const countyData = {
            name: cntyNameShort,
            updated: dateStr,
            ...c,
          }
          const filePath = `./public/covid19_US_CA_County_${cntyUrl}.json`
          writeUSCACounty(countyData, filePath)
        })
      }
    })
    .catch(err => {
      throw new Error(`getUSCACounty: ${err}`)
    })
