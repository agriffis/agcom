import * as R from 'remeda'
import * as inputs from './advent-inputs'
import {DayProps} from './advent-types'

export const d1a = ({input = inputs.d1}: DayProps) =>
  R.pipe(
    input.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed(
      (count, depth, index, depths) =>
        count + Number(index && depth > depths[index - 1]),
      0,
    ),
  ).toString()

export const d1b = ({input = inputs.d1, dbg}: DayProps) =>
  R.pipe(
    input.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed(
      (count, depth, index, depths) =>
        count +
        Number(
          index > 2 &&
            depth > depths[index - 3] &&
            (dbg(depth, '(increased)'), true),
        ),
      0,
    ),
  ).toString()

export const d2a = ({input = inputs.d2, dbg}: DayProps) =>
  R.pipe(
    Array.from(input.matchAll(/(\w+)\s+(\d+)/g)),
    R.map(m => ({dir: m[1], mag: parseInt(m[2])})),
    R.reduce(
      ({x, z}, {dir, mag}) => ({
        x: dir === 'forward' ? x + mag : x,
        z: dir === 'up' ? z - mag : dir === 'down' ? z + mag : z,
      }),
      {x: 0, z: 0},
    ),
    dbg,
    ({x, z}) => x * z,
  )

export const d2b = ({input = inputs.d2, dbg}: DayProps) =>
  R.pipe(
    Array.from(input.matchAll(/(\w+)\s+(\d+)/g)),
    R.map(m => ({cmd: m[1], n: parseInt(m[2])})),
    R.reduce(
      ({x, z, aim}, {cmd, n}) =>
        cmd === 'forward'
          ? {x: x + n, z: z + n * aim, aim}
          : cmd === 'up'
          ? {aim: aim - n, x, z}
          : {aim: aim + n, x, z},
      {x: 0, z: 0, aim: 0},
    ),
    dbg,
    ({x, z}) => x * z,
  )

export const d3a = ({input = inputs.d3, dbg}: DayProps) => {
  const diags = input
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s, 2))
  const bitLength = input.trim().search(/\s+/)
  const bitCounts = R.times(bitLength, pos =>
    R.reduce(diags, (count, n) => count + ((n & (1 << pos)) >> pos), 0),
  )
  const gamma = R.reduce.indexed(
    bitCounts,
    (gamma, count, pos) => gamma | (count > diags.length / 2 ? 1 << pos : 0),
    0,
  ) as unknown as number // https://github.com/remeda/remeda/pull/154
  const epsilon = gamma ^ ((1 << bitLength) - 1)
  dbg({gamma, epsilon})
  return `Power consumption: ${gamma * epsilon}`
}

class Reduced<T> extends Error {
  value: T
  constructor(value: T) {
    super()
    this.value = value
  }
}

const reduced = <T>(x: T) => new Reduced(x)

interface Reducer {
  <T, K>(items: T[], fn: (acc: K, item: T) => K | Reduced<K>, initial: K): K
  indexed: <T, K>(
    items: T[],
    fn: (acc: K, item: T, index: number, items: T[]) => K | Reduced<K>,
    initial: K,
  ) => K
}

const reduce: Reducer = (items, fn, initial) => {
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

export const d3b = ({input = inputs.d3, dbg}: DayProps) => {
  const diags = input
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s, 2))

  const bitLength = input.trim().search(/\s+/)

  const bitPositions = R.times(bitLength, pos => bitLength - pos - 1)

  const oxy = reduce(
    bitPositions,
    (oxy, pos) => {
      const {'0': zeros, '1': ones} = R.groupBy(oxy, n => n & (1 << pos) && 1)
      const ret = zeros.length > ones.length ? zeros : ones
      return ret.length > 1
        ? ret
        : (dbg(`terminating oxy at bit position ${pos}`), reduced(ret))
    },
    diags,
  )

  const co2 = reduce(
    bitPositions,
    (co2, pos) => {
      const {'0': zeros, '1': ones} = R.groupBy(co2, n => n & (1 << pos) && 1)
      const ret = zeros.length > ones.length ? ones : zeros
      return ret.length > 1
        ? ret
        : (dbg(`terminating co2 at bit position ${pos}`), reduced(ret))
    },
    diags,
  )

  return `Life support rating: ${oxy[0] * co2[0]}`
}

const is = (x: any) => x !== '' && x !== null && x !== undefined
const parse10 = (s: string) => parseInt(s, 10)
const clean = (s: string) => s.trim().replace(/^[^\S\n]+/gm, '')
const paragraphs = (s: string) => clean(s).split(/\n{2,}/)
const ints = (s: string) => clean(s).split(/\D+/).map(parse10)
const max = (ns: number[]) => Math.max.apply(null, ns)
const min = (ns: number[]) => Math.min.apply(null, ns)
const sum = (ns: number[]) => reduce(ns, (sum, n) => sum + n, 0)

const ranks = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i => xs.slice(n * i, n * (i + 1)))

const files = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i =>
    R.times(n, j => xs[i + j * n]).filter(is),
  )

const d4 = ({
  input = inputs.d4,
  dbg,
  pick,
}: DayProps & {pick: typeof R.last}) => {
  const {draws, boards} = R.pipe(paragraphs(input), ([ds, ...bs]) => ({
    draws: ints(ds),
    boards: bs.map(ints),
  }))
  const edge = Math.sqrt(boards[0].length)

  // Reverse lookup from a drawn number to its position in line.
  const order = reduce.indexed(
    R.uniq(draws),
    (order, draw, i) => ((order[draw] = i), order),
    [] as number[],
  )

  // Boards sorted in the order they win.
  const bingos = R.pipe(
    boards,
    R.map.indexed((board, num) => {
      const rows = [...ranks(board, edge), ...files(board, edge)]
      const orders = rows.map(r => r.map(draw => order[draw]))
      const turn = min(orders.map(max))
      return {board, num, rows, orders, turn}
    }),
    R.sort((a, b) => a.turn - b.turn),
  )

  // Pick the winning (or losing) board.
  const winning = pick(bingos)

  // Unmarked numbers are those that haven't been called by the winning.turn
  const unmarked = sum(winning.board.filter(x => order[x] > winning.turn))

  // Which number was called on the winning turn?
  const winner = draws[winning.turn]

  dbg({...R.pick(winning, ['num', 'turn']), unmarked, winner})
  return `Final score: ${unmarked * winner}`
}

export const d4a = (props: DayProps) => d4({...props, pick: R.first})

export const d4b = (props: DayProps) => d4({...props, pick: R.last})
