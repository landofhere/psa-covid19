require('dotenv').config()
const CronJob = require('cron').CronJob
import {
  getUSCACounty,
  parseUSCACounty,
  parseUSCACountyNoTime,
  writeUSCACounty,
  parseUSCACountyIndv,
  ftpFile,
  getUSStates,
} from './lib'
import { resolve } from 'path'
import { exec } from 'child_process'

const DATA_PATH_US_CA_COUNTY= './public/covid19_US_CA_County_V3.json'
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

const generateUSStates = () => {
  const data = getUSStates(US_STATES_PATH)
  return console.log('generateUSStates SUCCESS')
}

const gitUpdateSubmod = async (subModPath?: string) => {
  const { stdout, stderr } = await exec(`git -C ${subModPath} pull origin master`, (error, stdout, stderr) => {
    if (error) {
      console.error(`gitUpdateSubmod error: ${error}`)
      return
    }
    console.log(`gitUpdateSubmod: ${stdout}`)
    return
  })
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
