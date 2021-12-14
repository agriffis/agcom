import {ints, paras, ranks, min, max, Point, juxt} from './lib'
import * as R from 'remeda'
import * as inputs from './inputs'

const parseDots = (input: string) =>
  ranks(ints(input), 2).map(([x, y]) => ({x, y} as Point))

const parseFolds = (input: string) =>
  Array.from(input.matchAll(/([xy])=(\d+)/g)).map(
    ([_, xy, n]) => ({x: 0, y: 0, [xy]: n} as Point),
  )

const parse = (input: string) =>
  R.zipWith([parseDots, parseFolds], paras(input), (f, s) => f(s))

const fold = (dots: Point[], f: Point) =>
  R.pipe(
    dots.map(({x, y}) => ({
      x: f.x && x > f.x ? x - (x - f.x) * 2 : x,
      y: f.y && y > f.y ? y - (y - f.y) * 2 : y,
    })),
    R.uniqBy(({x, y}) => `${x},${y}`),
  )

const draw = (dots: Point[]) => {
  const ds = dots.reduce((o, {x, y}) => {
    o[y] = o[y] || {}
    o[y][x] = true
    return o
  }, {})
  const [[minx, maxx], [miny, maxy]] = ['x', 'y']
    .map(a => dots.map(p => p[a]))
    .map(ds => juxt(ds, [min, max]))
  return R.range(miny, maxy + 1)
    .map(y =>
      R.range(minx, maxx + 1)
        .map(x => (ds[y]?.[x] ? '#' : '.'))
        .join(''),
    )
    .join('\n')
}

export const d13a = ({input = inputs.d13}: {input: string}) => {
  const [dots, folds] = parse(input)
  return fold(dots, folds[0]).length
}

export const d13b = ({input = inputs.d13}: {input: string}) => {
  const [dots, folds] = parse(input)
  return draw(folds.reduce(fold, dots))
}
