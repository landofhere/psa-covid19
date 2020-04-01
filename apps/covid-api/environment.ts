import * as ts from 'typescript'

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      FTP_HOST: string
      FTP_USERNAME: string
      FTP_PASSWORD: string
      FTP_PORT: string
      FTP_DIR: string
      NODE_ENV: 'development' | 'production'
    }
  }
}