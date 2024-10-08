import Head from 'next/head'
import { ThemeProvider } from '../contexts/theme'
import { meta } from '../data/config'
import '../styles/index.css'
import '../styles/About.css'
import '../styles/App.css'
import '../styles/Header.css'
import '../styles/Navbar.css'
import '../styles/Intro.css'
import '../styles/Projects.css'
import '../styles/ProjectCard.css'
import '../styles/Skills.css'
import '../styles/Contact.css'
import '../styles/ScrollToTop.css'
import '../styles/Footer.css'
import 'animate.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{meta.title}</title>
        <meta name='description' content={meta.description} />
        <meta property='og:title' content={meta.title} />
        <meta property='og:site_name' content={meta.title} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={meta.url + '/' + meta.image} />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
