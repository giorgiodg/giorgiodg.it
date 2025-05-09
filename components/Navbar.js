import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../contexts/theme'
import { meta, skills, contact } from '../data/config'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import Brightness2Icon from '@mui/icons-material/Brightness2'
import Link from 'next/link'

const Navbar = () => {
  const [showNavList, setShowNavList] = useState(false)
  const { themeName, toggleTheme } = useContext(ThemeContext)
  const { siteTitle } = meta

  const toggleNavListOverlay = () => {
    showNavList
      ? document.body.classList.remove('disable-scroll')
      : document.body.classList.add('disable-scroll')
    setShowNavList(!showNavList)
  }

  const hideNavListOverlay = () => {
    document.body.classList.remove('disable-scroll')
    setShowNavList(false)
  }

  useEffect(() => {
    const hideNavListOverlayIfScreenIsTooBig = () =>
      window.innerWidth > 600 ? hideNavListOverlay() : null
    window.addEventListener('resize', hideNavListOverlayIfScreenIsTooBig)
    return () =>
      window.removeEventListener('resize', hideNavListOverlayIfScreenIsTooBig)
  }, [])

  return (
    <nav className='nav container animate__animated animate__fadeIn animate__delay-3s'>
      <ul
        className='nav__list'
        style={{ display: showNavList ? 'flex' : null }}
      >
        <li className='nav__list-item nav__scroll-top'>
          <strong>
            <Link href='#top' onClick={hideNavListOverlay} className='link'>
              {siteTitle}
            </Link>
          </strong>
        </li>

        <li className='nav__list-item'>
          <Link
            href='#about'
            onClick={hideNavListOverlay}
            className='link link--nav'
          >
            About
          </Link>
        </li>

        {/* {projects.length && (
          <li className='nav__list-item'>
            <a
              href='#projects'
              onClick={hideNavListOverlay}
              className='link link--nav'
            >
              Projects
            </a>
          </li>
        )} */}

        {skills.length && (
          <li className='nav__list-item'>
            <Link
              href='#skills'
              onClick={hideNavListOverlay}
              className='link link--nav'
            >
              Skills
            </Link>
          </li>
        )}

        {contact.email && (
          <li className='nav__list-item'>
            <a
              href='#contact'
              onClick={hideNavListOverlay}
              className='link link--nav'
            >
              Contact
            </a>
          </li>
        )}
      </ul>

      <button
        type='button'
        onClick={toggleNavListOverlay}
        aria-label='toggle navigation'
        className='btn btn--icon nav__button nav__hamburger'
      >
        {showNavList ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className='nav__scroll-top'>
        <strong>
          <Link href='#top' onClick={hideNavListOverlay} className='link'>
            {siteTitle}
          </Link>
        </strong>
      </div>

      <button
        type='button'
        onClick={toggleTheme}
        aria-label='toggle theme'
        className='btn btn--icon nav__button'
      >
        {themeName === 'dark' ? <WbSunnyRoundedIcon /> : <Brightness2Icon />}
      </button>
    </nav>
  )
}

export default Navbar
