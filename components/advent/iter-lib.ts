import {drop, first, pipe, reduce} from 'iter-tools-es'

export function* iterate(fn, x) {
  while (true) {
    yield x
    x = fn(x)
  }
}

export function reiterable(iterable) {
  let arr = []
  let next = {} as {value: any; done: boolean}
  const iter = iterable[Symbol.iterator]()
  return {
    [Symbol.iterator]: function* () {
      for (let i = 0; i < arr.length || !next.done; ) {
        if (i < arr.length) {
          yield arr[i++]
        } else {
          next = iter.next()
          if (!next.done) {
            arr.push(next.value)
          }
        }
      }
    },
  }
}

export const min = reduce((best, x) => (x < best ? x : best))

export const max = reduce((best, x) => (x > best ? x : best))

export function combinations(...arrs) {
  function* _combinations([arr, ...arrs], xs: any[]) {
    if (arrs.length) {
      for (let x of arr) {
        yield* _combinations(arrs as [any, ...any[]], [...xs, x])
      }
    } else {
      for (let x of arr) {
        yield [...xs, x]
      }
    }
  }
  return arrs.length === 0 ? [] : _combinations(arrs as [any, ...any[]], [])
}

export const denumerate = ([_, x]) => x

export const second = pipe(drop(1), first)
