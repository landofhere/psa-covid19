import fs from 'fs'
const dataPath = '../../public/sample.json'

export const readFile= (
  callback: (data: Buffer) => string | Buffer,
  returnJson: boolean,
  filePath: fs.PathLike,
  encoding?: null | undefined,
): void  => {
  fs.readFile(filePath, {encoding}, (err, data: Buffer) => {
    if (err) {
      throw err
    }
    callback(returnJson && Buffer.isBuffer(data) ?JSON.parse(data.toString()) : data)
  })
}

export const writeFile = (
  fileData: any = dataPath,
  callback: (res: string) => string,
  filePath: fs.PathLike,
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
