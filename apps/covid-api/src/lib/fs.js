import fs from 'fs'
const dataPath = '../../public/sample.json'
export const readFile = (
  callback,
  returnJson = true,
  filePath = dataPath,
  encoding = 'utf8',
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err
    }
    callback(returnJson && data !== '' ? JSON.parse(data) : data)
  })
}

export const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  options = { encoding: 'utf8', flag: 'w' },
) => {
  fs.writeFile(filePath, fileData, options, err => {
    if (err) {
      throw err
    }
    callback('Success')
    return
  })
}
