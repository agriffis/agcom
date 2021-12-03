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

export const d3b = ({input = inputs.d3, dbg}: DayProps) => {
  const diags = input
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s, 2))

  const bitLength = input.trim().search(/\s+/)

  const bitPositions = R.times(bitLength, pos => bitLength - pos - 1)

  const oxy = R.reduce(
    bitPositions,
    (oxy, pos) => {
      if (oxy.length < 2) {
        return oxy
      }
      const {'0': zeros, '1': ones} = R.groupBy(oxy, n => n & (1 << pos) && 1)
      return zeros.length > ones.length ? zeros : ones
    },
    diags,
  )

  const co2 = R.reduce(
    bitPositions,
    (co2, pos) => {
      if (co2.length < 2) {
        return co2
      }
      const {'0': zeros, '1': ones} = R.groupBy(co2, n => n & (1 << pos) && 1)
      return zeros.length > ones.length ? ones : zeros
    },
    diags,
  )

  return `Life support rating: ${oxy[0] * co2[0]}`
}
