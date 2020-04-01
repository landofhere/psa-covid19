require('dotenv').config()
require("@babel/register")({extensions: ['.js', '.ts']})
const CronJob = require('cron').CronJob
import {
  getUS_CA_County,
  parseUS_CA_County,
  parseUS_CA_County_NoTime,
  writeUS_CA_County,
  parseUS_CA_County_Indv,
  ftpFile,
} from './lib'

const dataPath = './public/covid19_US_CA_County.json'
const generateUS_CA_County = async () => {
  let data = await getUS_CA_County()
  let parsed = await parseUS_CA_County(data)
  return writeUS_CA_County(parsed, dataPath).then(res => {
    return process.env.NODE_ENV === 'production' ? ftpFile() : 'SUCCESS'
  })
}

const dataPathNoTime = './public/covid19_US_CA_County_NoTime.json'
const generateUS_CA_County_NoTime = async () => {
  let data = await getUS_CA_County()
  let parsed = await parseUS_CA_County_NoTime(data)
  parseUS_CA_County_Indv(data)
  return writeUS_CA_County(parsed, dataPathNoTime).then(res => {
    return process.env.NODE_ENV === 'production' ? ftpFile() : 'SUCCESS'
  })
}

let date: Date = new Date()
const job = new CronJob('0 */15 * * * *', function() {
  generateUS_CA_County()
  console.log('US_CA_County data generated at ' + date.toString())
})

const job2 = new CronJob('0 */15 * * * *', function() {
  generateUS_CA_County_NoTime()
  console.log('US_CA_County_NoTime data generated at ' + date.toString())
})

if(process.env.NODE_ENV === 'production') {
  job.start()
  job2.start()
} else {
  generateUS_CA_County()
  generateUS_CA_County_NoTime()
}

