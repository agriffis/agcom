export const slugDateRe = /^\d\d\d\d-\d\d-\d\d/

export function enrichFrontMatter({data, slug}: {data: any; slug: string}) {
  return {
    ...data,
    slug,
    created: slug.startsWith('2')
      ? new Date(slug.match(slugDateRe)[0])
      : new Date('1976-01-24'),
    ...(data.updated && {
      updated: new Date(data.updated),
    }),
  }
}

export function isoDate(d: Date) {
  return d.toISOString()
}

const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function shortDate(d: Date) {
  return `${
    shortMonths[d.getUTCMonth()]
  } ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

const xmlEscapes = {
  "'": '&apos;',
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const xmlEscapeRx = new RegExp(`[${Object.keys(xmlEscapes).join('')}]`, 'g')

export function escapeXml(s: string) {
  return s.replace(xmlEscapeRx, c => xmlEscapes[c])
}

export function escapeCdata(s: string) {
  return s.split(']]>').join(']]]]><![CDATA[>')
}

export function cdata(s: string) {
  return `<![CDATA[${escapeCdata(s)}]]>`
}

export function partitionProps<A, B>(
  props: A & B,
  pred: ((k: string, v: any) => boolean) | Array<keyof A>,
): [A, B] {
  if (Array.isArray(pred)) {
    const a = {} as A
    const b = {...props} as B
    for (const k of pred) {
      if (k in b) {
        ;(a as any)[k] = (b as any)[k]
        delete (b as any)[k]
      }
    }
    return [a, b]
  } else {
    const a = {} as A
    const b = {} as B
    for (const [k, v] of Object.entries(props)) {
      if (pred(k, v)) {
        ;(a as any)[k] = v
      } else {
        ;(b as any)[k] = v
      }
    }
    return [a, b]
  }
}

// https://stackoverflow.com/a/54955624
export function withProperties<A, B>(component: A, properties: B): A & B {
  Object.keys(properties).forEach(key => {
    ;(component as any)[key] = (properties as any)[key]
  })
  return component as A & B
}
