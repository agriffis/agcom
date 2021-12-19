import * as inputs from './inputs'
import {int, paras, ranks} from './lib'
import {map} from 'iter-tools-es'

import {create, env} from 'sanctuary'
import $ from 'sanctuary-def'
import type from 'sanctuary-type-identifiers'

const memoize = fn => {
  const memo = {}
  return x => (memo[x] ||= fn(x))
}

const rotations = memoize(n => {
  let rots = [[]]
  for (; n; n--) {
    rots = rots.flatMap(r => [
      [1, ...r],
      [-1, ...r],
    ])
  }
  return rots
})

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
  rotate: function (rotation) {
    return Point(this.coords.map((coord, i) => coord * rotation[i]))
  },
  rotationsIter: function* () {
    yield* map(this.rotate, rotations(this.coords.length))
  },
  fromOrigin: function (origin) {
    return Point(this.coords.map((coord, i) => coord - origin[i]))
  },
}

// Point :: Number[] -> Point
function Point(coords) {
  const point = Object.create(Point$prototype)
  point.coords = coords
  point.length = Math.sqrt(coords.reduce((sum, coord) => sum + coord ** 2, 0))
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
  translate: function (translation) {
    return Segment(this.a.translate(translation), this.b.translate(translation))
  },
  rotate: function (rotation) {
    return Segment(this.a.rotate(rotation), this.b.rotate(rotation))
  },
  transform: function ([rotation, translation]) {
    return this.rotate(rotation).translate(translation)
  },
  // fantasy-land/equals :: Setoid a => a ~> a -> Boolean
  'fantasy-land/equals': function (other) {
    return (
      this.length === other.length &&
      S.equals(this.b.fromOrigin(this.a), other.b.fromOrigin(other.a))
    )
  },
}

// Segment :: (Point, Point) -> Segment
function Segment(a, b) {
  const segment = Object.create(Segment$prototype)
  Object.assign(segment, Object.fromEntries(['a', 'b'], S.sort([a, b])))
  segment.length = b.origin(a).length
  return segment
}

// SegmentType :: () -> Type
// prettier-ignore
const SegmentType = $.NullaryType
  ('Segment')
  ('https://arongriffis.com/advent2021#Segment')
  ([])
  (() => false)

//----------------------------------------------------------------------
// Space
//----------------------------------------------------------------------

// spaceTypeIdent :: String
const spaceTypeIdent = 'advent/Space@1'

const Space$prototype = {
  '@@type': spaceTypeIdent,
  '@@show': function () {
    return `Space (${S.show(this.origin)}, ${this.sensors.length})`
  },
  translate: function (translation) {
    return Space(
      this.origin.translate(translation),
      S.map(p => p.translate(translation))(this.points),
      S.map(p => p.translate(translation))(this.sensors),
    )
  },
  rotate: function (rotation) {
    if (!this.origin.points.every(coord => coord === 0)) {
      throw "Don't rotate after translate"
    }
    return Space(
      this.origin,
      S.map(p => p.rotate(rotation))(this.points),
      S.map(p => p.rotate(rotation))(this.sensors),
    )
  },
  transform: function ([rotation, translation]) {
    return this.rotate(rotation).translate(translation)
  },
  segmentsIter: function* () {
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        yield Segment(this.points[i], this.points[j])
      }
    }
  },
  rotationsIter: function* () {
    yield* map(this.rotate, rotations(this.origin.length))
  },
  // fantasy-land/concat :: Semigroup a => a ~> a -> a
  'fantasy-land/concat': function (other) {
    return Space(
      this.origin,
      S.pipe(S.concat(this.points), S.sort, points =>
        points.filter((p, i) => !i || !S.equals(p, points[i - 1])),
      )(other.points),
      [...this.sensors, other.origin, ...other.sensors],
    )
  },
}

// Space :: (Point, Point[], Point[]) -> Space
function Space(origin, points = [], sensors = []) {
  const space = Object.create(Space$prototype)
  space.origin = origin
  space.points = points
  space.sensors = sensors
  return space
}

// SpaceType :: () -> Type
// prettier-ignore
const SpaceType = $.NullaryType
  ('Space')
  ('https://arongriffis.com/advent2021#Space')
  ([])
  (() => false)

//----------------------------------------------------------------------
// Type system
//----------------------------------------------------------------------

const S = create({
  checkTypes: process.env.NODE_ENV !== 'production',
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

function candidates(spaces) {
  const cands = []
  for (const a of spaces) {
    const aLengths = Array.from(a.segmentsIter())
      .map(segment => segment.length)
      .sort()
    for (const b of spaces.slice(1)) {
      const bLengths = Array.from(b.segmentsIter()).sort()
      cands.push({
        matchCount: countMatching(aLengths, bLengths),
        a,
        b,
      })
    }
  }
  return S.sortBy(S.compose(S.negate, S.prop('matchCount')))(cands)
}

export function d19({input = inputs.d19, part}) {
  const points = [Point([1, 1, 1]), Point([0, 0, 0])]
  return S.sort(points)
  let spaces = paras(input)
    .map(s => s.match(/-?\d+/g).map(int))
    .map(ns => ranks(ns.slice(1), 3).map(Point))
    .map(points => Space(Point([0, 0, 0]), points))
  return candidates(spaces)
    .map(c => c[0])
    .slice(0, 10)
  /*
  while (spaces.length > 1) {
    for (let [i, j] of candidates(spaces)) {
      if (canMerge(spaces[i], spaces[j])) {
        spaces = [
          ...spaces.slice(0, i),
          S.concat(spaces[i], spaces[j]),
          ...spaces.slice(i + 1, j),
          ...spaces.slice(j + 1),
        ]
        break
      }
    }
  }
  return spaces.length
  */
}
