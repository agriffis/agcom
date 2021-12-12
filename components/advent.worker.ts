import * as R from 'remeda'
import {AdventProps} from './advent-types'
import * as days from './advent'

self.addEventListener('message', (event: any) => {
  console.log('worker received:', event.data)
  const props = event.data as AdventProps
  global.dbg = props.debug
    ? (x, ...args) => {
        self.postMessage({debug: [x, ...args].map(stringify).join(' ')})
        return x
      }
    : x => x
  const fn =
    days[`d${event.data.day}${event.data.part}`] || days[`d${event.data.day}`]
  const result = fn(props)
  self.postMessage({result})
})

function stringify(x: any): string {
  return Array.isArray(x) || R.isObject(x)
    ? JSON.stringify(x, (_, v) => v?.dbg?.() || v)
    : `${x}`
}

// Calm down TS isolatedModules
export {}
