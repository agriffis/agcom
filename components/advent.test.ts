import {PointX, SegmentX, intersection, pointsOf} from './advent'
import {
  d6a,
  d6b,
  d7a,
  d7b,
  d8a,
  d8b,
  d9a,
  d9b,
  d10a,
  d10b,
  d11a,
  d11b,
  d12a,
  d12b,
} from './advent'

describe('Segment', () => {
  test('slope', () => {
    expect(SegmentX.from(0, 1, 2, 3).slope).toEqual(1)
    expect(SegmentX.from(0, 1, 2, 5).slope).toEqual(2)
  })
  test('yIntersect', () => {
    expect(SegmentX.from(3, 5, 4, 6).yIntersect).toEqual(2)
    expect(SegmentX.from(1, 3, 4, 3).yIntersect).toEqual(3)
    expect(SegmentX.from(4, 3, 4, 6).yIntersect).toEqual(Infinity)
  })
  test('includes', () => {
    expect(SegmentX.from(0, 1, 2, 3).includes(new PointX(1, 2))).toBeTruthy()
    expect(SegmentX.from(0, 1, 2, 3).includes(new PointX(0, 1))).toBeTruthy()
    expect(SegmentX.from(0, 1, 2, 3).includes(new PointX(2, 3))).toBeTruthy()
    expect(!SegmentX.from(0, 1, 2, 3).includes(new PointX(1, 1))).toBeTruthy()
  })
})

describe('intersection', () => {
  test('points', () => {
    expect(
      intersection(SegmentX.from(3, 3, 3, 3), SegmentX.from(4, 4, 4, 4)),
    ).toBeNull()
    expect(
      intersection(SegmentX.from(4, 4, 4, 4), SegmentX.from(4, 4, 4, 4)).equals(
        SegmentX.from(4, 4, 4, 4),
      ),
    ).toBe(true)
  })
  test('point and segment', () => {
    expect(
      intersection(SegmentX.from(3, 3, 3, 3), SegmentX.from(4, 3, 5, 3)),
    ).toBeNull()
    expect(
      intersection(SegmentX.from(3, 3, 3, 3), SegmentX.from(2, 3, 5, 3)).equals(
        SegmentX.from(3, 3, 3, 3),
      ),
    ).toBe(true)
  })
  test('non-parallel segments', () => {
    expect(
      intersection(SegmentX.from(5, 8, 5, 0), SegmentX.from(4, -1, 10, -1)),
    ).toBeNull()
    expect(
      intersection(SegmentX.from(0, 9, 5, 9), SegmentX.from(2, 2, 2, 1)),
    ).toBeNull()
    expect(
      intersection(
        SegmentX.from(5, 8, 5, 0),
        SegmentX.from(4, 0, 10, 0),
      ).equals(SegmentX.from(5, 0, 5, 0)),
    ).toBe(true)
  })
  test('parallel segments', () => {
    expect(
      intersection(SegmentX.from(5, 8, 5, 0), SegmentX.from(4, 8, 4, 0)),
    ).toBeNull()
    expect(
      intersection(SegmentX.from(5, 8, 5, 0), SegmentX.from(5, 8, 5, 0)).equals(
        SegmentX.from(5, 8, 5, 0),
      ),
    ).toBe(true)
    expect(
      intersection(
        SegmentX.from(5, 8, 5, 0),
        SegmentX.from(5, 7, 5, 10),
      ).equals(SegmentX.from(5, 7, 5, 8)),
    ).toBe(true)
  })
})

describe('pointsOf', () => {
  const lr = ['3,3', '4,3', '5,3', '6,3', '7,3', '8,3']
  test('l->r', () =>
    expect(Array.from(pointsOf(SegmentX.from(3, 3, 8, 3))).sort()).toEqual(lr))
  test('r->l', () =>
    expect(Array.from(pointsOf(SegmentX.from(8, 3, 3, 3))).sort()).toEqual(lr))
  const tb = ['8,-1', '8,-2', '8,-3', '8,0', '8,1', '8,2', '8,3']
  test('t->b', () =>
    expect(Array.from(pointsOf(SegmentX.from(8, 3, 8, -3))).sort()).toEqual(tb))
  test('b->t', () =>
    expect(Array.from(pointsOf(SegmentX.from(8, -3, 8, 3))).sort()).toEqual(tb))
})

describe('d6a', () => {
  test('sample', () => expect(d6a({input: '3,4,3,1,2'})).toEqual(5934))
  test('input', () => expect(d6a()).toEqual(356190))
})

describe('d6b', () => {
  test('sample', () => expect(d6b({input: '3,4,3,1,2'})).toEqual(26984457539))
  test('input', () => expect(d6b()).toEqual(1617359101538))
})

describe('d7a', () => {
  test('sample', () =>
    expect(d7a({input: '16,1,2,0,4,2,7,1,2,14'})).toEqual(37))
  test('input', () => expect(d7a()).toEqual(347509))
})

describe('d7b', () => {
  test('sample', () =>
    expect(d7b({input: '16,1,2,0,4,2,7,1,2,14'})).toEqual(168))
  test('input', () => expect(d7b()).toEqual(98257206))
})

describe('d8', () => {
  const short = `
acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf
`
  const long = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`
  test('a long', () => expect(d8a({input: long})).toEqual(26))
  test('a input', () => expect(d8a()).toEqual(274))
  test('b short', () => expect(d8b({input: short})).toEqual(5353))
  test('b long', () => expect(d8b({input: long})).toEqual(61229))
  test('b input', () => expect(d8b()).toEqual(1012089))
})

describe('d9', () => {
  const sample = `
2199943210
3987894921
9856789892
8767896789
9899965678
`
  test('a', () => expect(d9a({input: sample})).toEqual(15))
  test('a', () => expect(d9a()).toEqual(458))
  test('b', () => expect(d9b({input: sample})).toEqual(1134))
  test('b', () => expect(d9b()).toEqual(1391940))
})

describe('d10', () => {
  const sample = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]
[[<[([]))<([[[[()]]]
[{[{(]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<))><([]([]()
<{([([[(<>())]>(<<{{
<{([{}[<[[[<>{}]]]>[]]
`
  test('a', () => expect(d10a({input: sample})).toEqual(26397))
  test('a', () => expect(d10a()).toEqual(323613))
  test('b', () => expect(d10b({input: sample})).toEqual(288957))
  test('b', () => expect(d10b()).toEqual(3103006161))
})

describe('d11', () => {
  const sample = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`
  test('a', () => expect(d11a({input: sample})).toEqual(1656))
  test('a', () => expect(d11a()).toEqual(1571))
  test('b', () => expect(d11b({input: sample})).toEqual(195))
  test('b', () => expect(d11b()).toEqual(387))
})

describe('d12', () => {
  const example = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`
  const slightlyLarger = `
  dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`
  const evenLarger = `
    fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
    `
  test('a example', () => expect(d12a({input: example})).toEqual(10))
  test('a slightlyLarger', () =>
    expect(d12a({input: slightlyLarger})).toEqual(19))
  test('a evenLarger', () => expect(d12a({input: evenLarger})).toEqual(226))
  test('a input', () => expect(d12a()).toEqual(3497))
  test('b example', () => expect(d12b({input: example})).toEqual(36))
  test('b slightlyLarger', () =>
    expect(d12b({input: slightlyLarger})).toEqual(103))
  test('b evenLarger', () => expect(d12b({input: evenLarger})).toEqual(3509))
  test('b input', () => expect(d12b()).toEqual(93686))
})
