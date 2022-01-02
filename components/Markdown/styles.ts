import {mergeDeepRight} from 'ramda'
import {styled} from 'stitches.config'

/**
 * https://github.com/NLKNguyen/papercolor-theme
 */
const syntax = {
  'pre, code': {
    '--color00': '#eeeeee',
    '--color01': '#af0000',
    '--color02': '#008700',
    '--color03': '#5f8700',
    '--color04': '#0087af',
    '--color05': '#878787',
    '--color06': '#005f87',
    '--color07': '#444444',
    '--color08': '#bcbcbc',
    '--color09': '#d70000',
    '--color10': '#d70087',
    '--color11': '#8700af',
    '--color12': '#d75f00',
    '--color13': '#d75f00',
    '--color14': '#005faf',
    '--color15': '#005f87',
    '--color16': '#0087af',
    '--color17': '#008700',
    '--visual-fg': '#eeeeee',
    '--visual-bg': '#0087af',

    /* TODO
    body.xstyled-color-mode-dark & {
      --color00: #1c1c1c;
      --color01: #af005f;
      --color02: #5faf00;
      --color03: #d7af5f;
      --color04: #5fafd7;
      --color05: #808080;
      --color06: #d7875f;
      --color07: #d0d0d0;
      --color08: #585858;
      --color09: #5faf5f;
      --color10: #afd700;
      --color11: #af87d7;
      --color12: #ffaf00;
      --color13: #ff5faf;
      --color14: #00afaf;
      --color15: #5f8787;
      --visual-fg: #000000;
      --visual-bg: #8787af;
    }
    */

    '--background': 'var(--color00)',
    '--negative': 'var(--color01)',
    '--positive': 'var(--color02)',
    '--olive': 'var(--color03)',
    '--neutral': 'var(--color04)',
    '--comment': 'var(--color05)',
    '--navy': 'var(--color06)',
    '--foreground': 'var(--color07)',
    '--nontext': 'var(--color08)',
    '--red': 'var(--color09)',
    '--pink': 'var(--color10)',
    '--purple': 'var(--color11)',
    '--accent': 'var(--color12)',
    '--orange': 'var(--color13)',
    '--blue': 'var(--color14)',
    '--highlight': 'var(--color15)',
    '--aqua': 'var(--color16)',
    '--green': 'var(--color17)',
    '--wine': 'var(--color18)',

    background: 'var(--background)',
    color: 'var(--foreground)',
  },

  code: {
    '&::selection, & ::selection': {
      color: 'var(--visual-fg)',
      background: 'var(--visual-bg)',
    },

    '.token.comment, .token.prolog, .token.doctype, .token.cdata': {
      color: 'var(--comment)',
      fontStyle: 'italic',
    },

    '.token.punctuation': {
      color: 'var(--pink)',
    },

    '.token.variable, .token.operator': {
      color: 'var(--aqua)',
    },

    '.token.selector, .token.keyword, .token.tag': {
      color: 'var(--blue)',
    },

    '.token.class-name, .token.constant, .token.number, .token.symbol, .token.function':
      {
        color: 'var(--orange)',
      },

    '.token.boolean': {
      color: 'var(--green)',
      fontWeight: '$bold',
    },

    '.token.string, .token.char': {
      color: 'var(--olive)',
    },

    // don't surround blue tags with pink angle brackets
    '.language-html .token.punctuation, .language-xml .token.punctuation': {
      color: 'inherit',
    },

    '.token.bold': {
      fontWeight: '$bold',
    },

    '.token.italic': {
      fontStyle: 'italic',
    },

    /*
  .token.namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.symbol,
  .token.deleted {
    color: #905;
  }

  .token.selector,
  .token.attr-name,
  .token.inserted {
    color: #690;
  }

  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #9a6e3a;
    /* This background color was intended by the author of this theme.
    background: hsla(0, 0%, 100%, .5);
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #07a;
  }

  .token.class-name {
    color: #DD4A68;
  }

  .token.regex,
  .token.important {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
  */
  },
}

const prose = {
  'p.note': {
    padding: '1em',
    border: 'thin solid',
    borderColor: 'note',
    borderRadius: '4px',
    'box-shadow': '0 0 10px $colors$note',
  },

  blockquote: {
    fontStyle: 'italic',
    marginLeft: '$4',
    paddingLeft: '$4',
    borderLeft: '2px solid',
    borderLeftColor: '$accent',
    marginRight: '$8',
  },

  /**
   * https://searchfox.org/mozilla-central/source/layout/style/res/html.css
   */
  'ol, ul': {
    marginBlockStart: '$4',
    marginBlockEnd: '$4',
    paddingInlineStart: '40px',
  },
  ol: {
    listStyleType: 'decimal',
  },
  ul: {
    listStyleType: 'disc',
  },

  code: {
    padding: '2px 3px',
    'border-radius': '3px',
  },
  pre: {
    borderRadius: '4px',
    maxWidth: '100%',
    padding: '$4',
    overflowX: 'auto',
    '& > code': {
      padding: '0',
      borderRadius: 'unset',
    },
  },

  table: {
    fontFamily: 'sans',
    fontSize: '0.75rem',
    marginBottom: '$4',
    borderCollapse: 'collapse',
  },
  thead: {
    'tr:first-child': {
      'th, td': {
        paddingTop: '0.5em',
      },
    },
    'tr:last-child': {
      'th, td': {
        paddingBottom: '1em',
      },
    },
  },
  tbody: {
    borderTop: 'thin solid',
    borderTopColor: '$accent',
    'tr:first-child': {
      'th, td': {
        paddingTop: '1em',
      },
    },
    'tr:last-child': {
      'th, td': {
        paddingBottom: '0.5em',
      },
    },
  },
  'th, td': {
    textAlign: 'left',
    paddingLeft: '$6',
    paddingRight: '$6',
    borderLeft: 'thin solid',
    borderLeftColor: 'accent',
    '&:first-child': {
      borderLeft: 'none',
    },
  },
  th: {
    fontWeight: '$bold',
  },
  hr: {
    border: 'none',
    borderTop: '3px solid',
    borderTopColor: '$accent',
  },
}

export const Markdown = styled('div', mergeDeepRight(prose, syntax))
