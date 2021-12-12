import * as R from 'remeda'
import * as inputs from './advent-inputs'
import {DayProps} from './advent-types'

export const d1a = ({input = inputs.d1}: {input?: string} = {}) =>
  R.pipe(
    input.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed(
      (count, depth, index, depths) =>
        count + Number(index && depth > depths[index - 1]),
      0,
    ),
  ).toString()

export const d1b = ({input = inputs.d1}: {input?: string} = {}) =>
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

export const d2a = ({input = inputs.d2}: {input?: string} = {}) =>
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

export const d2b = ({input = inputs.d2}: {input?: string} = {}) =>
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

export const d3a = ({input = inputs.d3}: {input?: string} = {}) => {
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

export const d3b = ({input = inputs.d3}: {input?: string} = {}) => {
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

export const is = (x: any) => x !== '' && x !== null && x !== undefined
export const parse10 = (s: string) => parseInt(s, 10)
export const clean = (s: string) => s.trim().replace(/^[^\S\n]+/gm, '')
export const paragraphs = (s: string) => clean(s).split(/\n{2,}/)
export const ints = (s: string) => clean(s).split(/\D+/).map(parse10)
export const max = (ns: number[]) => Math.max.apply(null, ns)
export const min = (ns: number[]) => Math.min.apply(null, ns)
export const sum = (ns: number[]) => reduce(ns, (sum, n) => sum + n, 0)
export const mult = (ns: number[]) =>
  reduce(ns.slice(1), (sum, n) => sum * n, ns[0])
export const inRange = (n: number, bounds: [number, number]) =>
  n >= min(bounds) && n <= max(bounds)

export const ranks = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i => xs.slice(n * i, n * (i + 1)))

export const files = <T>(xs: T[], n: number): T[][] =>
  R.times(Math.ceil(xs.length / n), i =>
    R.times(n, j => xs[i + j * n]).filter(is),
  )

const d4 = ({
  input = inputs.d4,
  pick,
}: {
  input?: string
  pick: typeof R.last
}) => {
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

export class PointX {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  equals(p: PointX) {
    return this.x === p.x && this.y === p.y
  }
  toString() {
    return `(${this.x},${this.y})`
  }
}

export class SegmentX {
  a: PointX
  b: PointX
  constructor(a: PointX, b: PointX) {
    this.a = a
    this.b = b
  }
  static from(x1: number, y1: number, x2: number, y2: number) {
    return new this(new PointX(x1, y1), new PointX(x2, y2))
  }
  get length() {
    return Math.abs(this.a.x - this.b.x || this.a.y - this.b.y) + 1
  }
  get isPoint() {
    return this.a.equals(this.b)
  }
  get slope() {
    const dx = this.a.x - this.b.x
    const dy = this.a.y - this.b.y
    const m = dy / dx
    return m // might be Infinity or -Infinity
  }
  get yIntersect() {
    const b = this.a.y - this.slope * this.a.x
    return b // might be Infinity or -Infinity
  }
  equals(g: SegmentX) {
    return (
      (this.a.equals(g.a) && this.b.equals(g.b)) ||
      (this.a.equals(g.b) && this.b.equals(g.a))
    )
  }
  includes(p: PointX) {
    const fn = (x: number) => this.slope * x + this.yIntersect
    /*
    console.debug({
      p: p.toString(),
      segment: this.toString(),
      yIntersect: this.yIntersect,
      fnx: fn(p.x),
    })
    */
    return this.isPoint
      ? this.a.equals(p)
      : this.yIntersect === Infinity || this.yIntersect === -Infinity
      ? inRange(p.y, [this.a.y, this.b.y])
      : p.y === fn(p.x) &&
        inRange(p.x, [this.a.x, this.b.x]) &&
        inRange(p.y, [this.a.y, this.b.y])
  }
  toString() {
    return `${this.a}-${this.b}`
  }
}

export const intersection = (g: SegmentX, h: SegmentX): SegmentX | null => {
  const _s = `${g}|${h}`
  if (g.equals(h)) {
    return g
  }
  if (g.isPoint) {
    return h.includes(g.a) ? g : null
  }
  if (h.isPoint) {
    return g.includes(h.a) ? h : null
  }
  const {
    a: {x: x1, y: y1},
    b: {x: x2, y: y2},
  } = g
  const {
    a: {x: x3, y: y3},
    b: {x: x4, y: y4},
  } = h
  const dx1 = x1 - x2
  const dx2 = x3 - x4
  const dy1 = y1 - y2
  const dy2 = y3 - y4
  const det = dx1 * dy2 - dx2 * dy1
  const dx3 = x1 - x3
  const dy3 = y1 - y3
  const det1 = dx1 * dy3 - dx3 * dy1
  const det2 = dx2 * dy3 - dx3 * dy2
  //console.log({dx1, dx2, dy1, dy2, det, dx3, dy3, det1, det2})
  if (det === 0) {
    // lines are parallel
    if (det1 !== 0 || det2 !== 0) {
      //console.debug(`${_s} are parallel but not colinear`)
      // parallel but not colinear, no overlap
      return null
    }
    // colinear, might overlap
    let [s, t] = dx1 // avoid div by zero
      ? [x3 / dx1, x4 / dx1]
      : [y3 / dy1, y4 / dy1]
    //console.log({s, t})
    if ((s < 0 && t < 0) || (s > 1 && t > 1)) {
      // sort the points, check for matching inner
      const [_, a, b] = [g.a, g.b, h.a, h.b].sort(
        (a, b) => a.x - b.x || a.y - b.y,
      )
      if (a.x === b.x && a.y === b.y) {
        //console.debug(`${_s} have an overlapping endpoint`, a)
        return new SegmentX(a, a)
      }
      //console.debug(`${_s} are colinear but do not overlap`)
      return null // colinear but no overlap
    }
    // sort the points, take the inner two as the overlap
    const [_, a, b] = [g.a, g.b, h.a, h.b].sort(
      (a, b) => a.x - b.x || a.y - b.y,
    )
    const overlap = new SegmentX(a, b)
    //console.debug(`${_s} overlap at ${overlap}`)
    return overlap
    /*
    if ((s < 0 && t > 1) || (s > 1 && t < 0)) {
      return g // h fully overlaps g
    }
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return h // g fully overlaps h
    }
    */
  } else {
    // not parallel, might intersect
    const s = det1 / det
    const t = det2 / det
    //console.debug({s, t})
    /*
    console.debug(_s, {s, t})
    if (s < 0 || s > 1 || t < 0 || t > 1) {
      console.debug(`${_s} are not parallel and do not intersect`)
      return null
    }
    */
    // Cramer's Rule
    const p = new PointX(x1 + t * dx1, y1 + t * dy1)
    if (g.includes(p) && h.includes(p)) {
      const overlap = new SegmentX(p, p)
      //console.debug(`${_s} intersect at ${overlap}`)
      return overlap
    }
    //console.debug(`${_s} are not parallel and do not intersect`)
    return null
  }
}

export const pointsOf = (g: SegmentX): string[] => {
  let {a, b} = g
  const dx = b.x < a.x ? -1 : b.x > a.x ? 1 : 0
  const dy = b.y < a.y ? -1 : b.y > a.y ? 1 : 0
  const points = []
  for (let x = a.x, y = a.y; x !== b.x || y !== b.y; x += dx, y += dy) {
    points.push(`${x},${y}`)
  }
  points.push(`${b.x},${b.y}`)
  return points
}

export const d5 = ({
  input = inputs.d5,
  diag = false,
}: {
  input?: string
  diag?: boolean
} = {}) => {
  const horiz = ({a, b}: SegmentX) => a.y === b.y
  const vert = ({a, b}: SegmentX) => a.x === b.x
  const lines = ranks(ints(input), 4)
    .map((v: [number, number, number, number]) => SegmentX.from(...v))
    .filter(g => diag || horiz(g) || vert(g))
  const seen = reduce(
    lines,
    (seen, line) =>
      reduce(
        pointsOf(line),
        (seen, p) => ((seen[p] = (seen[p] || 0) + 1), seen),
        seen,
      ),
    {},
  )
  return Object.values(seen).filter(n => n > 1).length
}

export const d5a = props => d5(props)

export const d5b = props => d5({...props, diag: true})

export const d6a = ({input = inputs.d6}: {input?: string} = {}) => {
  let state = ints(input)
  for (let i = 0; i < 80; i++) {
    let ns = []
    for (let s of state) {
      if (s === 0) {
        ns.push(6, 8)
      } else {
        ns.push(s - 1)
      }
    }
    state = ns
  }
  return state.length
}

export const d6b = ({input = inputs.d6}: {input?: string} = {}) => {
  let state = reduce(
    ints(input),
    (state, i) => (state[i]++, state),
    Array(9).fill(0),
  )
  for (let day = 0; day < 256; day++) {
    state[9] = state[0]
    state[7] += state[0]
    state.shift()
  }
  return sum(state)
}

export const d7a = ({input = inputs.d7}: {input?: string} = {}) => {
  const ns = ints(input)
  const costs = R.range(min(ns), max(ns)).map(pos =>
    sum(ns.map(n => Math.abs(n - pos))),
  )
  return min(costs)
}

export const d7b = ({input = inputs.d7}: {input?: string} = {}) => {
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

export const d8a = ({input = inputs.d8}: {input?: string} = {}) => {
  const digs = ranks(clean(input).split(/\W+/), 14).flatMap(xs => xs.slice(10))
  return sum(digs.map(dig => Number([2, 3, 4, 7].includes(dig.length))))
}

function isSuperset(set: Set<any>, subset: Set<any>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

function difference<T = any>(
  setA: Set<T>,
  setB: Set<any> | any[] | string,
): Set<T> {
  let _difference = new Set(setA)
  for (let elem of setB) {
    _difference.delete(elem as unknown as T)
  }
  return _difference
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

export const d8b = ({input = inputs.d8}: {input?: string} = {}) => {
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

interface Point {
  x: number
  y: number
}

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

export const d9a = ({input = inputs.d9}: {input?: string} = {}) => {
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

export const d9b = ({input = inputs.d9}: {input?: string} = {}) => {
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
    mult,
  )
}

export const d10a = ({input = inputs.d10}: {input?: string} = {}) => {
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

export const d10b = ({input = inputs.d10}: {input?: string} = {}) => {
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

export const d11a = ({input = inputs.d11}: {input?: string} = {}) => {
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

export const d11b = ({input = inputs.d11}: {input?: string} = {}) => {
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

export const d12a = (props: any) => {
  const sm = (s: string) => s.charCodeAt(0) >= 97
  const v = {}
  return d12({
    ...props,
    pre: (node: string) => (v[node] ? false : ((v[node] = sm(node)), true)),
    post: (node: string) => (v[node] = false),
  })
}

export const d12b = (props: any) => {
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
