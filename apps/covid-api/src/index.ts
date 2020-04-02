require('dotenv').config()
const CronJob = require('cron').CronJob
import {
  getUSCACounty,
  parseUSCACounty,
  parseUSCACountyNoTime,
  writeUSCACounty,
  parseUSCACountyIndv,
  ftpFile,
} from './lib'

const dataPath = './public/covid19_US_CA_County.json'
const generateUSCACounty = async () => {
  const data = await getUSCACounty()
  const parsed = await parseUSCACounty(data)
  return writeUSCACounty(parsed, dataPath).then(() =>
    process.env.NODE_ENV === 'production' ? ftpFile() : console.log('SUCCESS'),
  )
}

const dataPathNoTime = './public/covid19_US_CA_County_V3.json'
const generateUSCACountyNoTime = async () => {
  const data = await getUSCACounty()
  const parsed = await parseUSCACountyNoTime(data)
  parseUSCACountyIndv(data)
  return writeUSCACounty(parsed, dataPathNoTime).then(() =>
    process.env.NODE_ENV === 'production' ? ftpFile() : console.log('SUCCESS'),
  )
}

const date: Date = new Date()
const job = new CronJob('0 */15 * * * *', function() {
  generateUSCACounty()
  console.log('US_CA_County data generated at ' + date.toString())
})

const job2 = new CronJob('0 */15 * * * *', function() {
  generateUSCACountyNoTime()
  console.log('US_CA_County_NoTime data generated at ' + date.toString())
})

if (process.env.NODE_ENV === 'production') {
  job.start()
  job2.start()
} else {
  generateUSCACounty()
  generateUSCACountyNoTime()
}
