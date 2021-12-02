import * as R from 'remeda'
import {AdventProps} from './advent-types'
import * as days from './advent'

self.addEventListener('message', (event: any) => {
  console.log('worker received:', event.data)
  const props = event.data as AdventProps
  const dbg = props.debug
    ? (x: any, ...rest: any) => {
        self.postMessage({debug: [x, ...rest].map(stringify).join(' ')})
        return x
      }
    : (x: any) => x
  const result = days[`d${event.data.day}${event.data.part}`]({
    ...(event.data as AdventProps),
    dbg,
  })
  self.postMessage({result})
})

function stringify(x: any): string {
  if (R.isObject(x)) {
    return JSON.stringify(x, null, 1)
  }
  return `${x}`
}

// Calm down TS isolatedModules
export {}
