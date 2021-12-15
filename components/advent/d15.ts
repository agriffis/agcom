import {parse10} from './lib'
import * as inputs from './inputs'

const measure = (grid: number[]) => {
  const size = Math.sqrt(grid.length)
  const left = (i: number) => (i % size ? i - 1 : undefined)
  const up = (i: number) => (i >= size ? i - size : undefined)
  const right = (i: number) => ((i + 1) % size ? i + 1 : undefined)
  const down = (i: number) => i + size
  const cost = [grid[0], ...Array(grid.length - 1).fill(Infinity)]
  for (let stable; !stable && (stable = true); ) {
    for (let i = 1; i < grid.length; i++) {
      const c = Math.min(
        (cost[left(i)] || Infinity) + grid[i],
        (cost[up(i)] || Infinity) + grid[i],
      )
      if (c < cost[i]) {
        cost[i] = c
        stable = false
      }
    }
    for (let i = grid.length - 2; i; i--) {
      const c = Math.min(
        (cost[right(i)] || Infinity) + grid[i],
        (cost[down(i)] || Infinity) + grid[i],
      )
      if (c < cost[i]) {
        cost[i] = c
        stable = false
      }
    }
  }
  return cost[cost.length - 1] - cost[0]
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
