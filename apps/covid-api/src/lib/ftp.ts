require('dotenv').config()
import FTPS from 'ftps'

const ftp = new FTPS({
  host: process.env.FTP_HOST,
  username: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  port: +process.env.FTP_PORT,
  protocol: 'sftp',
  retries: 3,
  timeout: 90,
  retryInterval: 5,
  autoConfirm: true,
  cwd: './public',
  additionalLftpCommands: [
    'set ssl-allow true',
    'set ssl:verify-certificate no',
    'set passive-mode yes',
  ].join(';'),
})

export const ftpFile = () => {
  ftp
    .cd(process.env.FTP_DIR)
    .mirror({ parallel: false, upload: true })
    .exec(console.log)
}
