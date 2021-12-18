import * as inputs from './inputs'
import {sum, product, min, max, gt, lt, eq} from './lib'

const pad = (s: string) => (s.length % 4 ? pad('0' + s) : s)

function bitstr(input: string, startbit = 0, bitlen = input.length * 4) {
  const index = Math.floor(startbit / 4)
  const window = input.substring(index, index + Math.ceil(bitlen / 4) + 1)
  return Array.from(window)
    .map(w => pad(parseInt(w, 16).toString(2)))
    .join('')
    .substring(startbit % 4, (startbit % 4) + bitlen)
}

interface Packet {
  version: number
  length: number
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  value?: BigInt
  lengthType?: 0 | 1
  subpacketsCount?: number
  subpacketsLength?: number
  children?: Packet[]
}

function parse(bits: string, start = 0): Packet {
  if (!/[^0]/.test(bits)) {
    return // padding at end of input
  }
  let cur = start
  const bs = (len: number) => {
    const s = bits.substring(cur, cur + len)
    cur += len
    return s
  }
  const bi = (len: number) => parseInt(bs(len), 2)
  const version = bi(3)
  const type = bi(3) as Packet['type']
  if (type === 4) {
    let value = BigInt(0)
    for (let keepReading = 1; keepReading; ) {
      keepReading = bi(1)
      value = (value * 16n) | BigInt(bi(4))
    }
    return {version, type, length: cur - start, value}
  }
  const lengthType = bi(1) as Packet['lengthType']
  if (lengthType) {
    const npackets = bi(11)
    const children = Array.from(packets(bits, cur, npackets))
    return {
      version,
      type,
      length: cur - start + sum(children.map(child => child.length)),
      lengthType,
      subpacketsCount: npackets,
      children,
    }
  } else {
    const len = bi(15)
    const children = Array.from(packets(bs(len)))
    return {
      version,
      type,
      length: cur - start,
      lengthType,
      subpacketsLength: len,
      children,
    }
  }
}

function packets(bits: string, start = 0, npackets = Infinity) {
  return {
    [Symbol.iterator]: function* () {
      for (
        let count = 0, packet;
        count < npackets &&
        start < bits.length &&
        (packet = parse(bits, start));
        count++, start += packet.length
      ) {
        yield packet
      }
    },
  }
}

function* depthFirst<T extends {children?: T[]}>(node: T, fn = x => x) {
  for (const child of node.children || []) {
    yield* depthFirst(child, fn)
  }
  yield fn(node)
}

function run(
  {type, children, value}: Packet,
  dispatch: Array<(x: any) => any>,
) {
  const adults = children && children.map(child => run(child, dispatch))
  return dispatch[type](adults || value)
}

const DISPATCH = [
  sum,
  product,
  min,
  max,
  x => x,
  xs => BigInt(gt(xs)),
  xs => BigInt(lt(xs)),
  xs => BigInt(eq(xs)),
]

const DISPATCH_PYTHON = [
  xs => '(' + xs.map(String).join(' + ') + ')',
  xs => '(' + xs.map(String).join(' * ') + ')',
  xs => 'min([' + xs.map(String).join(', ') + '])',
  xs => 'max([' + xs.map(String).join(', ') + '])',
  x => x,
  xs => '(1 if ' + xs.map(String).join(' > ') + ' else 0)',
  xs => '(1 if ' + xs.map(String).join(' < ') + ' else 0)',
  xs => '(1 if ' + xs.map(String).join(' == ') + ' else 0)',
]

export function d16({input = inputs.d16, part}) {
  const packet = parse(bitstr(input))
  if (part === 'a') {
    return sum(Array.from(depthFirst(packet, node => node.version)))
  }
  return run(packet, DISPATCH)
}

d16.bitstr = bitstr
d16.parse = parse
