import styled, {css, system, th} from '@xstyled/styled-components'
import {withProperties} from 'lib/ts-helpers'

export const Page = styled.div`
  padding: pagePadding;
  display: grid;
  // minmax here allows pre to fit with max-width
  // https://css-tricks.com/preventing-a-grid-blowout/
  grid-template-columns: ${th('sizes.logo')} minmax(0, ${th('sizes.container')});
  grid-template-areas:
    'logo nav'
    'title title'
    'meta meta'
    'main main'
    'footer footer';
  column-gap: gutter;

  @media (min-width: desktop) {
    // center on the content column, not the full grid including logo column
    margin-left: max(
      0px,
      calc(
        50vw - (${th('sizes.container')} / 2) -
          (
            ${th('space.pagePadding')} + ${th('sizes.logo')} +
              ${th('space.gutter')}
          )
      )
    );
    grid-template-areas:
      'logo title'
      '. meta'
      'nav main'
      '. footer';
  }

  ${system}
`

export const Nav = styled.nav`
  grid-area: nav;
  display: flex;
  font-family: meta;
  font-size: metaLg;

  > *:not(:first-child) {
    margin-left: 6;
  }

  @media (min-width: desktop) {
    margin-top: 4;
    margin-left: 1;
    flex-direction: column;

    > *:not(:first-child) {
      margin-left: 0;
      margin-top: 2;
    }
  }

  ${system}
`

export const Heading = styled.h1`
  grid-area: title;
  align-self: end;
  margin-top: 6;
  margin-bottom: 0;
  ${system}
`

export const PostMeta = styled.div`
  grid-area: meta;
  margin-top: 1;
  font-family: meta;
  font-size: metaSm;
`

export const Main = styled.main`
  grid-area: main;
  margin-top: 4;
`

export const Footer = withProperties(
  styled.footer`
    grid-area: footer;
    margin-top: 6;
    padding-top: 4;
    padding-bottom: 8;
    border-top: 3px solid;
    border-top-color: accent;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: meta;
    ${system}
  `,
  {
    Site: styled.div`
      margin-bottom: 4;
      font-size: metaSm;
      ${system}
    `,
    Social: styled.div`
      a {
        margin-left: 0.5em;
      }
      svg {
        width: 20px;
      }
      ${system}
    `,
  },
)

export const Posts = withProperties(
  styled.ul`
    ${system}
  `,
  {
    Item: styled.li`
      margin-bottom: 6;
    `,
    Header: styled.header`
      > *:first-child {
        margin-top: 0;
      }
      > *:last-child {
        margin-bottom: 0;
      }
    `,
    Excerpt: styled.p`
      margin-bottom: 15;
    `,
    Footer: styled.footer`
      font-family: meta;
      font-size: metaSm;
      margin-top: 1;
    `,
  },
)

export const hr = css`
  border: none;
  border-top: 3px solid;
  border-top-color: accent;
`

export const Rule = styled.hr`
  ${hr}
  ${system}
`

export const blockquote = css`
  font-style: italic;
  margin-left: 4;
  padding-left: 4;
  border-left: 2px solid;
  border-left-color: accent;
  margin-right: 8;
`

