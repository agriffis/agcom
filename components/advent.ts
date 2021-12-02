import * as R from 'remeda'
import * as inputs from './advent-inputs'
import {DayProps} from './advent-types'

export const d1a = ({input = inputs.d1}: DayProps) =>
  R.pipe(
    input,
    s => s.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed((n, d, i, ds) => n + Number(i && d > ds[i - 1]), 0),
  ).toString()

export const d1b = ({input = inputs.d1, dbg}: DayProps) =>
  R.pipe(
    input,
    s => s.trim().split(/\s+/),
    R.map(parseInt),
    R.reduce.indexed(
      (n, d, i, ds) =>
        n + Number(i > 2 && d > ds[i - 3] && (dbg(d, '(increased)'), true)),
      0,
    ),
  ).toString()
