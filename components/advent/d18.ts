import * as inputs from './inputs'
import {
  arrayFrom,
  enumerate,
  execPipe,
  filter,
  map,
  notNil,
  reduce,
  takeLast,
  takeWhile,
} from 'iter-tools-es'
import {combinations, denumerate, iterate, max} from './iter-lib'
import {countSubstr, int} from './lib'

const {floor, ceil} = Math

function explode(s: string): string | undefined {
  for (const {
    0: {length},
    1: left,
    2: right,
    index,
  } of s.matchAll(/\[(\d+),(\d+)\]/g)) {
    const before = s.substring(0, index)
    const depth = countSubstr(before, '[') - countSubstr(before, ']')
    if (depth >= 4) {
      const after = s.substring(index + length)
      return (
        before.replace(/(.*)\b(\d+)/, (_, p, n) => p + (int(n) + int(left))) +
        '0' +
        after.replace(/(.*?)\b(\d+)/, (_, p, n) => p + (int(n) + int(right)))
      )
    }
  }
}

function split(s: string): string | undefined {
  const m = s.match(/\d{2,}/)
  if (m) {
    const n = int(m[0])
    return (
      s.substring(0, m.index) +
      `[${floor(n / 2)},${ceil(n / 2)}]` +
      s.substring(m.index + m[0].length)
    )
  }
}

// aka reduce, but that name is taken
function snail(s: string): string {
  return execPipe(
    iterate(s => explode(s) ?? split(s), s),
    takeWhile(notNil),
    takeLast,
  )
}

function add(a, b) {
  return snail(`[${a},${b}]`)
}

type Snail = number | [Snail, Snail]

function magnitude(s: string | Snail): number {
  switch (typeof s) {
    case 'string':
      return magnitude(JSON.parse(s) as Snail)
    case 'number':
      return s
    default:
      return 3 * magnitude(s[0]) + 2 * magnitude(s[1])
  }
}

export function d18({
  input = inputs.d18,
  part,
}: {
  input: string
  part: 'a' | 'b'
}) {
  const snails = input.trim().split(/\n/)
  if (part === 'a') {
    return magnitude(reduce(add, snails))
  }
  return execPipe(
    arrayFrom(enumerate(snails)),
    snails => combinations(snails, snails),
    filter(([[i], [j]]) => i !== j), // dedup
    map(map(denumerate)),
    map(([s1, s2]) => magnitude(add(s1, s2))),
    max,
  )
}

// for tests
d18.explode = explode
d18.split = split
d18.snail = snail
d18.add = add
d18.magnitude = magnitude
