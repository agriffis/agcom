export const slugDateRe = /^[12]\d\d\d-\d\d-\d\d/

export const enrichFrontMatter = ({data, slug}) => ({
  ...data,
  slug,
  created: new Date(slug.match(slugDateRe)[0]),
  ...(data.updated && {
    updated: new Date(data.updated),
  }),
})

export const isoDate = d => d.toISOString()

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

export const shortDate = d =>
  `${shortMonths[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`

const xmlEscapes = {
  "'": '&apos;',
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const xmlEscapeRx = new RegExp(`[${Object.keys(xmlEscapes).join('')}]`, 'g')

export function escapeXml(s) {
  return ('' + s).replace(xmlEscapeRx, c => xmlEscapes[c])
}

export function escapeCdata(s) {
  return ('' + s).split(']]>').join(']]]]><![CDATA[>')
}

export function cdata(s) {
  return `<![CDATA[${escapeCdata(s)}]]>`
}
