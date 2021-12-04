import {Button} from './Button'
import {ReactElement, useEffect, useRef, useState} from 'react'

const useWorker = (message: any, cb: any) => {
  const [worker] = useState(() => {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./advent.worker.ts', import.meta.url))
      worker.addEventListener('message', (event: any) => cb(event.data))
      worker.postMessage(message)
      return worker
    }
  })

  // Terminate on unmount
  useEffect(() => () => worker.terminate(), [worker])

  return worker
}

interface AdventProps {
  day: number
  part: 'a' | 'b'
  input: string
  debug?: boolean
}

interface Day {
  (props: AdventProps): ReactElement<any, any>
}

const AnyDayNow: Day = (props: AdventProps) => {
  const [debug, setDebug] = useState<string>('')
  const [result, setResult] = useState<string>('')

  useWorker(props, data => {
    console.log('received from worker', data)
    if (data.result) {
      setResult(data.result)
    } else if (data.debug) {
      setDebug(debug => debug + '\n' + data.debug)
    }
  })

  return (
    <>
      {result}
      {debug && (
        <>
          {'\n\n'}DEBUG:{debug}
        </>
      )}
    </>
  )
}

const days: {
  [key: string]: Day
} = {}

const Advent = (props: AdventProps) => {
  const {day, part} = props
  const D = days[`Day${day}${part}`] || AnyDayNow
  const ref = useRef<HTMLPreElement>()
  const [running, setRunning] = useState(process.env.NODE_ENV !== 'production')
  const [minHeight, setMinHeight] = useState<string | undefined>(undefined)
  const run = () => {
    setMinHeight(`${ref.current.offsetHeight}px`)
    setRunning(true)
  }
  return (
    <pre style={{minHeight}} ref={ref}>
      {running ? <D {...props} /> : <Button onPress={run}>Run!</Button>}
    </pre>
  )
}

export default Advent // easier for dynamic import
