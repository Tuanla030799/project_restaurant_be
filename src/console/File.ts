import { ShellString, sed } from 'shelljs'

export class File {
  appendTo(file: string, content: string) {
    return ShellString(content).toEnd(file)
  }

  sed(file: string, regex: string, content: string) {
    return sed('-i', regex, content, file)
  }
}
