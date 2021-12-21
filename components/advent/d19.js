import * as inputs from './inputs'
import {int, paras, ranks} from './lib'
import {map} from 'iter-tools-es'
import * as R from 'ramda'

import {create, env} from 'sanctuary'
import $ from 'sanctuary-def'
import Z from 'sanctuary-type-classes'
import type from 'sanctuary-type-identifiers'

const uniqueObjs = ps => {
  const seen = new WeakMap()
  return ps.filter(p => (seen.has(p) ? false : seen.set(p, true)))
}

const groupByObj = fn => {
  const ks = new WeakMap()
  let i = 0
  return R.pipe(
    // [item, ...]
    R.map(item => [fn(item), item]),
    // [[ko, item], ...]
    R.groupBy(([ko]) => ks.get(ko) || (ks.set(ko, ++i), i)),
    // {k: [[ko, item], ...]}
    R.values,
    // [[[ko, item], ...], ...]
    R.map(pairs => [pairs[0][0], pairs.map(([_, v]) => v)]),
  )
}

const rot2d = [
  ([x, y]) => [x, y],
  ([x, y]) => [y, -x],
  ([x, y]) => [-x, -y],
  ([x, y]) => [-y, x],
]

const rotZ = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-y, x, z],
]

const rotY = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-z, y, x],
]

const rotX = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, y],
]

const rot3d = rotZ
  .flatMap(fz =>
    rotY.flatMap(fy => rotX.map(fx => coords => fz(fy(fx(coords))))),
  )
  .reduce(
    ({fns, seen}, fn) => {
      const r = JSON.stringify(fn([3, 4, 5]))
      if (!seen.has(r)) {
        fns.push(fn)
        seen.add(r)
      }
      return {fns, seen}
    },
    {fns: [], seen: new Set()},
  ).fns

const rotations = {2: rot2d, 3: rot3d}

//----------------------------------------------------------------------
// Point
//----------------------------------------------------------------------

// pointTypeIdent :: String
const pointTypeIdent = 'advent/Point@1'

const Point$prototype = {
  '@@type': pointTypeIdent,
  '@@show': function () {
    return `Point (${this.coords.join(', ')})`
  },
  // fantasy-land/equals :: Setoid a => a ~> a -> Boolean
  'fantasy-land/equals': function (other) {
    return S.equals(other.coords)(this.coords)
  },
  // fantasy-land/lte :: Ord a => a ~> a -> Boolean
  'fantasy-land/lte': function (other) {
    return S.lte(other.coords)(this.coords)
  },
  translate: function (translation) {
    return Point(this.coords.map((coord, i) => coord + translation[i]))
  },
  rotate: function (rfn) {
    return Point(rfn(this.coords))
  },
  rotationsIter: function* () {
    yield* map(
      (rfn, i) => (i ? this.rotate(rfn) : this),
      rotations[this.coords.length],
    )
  },
  fromOrigin: function (origin) {
    return this.translate(origin.coords.map(x => -x))
  },
}

// Point :: Number[] -> Point
function Point(coords) {
  const point = Object.create(Point$prototype)
  point.coords = coords
  return point
}

// PointType :: () -> Type
// prettier-ignore
const PointType = $.NullaryType
  ('Point')
  ('https://arongriffis.com/advent2021#Point')
  ([])
  (x => type(x) === pointTypeIdent)

//----------------------------------------------------------------------
// Segment
//----------------------------------------------------------------------

// segmentTypeIdent :: String
const segmentTypeIdent = 'advent/Segment@1'

const Segment$prototype = {
  '@@type': segmentTypeIdent,
  '@@show': function () {
    return `Segment (${S.show(this.a)}, ${S.show(this.b)})`
  },
}

// Segment :: (Point, Point) -> Segment
function Segment(a, b) {
  const segment = Object.create(Segment$prototype)
  segment.a = a
  segment.b = b
  segment.length = R.zip(a.coords, b.coords).reduce(
    (length, [ax, bx]) => length + (bx - ax) ** 2,
    0,
  )
  return segment
}

