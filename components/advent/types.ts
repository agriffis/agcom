// https://stackoverflow.com/a/63973683/347386
export {}
declare global {
  type Debug = <T = any>(x: T, ...args: any[]) => T
  namespace NodeJS {
    interface Global {
      dbg: Debug
    }
  }
  const dbg: Debug
}

export interface AdventProps {
  day: number
  part: 'a' | 'b'
  input: string
  debug?: boolean
}

export interface DayProps extends AdventProps {}
