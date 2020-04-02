import csv from 'csvtojson'

const defaultPath: string='../../../../sharedLib/covid-19-data/us-states.csv' 

export const csv2JSON = async (filePath: string = defaultPath)=> {
  let data: any[]
  try {
    data = await csv().fromFile(filePath)
  } catch (err){
      throw new Error(`csv2JSON: ${err}`)
  }
  return data
}