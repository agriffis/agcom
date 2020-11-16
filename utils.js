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
