import {parse10} from './lib'
import * as inputs from './inputs'

const draw = (grid: number[]) => {
  const size = Math.sqrt(grid.length)
  return grid.reduce((s, c, i) => s + c + ((i + 1) % size ? ' ' : '\n'), '')
}

/**
 * Measure the cost of traveling from the top-left corner to the bottom-right
 * corner by the least-expensive path.
 */
const measure = (grid: number[]): number => {
  const size = Math.sqrt(grid.length)

  // Our grid is a 1D array, so make functions to look the various directions.
  // These functions return an index, or alternatively something that will
  // return undefined when used as a subscript.
  const left = (i: number) => (i % size ? i - 1 : undefined)
  const up = (i: number) => i - size
  const right = (i: number) => ((i + 1) % size ? i + 1 : undefined)
  const down = (i: number) => i + size

  // Initial cost of reaching each cell is infinite until we start scanning.
  const cost = [0, ...Array(grid.length - 1).fill(Infinity)]

  for (let settled; !settled && (settled = true); ) {
    // Scan top-to-bottom, left-to-right.
    for (let i = 1; i < grid.length; i++) {
      const c = Math.min(
        (cost[left(i)] ?? Infinity) + grid[i],
        (cost[up(i)] ?? Infinity) + grid[i],
      )
      if (c < cost[i]) {
        cost[i] = c
        settled = false
      }
    }

    // Scan bottom-to-top, right-to-left. This is an optimization over putting
    // the right/down checks in the first loop, for the domino effect.
    for (let i = grid.length - 2; i; i--) {
      const c = Math.min(
        (cost[right(i)] ?? Infinity) + grid[i],
        (cost[down(i)] ?? Infinity) + grid[i],
      )
      if (c < cost[i]) {
        cost[i] = c
        settled = false
      }
    }
  }

  // Every cell now contains the minimum cost for traversing from the start to
  // that cell.
  return cost[cost.length - 1]
}

export const d15a = ({input = inputs.d15}: {input: string}) => {
  const grid = input.match(/\S/g).map(parse10)
  return measure(grid)
}

const expand = (grid: number[], z: number) => {
  const size = Math.sqrt(grid.length)
  const big = []
  for (let gy = 0; gy < z; gy++) {
    for (let gx = 0; gx < z; gx++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = y * size + x
          const j = gy * size * size * z + y * size * z + gx * size + x
          const c = grid[i] + gy + gx
          big[j] = c % 9 || 9
        }
      }
    }
  }
  return big
}

export const d15b = ({input = inputs.d15}: {input: string}) => {
  const grid = input.match(/\S/g).map(parse10)
  return measure(expand(grid, 5))
}
