import {
  ColorModeProvider,
  ThemeProvider,
  Preflight,
  createGlobalStyle,
  defaultTheme,
} from '@xstyled/styled-components'
import {AppProps} from 'next/app'

const containerRem = 36 // 576px

const fonts = {
  mono: '"Roboto Mono", monospace',
  sans: '"Roboto Condensed", sans-serif',
  serif: '"Crimson Pro", serif',
}

const {space} = defaultTheme

const theme = {
  ...defaultTheme,
  colors: {
    background: '#fff',
    text: '#555',
    heading: '#444',
    icon: '#333',
    accent: '#246eb9',
    link: '#246eb9',
    note: '#ddd',
    modes: {
      dark: {
        background: '#111',
        text: '#ccc',
        heading: '#ddd',
        accent: '#76c2fb',
        icon: '#ccc',
        link: '#76c2fb',
        note: '#444',
      },
    },
  },
  fonts: {
    ...fonts,
    meta: fonts.sans,
  },
  fontSizes: {
    metaLg: '1.25rem',
    metaSm: '0.75rem',
  },
  screens: {
    _: 0,
    container: `${containerRem * 16}px`,
    desktop: '740px',
    bigger: '820px',
    biggest: '900px',
  },
  sizes: {
    ...defaultTheme.sizes,
    container: `${containerRem}rem`,
    logo: '100px',
  },
  space: {
    ...space,
    // margin-top: 1.5 doesn't work in styled.div, only x.div
    '05': space['0.5'],
    15: space['1.5'],
    25: space['2.5'],
    35: space['3.5'],
    pagePadding: space['4'],
    gutter: space['8'],
  },
}

const GlobalStyle = createGlobalStyle`
  // Fonts
  body {
    font-family: serif;
    font-weight: normal;
  }
  h1, h2, h3, h4 {
    font-family: sans;
    font-weight: bold;
  }
  pre, code, kbd, samp, tt {
    font-family: mono;
  }

  // Typography
  html {
    font-size: 18px;
    @media (min-width: desktop) {
      font-size: 16px;
    }
    @media (min-width: bigger) {
      font-size: 18px;
    }
    @media (min-width: biggest) {
      font-size 20px;
    }
  }
  body {
    line-height: 1.5;
  }
  h1, .h1 {
    font-size: 2rem;
    line-height: 1.125;
    margin-top: 0;
    margin-bottom: 4;
  }
  h2, .h2 {
    font-size: 1.5rem;
    line-height: 1.25;
    margin-top: 10;
    margin-bottom: 4;
  }
  h3, .h3 {
    font-size: 1.25rem;
    line-height: 1.375;
    margin-top: 6;
    margin-bottom: 4;
  }
  pre, code, kbd, samp, tt {
    font-size: 0.75rem;
    line-height: 1.4;
  }
  p, pre {
    margin-top: 0;
    margin-bottom: 4;
  }

  // Colors
  body {
    background-color: background;
    color: text;
  }
  h1, h2, h3 {
    color: heading;
  }
  a {
    color: link;
    text-decoration: none;
  }
  `

const App = ({Component, pageProps}: AppProps) => (
  <ThemeProvider theme={theme}>
    <ColorModeProvider>
      <Preflight />
      <GlobalStyle />
      <Component {...pageProps} />
    </ColorModeProvider>
  </ThemeProvider>
)

export default App