export const papercolor = css`
  /* https://github.com/NLKNguyen/papercolor-theme */
  pre,
  code {
    --color00: #eeeeee;
    --color01: #af0000;
    --color02: #008700;
    --color03: #5f8700;
    --color04: #0087af;
    --color05: #878787;
    --color06: #005f87;
    --color07: #444444;
    --color08: #bcbcbc;
    --color09: #d70000;
    --color10: #d70087;
    --color11: #8700af;
    --color12: #d75f00;
    --color13: #d75f00;
    --color14: #005faf;
    --color15: #005f87;
    --color16: #0087af;
    --color17: #008700;
    --visual-fg: #eeeeee;
    --visual-bg: #0087af;
  }

  @media (prefers-color-scheme: dark) {
    pre,
    code {
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
  }

  pre,
  code {
    --background: var(--color00);
    --negative: var(--color01);
    --positive: var(--color02);
    --olive: var(--color03);
    --neutral: var(--color04);
    --comment: var(--color05);
    --navy: var(--color06);
    --foreground: var(--color07);
    --nontext: var(--color08);
    --red: var(--color09);
    --pink: var(--color10);
    --purple: var(--color11);
    --accent: var(--color12);
    --orange: var(--color13);
    --blue: var(--color14);
    --highlight: var(--color15);
    --aqua: var(--color16);
    --green: var(--color17);
    --wine: var(--color18);
  }

  pre,
  code {
    background: var(--background);
  }

  code {
    color: var(--foreground);
  }

  code::selection,
  code ::selection {
    color: var(--visual-fg);
    background: var(--visual-bg);
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: var(--comment);
    font-style: italic;
  }

  .token.punctuation {
    color: var(--pink);
  }

  .token.variable,
  .token.operator {
    color: var(--aqua);
  }

  .token.selector,
  .token.keyword,
  .token.tag {
    color: var(--blue);
  }

  .token.class-name,
  .token.constant,
  .token.number,
  .token.symbol,
  .token.function {
    color: var(--orange);
  }

  .token.boolean {
    color: var(--green);
    font-weight: bold;
  }

  .token.string,
  .token.char {
    color: var(--olive);
  }

  /* don't surround blue tags with pink angle brackets */
  .language-html .token.punctuation,
  .language-xml .token.punctuation {
    color: inherit;
  }

  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

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
`

export const Quote = styled.blockquote`
  ${blockquote}
  ${system}
`

export const table = css`
  font-family: sans;
  font-size: 0.75rem;
  margin-bottom: 4;
  border-collapse: collapse;

  thead,
  th {
    font-weight: bold;
  }

  th,
  td {
    text-align: left;
    padding-left: 1.5em;
    padding-right: 1.5em;
    border-left: thin solid var(--accent-color);
    &:first-child {
      border-left: none;
    }
  }

  thead tr:last-child {
    th,
    td {
      padding-bottom: 1em;
    }
  }

  tbody tr:first-child {
    th,
    td {
      padding-top: 1em;
    }
  }

  thead tr:first-child {
    th,
    td {
      padding-top: 0.5em;
    }
  }

  tbody tr:last-child {
    th,
    td {
      padding-bottom: 0.5em;
    }
  }

  tbody {
    border-top: thin solid var(--accent-color);
  }
`

/**
 * https://searchfox.org/mozilla-central/source/layout/style/res/html.css
 */
export const ol = css`
  margin-block-start: ${th('space.4')};
  margin-block-end: ${th('space.4')};
  padding-inline-start: 40px;
  list-style-type: decimal;
`
export const ul = css`
  margin-block-start: ${th('space.4')};
  margin-block-end: ${th('space.4')};
  padding-inline-start: 40px;
  list-style-type: disc;
`

export const prose = css`
  hr {
    ${hr}
  }

  blockquote {
    ${blockquote}
  }

  table {
    ${table}
  }

  /* https://searchfox.org/mozilla-central/source/layout/style/res/html.css */
  ol {
    ${ol}
  }

  ul {
    ${ul}
  }

  pre {
    border-radius: 4px;
    max-width: 100%;
    padding: 4;
    overflow-x: auto;
  }

  *:not(pre) > code {
    padding: 2px 3px;
    border-radius: 3px;
  }

  ${papercolor}

  .note {
    padding: 1em;
    border: thin solid;
    border-color: note;
    border-radius: 4px;
    box-shadow: 0 0 10px ${th('colors.note')};
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  .post-image {
    margin-top: 6;
    margin-bottom: 6;

    a,
    img,
    video {
      display: block;
    }

    img,
    video {
      width: auto;
    }

    @media (min-width: desktop) {
      margin-left: 3em;
      margin-right: 2em;
      max-width: 28em;

      .wide {
        margin-left: 0em;
        margin-right: 0em;
        max-width: none;
      }

      .bleed {
        margin-left: 0em;
        margin-right: 0em;
        max-width: none;
        width: 100vw;
        visibility: hidden;
      }

      .bled {
        margin-left: 0em;
        margin-right: 0em;
        max-width: none;
        position: absolute;
        left: 0;
        width: 100%;
        margin-top: 0;
      }
    }
  }
`

export const Markdown = styled.div`
  ${prose}
`
