const slugDateRe = /^[12]\d\d\d-\d\d-\d\d/

function enrichFrontMatter({data, slug}) {
  return {
    ...data,
    slug,
    created: new Date(slug.match(slugDateRe)[0]),
    ...(data.updated && {
      updated: new Date(data.updated),
    }),
  }
}

function isoDate(d) {
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

function shortDate(d) {
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

function escapeXml(s) {
  return ('' + s).replace(xmlEscapeRx, c => xmlEscapes[c])
}

function escapeCdata(s) {
  return ('' + s).split(']]>').join(']]]]><![CDATA[>')
}

function cdata(s) {
  return `<![CDATA[${escapeCdata(s)}]]>`
}

module.exports = {
  slugDateRe,
  enrichFrontMatter,
  isoDate,
  shortDate,
  escapeXml,
  escapeCdata,
  cdata,
}
