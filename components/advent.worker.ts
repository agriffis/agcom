import {AdventProps} from './advent-types'
import * as days from './advent'

self.addEventListener('message', (event: any) => {
  console.log('worker received:', event.data)
  const props = event.data as AdventProps
  const result = days[`d${event.data.day}${event.data.part}`]({
    ...(event.data as AdventProps),
    dbg: props.debug
      ? (...args: any) => {
          self.postMessage({debug: args.join(' ')})
        }
      : () => {},
  })
  self.postMessage({result})
})

// Calm down TS isolatedModules
export {}
