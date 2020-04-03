import { exec } from 'child_process'

export const gitUpdateSubmod = async (subModPath?: string) =>
  exec(`git -C ${subModPath} pull origin master`, (error, stdout, stderr) => {
    if (error) {
      console.error(`gitUpdateSubmod error: ${error}`)
      return
    }
    console.log(`gitUpdateSubmod: ${stdout}`)
    return
  })

export const gitInitSubmod = async (subModPath?: string) =>
  exec(`git -C ${subModPath} submodule update --init`, (error, stdout) => {
    if (error) {
      console.error(`gitInitSubmod error: ${error}`)
      return
    }
    console.log(`gitInitSubmod: ${stdout}`)
    return
  })
