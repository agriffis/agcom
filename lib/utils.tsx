export const slugDateRe = /^\d\d\d\d-\d\d-\d\d/

export function enrichFrontMatter({data, slug}: {data: any; slug: string}) {
  return {
    ...data,
    slug,
    created: slug.startsWith('2')
      ? new Date(slug.match(slugDateRe)[0])
      : new Date(),
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
