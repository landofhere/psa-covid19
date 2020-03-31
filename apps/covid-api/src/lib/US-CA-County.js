import axios from 'axios'
import { writeFile } from './fs'
import { calcC19CACountyStats, calcC19CACountyStatsV2 } from './parse'
import { resolve } from 'path'

const CACountyURL =
  'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json'

export const getUS_CA_County = async () =>
  axios({
    method: 'get',
    url:
      'https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json',
  })
    .then(async resp => resp.data)
    .catch(err => {
      throw new Error(`getUS_CA_County: ${err}`)
    })

export const parseUS_CA_County = async data =>
  calcC19CACountyStats(data, 'CALIFORNIA', { numberfy: true })
    .then(async resp => resp)
    .catch(err => {
      throw new Error(`getUS_CA_County: ${err}`)
    })

export const parseUS_CA_County_NoTime = async data =>
  calcC19CACountyStatsV2(data, 'CALIFORNIA', { numberfy: true, time: false })
    .then(async resp => resp)
    .catch(err => {
      throw new Error(`getUS_CA_County: ${err}`)
    })

export const parseUS_CA_County_Indv = async data =>
  calcC19CACountyStatsV2(data, 'CALIFORNIA', { numberfy: true, time: true })
    .then(async resp => {
      const tmpData = resp.data
      if (tmpData.length > 0) {
        tmpData.map(c => {
          const cntyName = c.name
          const cntyNameShort = cntyName.replace(' County', '')
          const cntyUrl = cntyNameShort
            .replace(/[\. ,\/\\]+/g, '-')
            .toLowerCase()
          const countyData = {
            name: cntyNameShort,
            cases: c.cases,
            deaths: c.deaths,
            updated: resp.updated,
          }
          const filePath = `./public/covid19_US_CA_County_${cntyUrl}.json`
          writeUS_CA_County(countyData, filePath)
        })
      }
    })
    .catch(err => {
      throw new Error(`getUS_CA_County: ${err}`)
    })

export const writeUS_CA_County = async (data, filePath) =>
  writeFile(
    JSON.stringify(data, null, 2),
    res => {
      //console.log('writeUS_CA_County: ', res)
      return 'Success'
    },
    filePath,
  )