// SegmentType :: () -> Type
// prettier-ignore
const SegmentType = $.NullaryType
  ('Segment')
  ('https://arongriffis.com/advent2021#Segment')
  ([])
  (x => type(x) === segmentTypeIdent)

//----------------------------------------------------------------------
// Space
//----------------------------------------------------------------------

// spaceTypeIdent :: String
const spaceTypeIdent = 'advent/Space@1'

const Space$prototype = {
  '@@type': spaceTypeIdent,
  '@@show': function () {
    return `Space`
  },
  translate: function (translation) {
    return Space(
      S.map(p => p.translate(translation))(this.scanners),
      S.map(p => p.translate(translation))(this.points),
    )
  },
  rotate: function (rfn) {
    return Space(
      S.map(p => p.rotate(rfn))(this.scanners),
      S.map(p => p.rotate(rfn))(this.points),
    )
  },
  fromOrigin: function (origin) {
    return Space(
      S.map(p => p.fromOrigin(origin))(this.scanners),
      S.map(p => p.fromOrigin(origin))(this.points),
    )
  },
  segmentsIter: function* () {
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        yield Segment(this.points[i], this.points[j])
      }
    }
  },
  rotationsIter: function* () {
    yield* map(
      (rfn, i) => (i ? this.rotate(rfn) : this),
      rotations[this.dimensions],
    )
  },
  // fantasy-land/concat :: Semigroup a => a ~> a -> a
  'fantasy-land/concat': function (other) {
    return Space(
      [...this.scanners, ...other.scanners],
      S.sort([...this.points, ...other.points]).filter(
        (p, i, points) => !i || !S.equals(p)(points[i - 1]),
      ),
    )
  },
}

// Space :: (Point[], Point[]) -> Space
function Space(scanners, points) {
  const space = Object.create(Space$prototype)
  space.points = points
  space.scanners = scanners
  space.dimensions = scanners[0].coords.length
  return space
}

// SpaceType :: () -> Type
// prettier-ignore
const SpaceType = $.NullaryType
  ('Space')
  ('https://arongriffis.com/advent2021#Space')
  ([])
  (x => type(x) === spaceTypeIdent)

//----------------------------------------------------------------------
// Type system
//----------------------------------------------------------------------

const S = create({
  checkTypes: false, //process.env.NODE_ENV !== 'production',
  env: env.concat([PointType, SegmentType, SpaceType]),
})

//----------------------------------------------------------------------
// Problems
//----------------------------------------------------------------------

function countMatching(a, b) {
  let count = 0
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (S.equals(a[i])(b[j])) {
      count++
      i++
      j++
    } else if (S.lt(b[j])(a[i])) {
      i++
    } else {
      j++
    }
  }
  return count
}

const pick = props => obj => {
  const result = {}
  for (const p of props) {
    result[p] = obj[p]
  }
  return result
}

function lengths(space) {
  return Array.from(space.segmentsIter())
    .map(segment => segment.length)
    .sort()
}

function combinations(xs) {
  return xs.flatMap((a, i) => xs.slice(i + 1).map(b => [a, b]))
}

