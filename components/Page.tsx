import {ReactNode} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {Footer, MyImage, S} from 'components'
import {useTheme} from '@xstyled/styled-components'
import * as site from 'lib/site'

interface PageProps {
  children: ReactNode
  description?: string
  favicon?: string
  logo?: string
  logoLink?: string
  siteTitle?: string
  title?: string
  heading?: ReactNode
  postMeta?: ReactNode
}

export function Page({
  children,
  description = null,
  favicon = site.FAVICON,
  logo = site.LOGO,
  logoLink = site.LOGO_LINK,
  siteTitle = site.TITLE,
  title = null,
  heading = title,
  postMeta = null,
}: PageProps) {
  const theme = useTheme()
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />

        <title>
          {title}
          {title && siteTitle && ' • '}
          {siteTitle}
        </title>
        <meta property="og:site_name" content={siteTitle} />
        {title && <meta property="og:title" content={title} />}

        <link rel="icon" href={favicon} />
        <meta property="og:image" content={site.IMAGES[site.LOGO].src} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />

        <link
          rel="alternate"
          type="application/atom+xml"
          title={siteTitle}
          href="/atom.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={siteTitle}
          href="/rss.xml"
        />

        <link rel="me" href="https://micro.blog/agriffis" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400&family=Roboto+Condensed:wght@400;700&family=Roboto+Mono:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <S.Page>
        <MyImage
          name={logo}
          href={logoLink}
          priority
          sizes={theme.sizes.logo}
        />
        <S.Nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </S.Nav>
        {heading && <S.Heading>{heading}</S.Heading>}
        {postMeta && <S.PostMeta>{postMeta}</S.PostMeta>}
        <S.Main>{children}</S.Main>
        <Footer />
      </S.Page>
    </>
  )
}
