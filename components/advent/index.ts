import * as R from 'remeda'
import * as inputs from './inputs'
import {DayProps} from './types'
import {
  reduce,
  reduced,
  is,
  parse10,
  clean,
  paras,
  ints,
  max,
  min,
  sum,
  product,
  inRange,
  ranks,
  files,
  Point,
  Segment,
} from './lib'

export const d1a = ({input = inputs.d1}: {input?: string}) =>
  R.pipe(
    input.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed(
      (count, depth, index, depths) =>
        count + Number(index && depth > depths[index - 1]),
      0,
    ),
  ).toString()

export const d1b = ({input = inputs.d1}: {input?: string}) =>
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

export const d2a = ({input = inputs.d2}: {input?: string}) =>
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

export const d2b = ({input = inputs.d2}: {input?: string}) =>
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

export const d3a = ({input = inputs.d3}: {input?: string}) => {
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

export const d3b = ({input = inputs.d3}: {input?: string}) => {
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

const d4 = ({
  input = inputs.d4,
  pick,
}: {
  input?: string
  pick: typeof R.last
}) => {
  const {draws, boards} = R.pipe(paras(input), ([ds, ...bs]) => ({
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

export const pointsOf = (g: Segment): Point[] => {
  let {a, b} = g
  const dx = b.x < a.x ? -1 : b.x > a.x ? 1 : 0
  const dy = b.y < a.y ? -1 : b.y > a.y ? 1 : 0
  const points = []
  for (let x = a.x, y = a.y; x !== b.x || y !== b.y; x += dx, y += dy) {
    points.push({x, y})
  }
  points.push(b)
  return points
}

export const d5 = ({
  input = inputs.d5,
  part,
}: {
  input?: string
  part: 'a' | 'b'
}) => {
  const horiz = ({a, b}: Segment) => a.y === b.y
  const vert = ({a, b}: Segment) => a.x === b.x
  const lines = ranks(ints(input), 4)
    .map(([ax, ay, bx, by]) => ({a: {x: ax, y: ay}, b: {x: bx, y: by}}))
    .filter(g => part === 'b' || horiz(g) || vert(g))
  const seen = reduce(
    lines,
    (seen, line) =>
      reduce(
        pointsOf(line).map(({x, y}) => `${x},${y}`),
        (seen, p) => ((seen[p] = (seen[p] || 0) + 1), seen),
        seen,
      ),
    {},
  )
  return Object.values(seen).filter(n => n > 1).length
}

export const d6 = ({
  input = inputs.d6,
  part,
}: {
  input?: string
  part: 'a' | 'b'
}) => {
  let state = reduce(
    ints(input),
    (state, i) => (state[i]++, state),
    Array(9).fill(0),
  )
  const days = part === 'a' ? 80 : 256
  for (let day = 0; day < days; day++) {
    state[9] = state[0]
    state[7] += state[0]
    state.shift()
  }
  return sum(state)
}

export const d7a = ({input = inputs.d7}: {input?: string}) => {
  const ns = ints(input)
  const costs = R.range(min(ns), max(ns)).map(pos =>
    sum(ns.map(n => Math.abs(n - pos))),
  )
  return min(costs)
}

export const d7b = ({input = inputs.d7}: {input?: string}) => {
  const ns = ints(input)
  // cost-per-distance lookup table
  const {cpd} = R.range(0, max(ns) - min(ns) + 1).reduce(
    ({cpd, rate}, d) => {
      cpd[d + 1] = cpd[d] + rate
      return {cpd, rate: rate + 1}
    },
    {cpd: [0], rate: 0},
  )
  cpd.shift() // avoids needing (cpd[d] || 0) in the reduction
  const costs = R.range(min(ns), max(ns)).map(pos =>
    sum(ns.map(n => cpd[Math.abs(n - pos)])),
  )
  return min(costs)
}

export const d8a = ({input = inputs.d8}: {input?: string}) => {
  const digs = ranks(clean(input).split(/\W+/), 14).flatMap(xs => xs.slice(10))
  return sum(digs.map(dig => Number([2, 3, 4, 7].includes(dig.length))))
}

function isSuperset(set: Set<any>, subset: Set<any>) {
  for (let x of subset) {
    if (!set.has(x)) {
      return false
    }
  }
  return true
}

function difference<T = any>(a: Set<T>, b: Set<any> | any[] | string): Set<T> {
  let d = new Set(a)
  for (let x of b) {
    d.delete(x as unknown as T)
  }
  return d
}

function sole<T = any>(xs: Set<T> | Array<T>): T {
  if (Array.isArray(xs)) {
    if (xs.length !== 1) {
      throw new TypeError(
        `can't determine sole member of array length ${xs.length}`,
      )
    }
    return xs[0]
  }
  if (xs.size !== 1) {
    throw new TypeError(`can't determine sole member of set size ${xs.size}`)
  }
  for (let member of xs) {
    return member
  }
}

function equals(a: Set<any>, b: Set<any>) {
  return a.size === b.size && difference(a, b).size === 0
}

export const d8b = ({input = inputs.d8}: {input?: string}) => {
  const eight = new Set('abcdefg')
  const signals = ranks(clean(input).split(/\W+/), 14).map(xs => ({
    sigs: xs.slice(0, 10).map(x => new Set(x)),
    one: new Set(xs.find(x => x.length === 2)),
    four: new Set(xs.find(x => x.length === 4)),
    seven: new Set(xs.find(x => x.length === 3)),
    ins: xs.slice(10).map(x => new Set(x)),
  }))
  return sum(
    signals.map(({one, four, seven, sigs, ins}) => {
      const nine = sole(sigs.filter(x => x.size === 6 && isSuperset(x, four)))
      const e = sole(difference(eight, nine))
      const two = sole(sigs.filter(x => x.size === 5 && x.has(e)))
      const f = sole(difference(one, two))
      const c = sole(difference(one, f))
      const three = sole(
        sigs.filter(x => x.size === 5 && x !== two && x.has(c)),
      )
      const five = sole(
        sigs.filter(x => x.size === 5 && x !== two && x !== three),
      )
      const zero = sole(
        sigs.filter(x => x.size === 6 && x !== nine && x.has(c)),
      )
      const six = sole(
        sigs.filter(x => x.size === 6 && x !== nine && x !== zero),
      )
      const numbers = [
        zero,
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        eight,
        nine,
      ]
      const outs = ins.map(i => numbers.findIndex(n => equals(i, n)))
      return parseInt(outs.join(''))
    }),
  )
}

// Day 9 ------------------------------------------------------------

interface GridReduce {
  <T = any, R = any>(grid: T[][], fn: (r: R, v: T) => R, init: R): R
  indexed: <T = any, R = any>(
    grid: T[][],
    fn: (r: R, v: T, p: Point) => R,
    init: R,
  ) => R
}

const gridReduce: GridReduce = (grid, fn, init) =>
  reduce(grid, (r, vs) => reduce(vs, (r, v) => fn(r, v), r), init)

gridReduce.indexed = (grid, fn, init) =>
  reduce.indexed(
    grid,
    (r, vs, y) => reduce.indexed(vs, (r, v, x) => fn(r, v, {x, y}), r),
    init,
  )

export const d9a = ({input = inputs.d9}: {input?: string}) => {
  const width = clean(input).indexOf('\n')
  const depths = ranks(Array.from(input.replace(/\D/g, '')).map(parse10), width)
  const deltas = [-1, 1].flatMap(d => [
    {dx: d, dy: 0},
    {dx: 0, dy: d},
  ])
  const nearby = ({x, y}: Point): Point[] =>
    R.pipe(
      deltas,
      R.map(({dx, dy}) => ({x: x + dx, y: y + dy})),
      R.filter(({x, y}) => x >= 0 && x < width && y >= 0 && y < depths.length),
    )
  const depthAt = ({x, y}: Point) => depths[y][x]
  return gridReduce.indexed(
    depths,
    (risk, d, p) =>
      nearby(p)
        .map(depthAt)
        .every(s => s > d)
        ? risk + d + 1
        : risk,
    0,
  )
}

const setAdd = <T = any>(set: Set<T>, x: T) => {
  const sizeBefore = set.size
  set.add(x)
  return set.size > sizeBefore
}

export const d9b = ({input = inputs.d9}: {input?: string}) => {
  const width = clean(input).indexOf('\n')
  const depths = ranks(Array.from(input.replace(/\D/g, '')).map(parse10), width)
  const deltas = [-1, 1].flatMap(d => [
    {dx: d, dy: 0},
    {dx: 0, dy: d},
  ])
  const nearby = (
    {x, y}: Point,
    {w, h}: {w: number; h: number} = {w: width, h: depths.length},
  ): Point[] =>
    R.pipe(
      deltas,
      R.map(({dx, dy}) => ({x: x + dx, y: y + dy})),
      R.filter(({x, y}) => x >= 0 && x < w && y >= 0 && y < h),
    )
  const depthAt = ({x, y}: Point) => depths[y][x]
  const lows = gridReduce.indexed(
    depths,
    (lows, d, p) => (
      nearby(p)
        .map(depthAt)
        .every(s => s > d) && lows.push(p),
      lows
    ),
    [] as Point[],
  )
  const basinAt = (
    here: Point,
    found: Set<string> = new Set(),
  ): Set<string> => {
    for (const there of nearby(here)) {
      if (depthAt(there) < 9 && setAdd(found, `${there.x},${there.y}`)) {
        basinAt(there, found)
      }
    }
    return found
  }
  const basins = lows.map(low => basinAt(low))
  return R.pipe(
    basins.map(b => b.size).sort((a, b) => b - a),
    R.take(3),
    product,
  )
}

export const d10a = ({input = inputs.d10}: {input?: string}) => {
  const lines = clean(input).split(/\n/)
  const pairs = {'(': ')', '[': ']', '{': '}', '<': '>'}
  const points = {')': 3, ']': 57, '}': 1197, '>': 25137}
  const lineScore = (line: string) =>
    reduce(
      Array.from(line),
      ([stack]: [string[], number], c) => {
        if (points[c]) {
          if (pairs[R.last(stack)] !== c) {
            return reduced([[], points[c]])
          }
          stack.pop()
        } else {
          stack.push(c)
        }
        return [stack, 0]
      },
      [[], 0],
    )[1]
  return sum(lines.map(lineScore))
}

export const d10b = ({input = inputs.d10}: {input?: string}) => {
  const lines = clean(input).split(/\n/)
  const pairs = {'(': ')', '[': ']', '{': '}', '<': '>'}
  const points = {')': 1, ']': 2, '}': 3, '>': 4}
  const lineScore = (line: string) =>
    reduce.indexed(
      Array.from(line),
      ([stack]: [string[], number], c, i) => {
        if (points[c]) {
          if (pairs[R.last(stack)] !== c) {
            return reduced([[], 0])
          }
          stack.pop()
        } else {
          stack.push(c)
        }
        if (i === line.length - 1 && stack.length) {
          return [
            [],
            stack
              .reverse()
              .reduce((score, c) => 5 * score + points[pairs[c]], 0),
          ]
        }
        return [stack, 0]
      },
      [[], 0],
    )[1]
  const scores = lines.map(lineScore).filter(Boolean)
  return scores.sort((a, b) => a - b)[(scores.length + 1) / 2 - 1]
}

// Day 11

const flash = (vs: number[], i: number) => {
  vs[i] = 0
  const x = i % 10
  const y = (i - x) / 10
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx || dy) {
        const xx = x + dx
        const yy = y + dy
        if (xx >= 0 && xx < 10 && yy >= 0 && yy < 10) {
          const j = yy * 10 + xx
          vs[j] = vs[j] && vs[j] + 1
        }
      }
    }
  }
}

export const d11a = ({input = inputs.d11}: {input?: string}) => {
  const vs = Array.from(input.replace(/\D/g, '')).map(x => parseInt(x))
  let flashes = 0
  for (let step = 0; step < 100; step++) {
    vs.forEach((_, i) => vs[i]++)
    for (let fs = flashes; ; flashes = fs) {
      vs.forEach((v, i) => v > 9 && (flash(vs, i), fs++))
      if (fs === flashes) {
        break
      }
    }
  }
  return flashes
}

export const d11b = ({input = inputs.d11}: {input?: string}) => {
  const vs = Array.from(input.replace(/\D/g, '')).map(x => parseInt(x))
  for (let step = 1; ; step++) {
    vs.forEach((_, i) => vs[i]++)
    let flashes = 0
    for (let fs = flashes; ; flashes = fs) {
      vs.forEach((v, i) => v > 9 && (flash(vs, i), fs++))
      if (fs === flashes) {
        break
      }
    }
    if (flashes === vs.length) {
      return step
    }
  }
}

export const d12 = ({
  input = inputs.d12,
  pre,
  post,
}: {
  input?: string
  pre: (node: string) => boolean
  post: (node: string) => void
}) => {
  const graph = clean(input)
    .split(/\n/)
    .map(s => s.split('-'))
    .reduce((graph, [k, v]) => {
      if (v !== 'start') {
        graph[k] = graph[k] || []
        graph[k].push(v)
      }
      if (k !== 'start') {
        graph[v] = graph[v] || []
        graph[v].push(k)
      }
      return graph
    }, {})
  let n = 0
  const walk = (node: string) => {
    if (node === 'end') {
      n++
    } else {
      for (const next of graph[node]) {
        pre(next) && (walk(next), post(next))
      }
    }
  }
  walk('start')
  return n
}

export const d12a = props => {
  const sm = (s: string) => s.charCodeAt(0) >= 97
  const v = {}
  return d12({
    ...props,
    pre: (node: string) => (v[node] ? false : ((v[node] = sm(node)), true)),
    post: (node: string) => (v[node] = false),
  })
}

export const d12b = props => {
  const sm = (s: string) => s.charCodeAt(0) >= 97
  const v = {}
  let twice = null
  return d12({
    ...props,
    pre: (node: string) =>
      v[node] && twice
        ? false
        : v[node]
        ? ((twice = node), true)
        : ((v[node] = sm(node)), true),
    post: (node: string) =>
      twice === node ? (twice = null) : (v[node] = false),
  })
}

// const P = tagged('P', ['x', 'y'])

// P.prototype.equals = function(that){ return  this.x === that.x && this.y === that.y }

export * from './d13'
export * from './d14'
export * from './d15'
export * from './d16'
export * from './d17'
export * from './d18'
export * from './d19'