function candidateMergePoints(a, b, required = 12) {
  const segmentsByLength = R.pipe(
    R.groupBy(R.prop('length')), // segment.length, not segments.length
    R.toPairs,
    // Less common segment lengths are more interesting because they yield fewer
    // points to try. This will get resorted further down, but it will be
    // a stable sort.
    R.sortBy(([_, segments]) => segments.length),
    R.fromPairs,
  )
  const asbl = segmentsByLength(Array.from(a.segmentsIter()))
  const bsbl = segmentsByLength(Array.from(b.segmentsIter()))

  for (let done = false; !done && (done = true); ) {
    // Eliminate any that are unique to space a or b.
    const uniqueLengths = R.symmetricDifference(R.keys(asbl), R.keys(bsbl))
    uniqueLengths.forEach(k => {
      delete asbl[k]
      delete bsbl[k]
    })

    // For the remaining segments, count how many times each point appears in
    // a segment. Since there will be at least 12 overlapping points, we know the
    // points that are interesting to us will appear in at least 11 segments.
    for (const sbl of [asbl, bsbl]) {
      const pc = new WeakMap()
      for (const segments of Object.values(sbl)) {
        for (const {a, b} of segments) {
          pc.set(a, (pc.get(a) || 0) + 1)
          pc.set(b, (pc.get(b) || 0) + 1)
        }
      }
      for (const [length, segments] of Object.entries(sbl)) {
        sbl[length] = segments.filter(
          ({a, b}) => pc.get(a) >= required - 1 && pc.get(b) >= required - 1,
        )
        done &&= sbl[length].length === segments.length
      }
      for (const [length, segments] of Object.entries(sbl)) {
        if (!segments.length) {
          delete sbl[length]
        }
      }
    }
  }

  const candidatePairs = R.pipe(
    // {length: asegs}
    R.toPairs,
    // [[length, asegs], ...]
    R.map(([length, asegs]) => [asegs, bsbl[length]]),
    // [[asegs, bsegs], ...]
    R.map(R.map(R.chain(({a, b}) => [a, b]))),
    // [[aps, bps], ...]
    R.chain(([aps, bps]) => aps.map(ap => [ap, bps])),
    // [[ap, bps], ...]
    groupByObj(R.head),
    // [[ap, [[ap, bps], ...], ...]
    R.map(([ap, apbps]) => [ap, R.chain(([_, bps]) => bps, apbps)]),
    // [[ap, bps with dups]]
    R.map(([ap, bps]) => [ap, uniqueObjs(bps)]),
    // [[ap, bps unique]]
    R.sortBy(([_, bps]) => bps.length),
    // shorter RHS
  )(asbl)

  return candidatePairs
}

function merge(a, b, required = 12) {
  for (const br of b.rotationsIter()) {
    for (const [ap, bps] of candidateMergePoints(a, br, required)) {
      for (const bp of bps) {
        const bt = br.translate(
          bp.coords.map((coord, i) => ap.coords[i] - coord),
        )
        const c = S.concat(a)(bt)
        if (c.points.length <= a.points.length + b.points.length - required) {
          return c
        }
      }
    }
  }
}

const parse = input => {
  const dimensions = paras(input)[0].split(/\n/)[1].split(',').length
  return paras(input)
    .map(s => s.match(/-?\d+/g).map(int))
    .map(ns => ranks(ns.slice(1), dimensions).map(Point))
    .map(points => Space([Point(Array(dimensions).fill(0))], points))
}

const manhattan = (a, b) => a.reduce((sum, x, i) => sum + Math.abs(x - b[i]), 0)

export function d19({input = inputs.d19, part}) {
  let spaces = parse(input)
  while (spaces.length > 1) {
    console.log('spaces.length =', spaces.length)
    out: for (let i = 0; i < spaces.length; i++) {
      for (let j = i + 1; j < spaces.length; j++) {
        console.log('trying to merge', i, j)
        const c = merge(spaces[i], spaces[j])
        if (c) {
          console.log('MERGED!')
          spaces = [
            ...spaces.slice(i + 1, j),
            ...spaces.slice(j + 1),
            ...spaces.slice(0, i),
            c,
          ]
          break out
        }
      }
    }
  }
  return {
    'part a': spaces[0].points.length,
    'part b': Math.max(
      ...spaces[0].scanners.flatMap(a => scanners.map(b => manhattan(a, b))),
    ),
  }
}

d19.uniqueObjs = uniqueObjs
d19.groupByObj = groupByObj
d19.parse = parse
d19.merge = merge
