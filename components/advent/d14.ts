import {paras, ranks, min, max, dissoc} from './lib'
import * as R from 'remeda'
import * as inputs from './inputs'

interface Pairs {
  [k: string]: number
}

const parsePairs = (input: string) => {
  const pairs = {} as Pairs
  for (let i = 0; i < input.length - 1; i++) {
    const p = input.substring(i, i + 2)
    pairs[p] = (pairs[p] || 0) + 1
  }
  pairs[`_${input[0]}`] = 1
  pairs[`${input[input.length - 1]}_`] = 1
  return pairs
}

type Rule = [string, string, string]

const parseRules = (input: string) =>
  ranks(input.match(/\w+/g), 2).map(
    ([pair, ins]) => [pair, pair[0] + ins, ins + pair[1]] as Rule,
  )

const parse = (input: string) => ({
  pairs: parsePairs(paras(input)[0]),
  rules: parseRules(paras(input)[1]),
})

const step = (pairs: Pairs, rules: Rule[]) =>
  rules.reduce(
    (nps, [bye, hi, hello]) => {
      if (pairs[bye]) {
        nps[hi] = (nps[hi] || 0) + pairs[bye]
        nps[hello] = (nps[hello] || 0) + pairs[bye]
        nps[bye] -= pairs[bye]
      }
      return nps
    },
    {...pairs},
  )

export const d14 = ({
  input = inputs.d14,
  part,
}: {
  input: string
  part: 'a' | 'b'
}) => {
  let {pairs, rules} = parse(input)
  const steps = part === 'a' ? 10 : 40
  for (let i = 0; i < steps; i++) {
    pairs = step(pairs, rules)
  }
  const counts = R.pipe(
    Object.entries(pairs),
    R.reduce((dubcount, [p, n]) => {
      for (const c of p) {
        dubcount[c] = (dubcount[c] || 0) + n
      }
      return dubcount
    }, {} as {[k: string]: number}),
    dissoc('_'),
    R.mapValues(n => n / 2),
  )
  return max(R.values(counts)) - min(R.values(counts))
}
