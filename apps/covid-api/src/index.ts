require('dotenv').config()
const CronJob = require('cron').CronJob
import {
  getUSCACounty,
  parseUSCACountyNoTime,
  writeUSCACounty,
  parseUSCACountyIndv,
  ftpFile,
  getUSStates,
  parseUSStates,
  writeUSStates,
} from './lib'
import { resolve } from 'path'
import { exec } from 'child_process'

const DATA_PATH_US_CA_COUNTY = './public/covid19_US_CA_County_V3.json'
const DATA_PATH_US_STATES = './public/covid19_US_States.json'
const US_STATES_PATH = resolve('../../sharedLib/covid-19-data/us-states.csv')
const SUBMOD_NYTIMES = '../../sharedLib/covid-19-data '
const SUBMOD_CSSE = '../../sharedLib/COVID-19 '

const generateUSCACounty = async () => {
  const data = await getUSCACounty()
  const parsed = await parseUSCACountyNoTime(data)
  parseUSCACountyIndv(data)
  return writeUSCACounty(parsed, DATA_PATH_US_CA_COUNTY).then(() =>
    process.env.NODE_ENV === 'production'
      ? ftpFile()
      : console.log('generateUSCACountyNoTime SUCCESS'),
  )
}

const generateUSStates = async () => {
  const data = await getUSStates(US_STATES_PATH)
  const parsed = await parseUSStates(data)
  return writeUSStates(parsed, DATA_PATH_US_STATES).then(() =>
    process.env.NODE_ENV === 'production'
      ? ftpFile()
      : console.log('generateUSStates SUCCESS'),
  )
}

const gitUpdateSubmod = async (subModPath?: string) => {
  const { stdout, stderr } = await exec(
    `git -C ${subModPath} pull origin master`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`gitUpdateSubmod error: ${error}`)
        return
      }
      console.log(`gitUpdateSubmod: ${stdout}`)
      return
    },
  )
}

const date: Date = new Date()
const job = new CronJob('0 * * * * *', function() {
  gitUpdateSubmod(SUBMOD_NYTIMES)
  gitUpdateSubmod(SUBMOD_CSSE)
  console.log('US_CA_County data generated at ' + date.toString())
})

const job2 = new CronJob('0 */15 * * * *', function() {
  generateUSCACounty()
  console.log('US_CA_County_NoTime data generated at ' + date.toString())
})

if (process.env.NODE_ENV === 'production') {
  job.start()
  job2.start()
} else {
  generateUSCACounty()
  generateUSStates()
}
