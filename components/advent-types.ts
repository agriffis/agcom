export interface AdventProps {
  day: number
  part: 'a' | 'b'
  input: string
  debug?: boolean
}

export interface DayProps extends AdventProps {
  dbg: <T>(x: T, ...args: any) => T
}
