import * as R from 'remeda'

export interface Point {
  x: number
  y: number
}

export interface Segment {
  a: Point
  b: Point
}

class Reduced<T> extends Error {
  value: T
  constructor(value: T) {
    super()
    this.value = value
  }
}

export const reduced = <T>(x: T) => new Reduced(x)

interface Reducer {
  <T, K>(items: T[], fn: (acc: K, item: T) => K | Reduced<K>, initial: K): K
  indexed: <T, K>(
    items: T[],
    fn: (acc: K, item: T, index: number, items: T[]) => K | Reduced<K>,
    initial: K,
  ) => K
}

export const reduce: Reducer = (items, fn, initial) => {
  try {
    return R.reduce(
      items,
      (...args) => {
        const r = fn(...args)
        if (r instanceof Reduced) {
          throw r
        }
        return r
      },
      initial,
    )
  } catch (e) {
    if (e instanceof Reduced) {
      return e.value
    }
    throw e
  }
}

reduce.indexed = (items, fn, initial) => {
  try {
    return R.reduce.indexed(
      items,
      (...args) => {
        const r = fn(...args)
        if (r instanceof Reduced) {
          throw r
        }
        return r
      },
      initial,
    ) as unknown as ReturnType<typeof fn>
    // https://github.com/remeda/remeda/pull/154
  } catch (e) {
    if (e instanceof Reduced) {
      return e.value
    }
    throw e
  }
}

type JuxtFn<T> = (x: T) => any
export function juxt<T, Fn extends JuxtFn<T>, Fns extends Fn[]>(
  x: T,
  fns: [...Fns],
): {[K in keyof Fns]: Fns[K] extends Fn ? ReturnType<Fns[K]> : never}
export function juxt<T, Fs extends JuxtFn<T>[]>(x: T, fns: Fs) {
  return fns.map(fn => fn(x))
}

export const is = (x: any) => x !== '' && x !== null && x !== undefined
export const parse10 = (s: string) => parseInt(s, 10)
export const clean = (s: string) => s.trim().replace(/^[^\S\n]+/gm, '')
export const paras = (s: string) => clean(s).split(/\n{2,}/)
export const ints = (s: string) => clean(s).split(/\D+/).map(parse10)
export const inRange = (x: number, bounds: [number, number]) =>
  x >= min(bounds) && x <= max(bounds)

// Generic so these work on BigInt
export const max = <T>(xs: T[]) => xs.reduce((prev, x) => (x > prev ? x : prev))
export const min = <T>(xs: T[]) => xs.reduce((prev, x) => (x < prev ? x : prev))
export const sum = <T>(xs: T[]): T =>
  reduce(xs.slice(1), (sum: any, x: any) => sum + x, xs[0])
export const product = <T>(xs: T[]): T =>
  reduce(xs.slice(1), (product: any, x: any) => product * x, xs[0])
export const gt = <T>(xs: T[]) => xs.every((x, i) => !i || x < xs[i - 1])
export const lt = <T>(xs: T[]) => xs.every((x, i) => !i || x > xs[i - 1])
export const eq = <T>(xs: T[]) => xs.every(x => x === xs[0])

export const ranks = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i => xs.slice(n * i, n * (i + 1)))

export const files = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i =>
    R.times(n, j => xs[i + j * n]).filter(is),
  )

function _dissoc({...o}: object, ks: string | string[]) {
  for (const k of typeof ks === 'string' ? [ks] : ks) {
    delete o[k]
  }
  return o
}

// data-first
export function dissoc<T extends object>(o: T, ks: string | string[]): T

// data-last
export function dissoc<T extends object>(ks: string | string[]): (o: T) => T

export function dissoc() {
  return R.purry(_dissoc, arguments)
}

export function countSubstr(s: string, c: string): number {
  let num = 0
  for (let pos = 0; (pos = s.indexOf(c, pos)) > -1; pos += c.length, num++) {}
  return num
}

export const int = x => parseInt(x)
