require('dotenv').config()
const CronJob = require('cron').CronJob
import {
  getUS_CA_County,
  parseUS_CA_County,
  parseUS_CA_County_NoTime,
  writeUS_CA_County,
  parseUS_CA_County_Indv,
  ftpFile,
} from './lib'
import { resolve } from 'path'

const dataPath = './public/covid19_US_CA_County.json'
const generateUS_CA_County = async () => {
  let data = await getUS_CA_County()
  let parsed = await parseUS_CA_County(data)
  let write = await writeUS_CA_County(parsed, dataPath).then(res => {
    return ftpFile()
  })
}

const dataPathNoTime = './public/covid19_US_CA_County_NoTime.json'
const generateUS_CA_County_NoTime = async () => {
  let data = await getUS_CA_County()
  let parsed = await parseUS_CA_County_NoTime(data)
  parseUS_CA_County_Indv(data)
  let write = await writeUS_CA_County(parsed, dataPathNoTime).then(res => {
    return ftpFile()
  })
}

const job = new CronJob('0 */15 * * * *', function() {
  let d = Date(Date.now())
  generateUS_CA_County()
  console.log('US_CA_County data generated at ' + d.toString())
})

const job2 = new CronJob('0 */15 * * * *', function() {
  let d = Date(Date.now())
  generateUS_CA_County_NoTime()
  console.log('US_CA_County_NoTime data generated at ' + d.toString())
})

job.start()
job2.start()
// generateUS_CA_County()
// generateUS_CA_County_NoTime()
// generateUS_CA_County_Indv()
