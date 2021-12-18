import * as inputs from './inputs'
import {
  arrayFrom,
  compose,
  drop,
  execPipe,
  map,
  range,
  reduce,
  some,
  take,
  takeWhile,
  zip,
} from 'iter-tools-es'
import {iterate, min, max, reiterable} from './iter-lib'
import {juxt} from './lib'

export function d17({input = inputs.d17, part}) {
  const [left, right, top, bottom] = juxt(
    input.match(/[-\d]+/g).map(n => parseInt(n)),
    [
      compose(min, take(2)),
      compose(max, take(2)),
      compose(max, drop(2)),
      compose(min, drop(2)),
    ],
  )

  // 1 + 2 + ... + n
  const fn = n => (n * (n + 1)) / 2

  // solve for n
  const nf = f => (-1 + Math.sqrt(1 + 8 * f)) / 2

  const mindx = Math.ceil(nf(left)) // smallest that will reach x1
  const maxdx = right
  const mindy = bottom
  const maxdy = -bottom - 1

  if (part === 'a') {
    return fn(maxdy)
  }

  // For each initial dx value, find the range of steps that the given initdx
  // will result in hits. These are infinite, because we don't check for exit
  // from the right side, since some of them don't.
  const dxhits = execPipe(
    range(mindx, maxdx + 1),
    map(initdx => [
      initdx,
      execPipe(
        iterate(([x, dx]) => [x + dx, dx && dx - 1], [0, initdx]),
        map(([x]) => x >= left && x <= right), // hit!
        reiterable, // can't use arrayFrom because it's infinite
      ),
    ]),
    arrayFrom,
  )

  // For each initial dy value, find the range of steps that the given initdy
  // will result in hits. These are not infinite because we always fall out the
  // bottom.
  const dyhits = execPipe(
    range(mindy, maxdy + 1),
    map(initdy => [
      initdy,
      execPipe(
        iterate(([y, dy]) => [y + dy, (dy -= 1)], [0, initdy]),
        takeWhile(([y]) => y >= bottom), // make it finite
        map(([y]) => y <= top), // hit!
        arrayFrom,
      ),
    ]),
    arrayFrom,
  )

  let hits = []
  for (let [dy, dysteps] of dyhits) {
    for (let [dx, dxsteps] of dxhits) {
      if (some(([xhit, yhit]) => xhit && yhit, zip(dxsteps, dysteps))) {
        hits.push([dx, dy])
      }
    }
  }

  return {count: hits.length, hits}
}
