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

const bitCounter = (pos: number) =>
  R.reduce<number, number>((count, n) => count + ((n & (1 << pos)) >> pos), 0)

export const d3a = ({input = inputs.d3, dbg}: DayProps) => {
  const diags = R.pipe(
    input.trim().split(/\s+/),
    R.map(s => parseInt(s, 2)),
  )
  const bitLength = input.trim().search(/\s+/)
  const bitCounts = R.times(bitLength, pos => bitCounter(pos)(diags))
  const gamma = R.reduce.indexed(
    bitCounts,
    (gamma, count, shift) =>
      gamma | (count > diags.length / 2 ? 1 << shift : 0),
    0,
  ) as unknown as number // https://github.com/remeda/remeda/pull/154
  const epsilon = gamma ^ ((1 << bitLength) - 1)
  dbg({gamma, epsilon})
  return `Power consumption: ${gamma * epsilon}`
}

export const d3b = ({input = inputs.d3, dbg}: DayProps) => {
  const diags = R.pipe(
    input.trim().split(/\s+/),
    R.map(s => parseInt(s, 2)),
  )
  const bitLength = input.trim().search(/\s+/)
  return 0
}
