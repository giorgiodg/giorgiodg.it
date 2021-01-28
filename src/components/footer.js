import React, { useContext } from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import ContentWrapper from "../styles/contentWrapper"
import Context from "../context"
import Logo from "./logo"
import { lightTheme } from "../styles/theme"
import { footerLinks } from "../../config"

const StyledFooter = styled.footer`
  width: 100%;
  height: ${({ theme }) => theme.footerHeight};
  background: ${({ theme }) => theme.colors.background};
  border-top: ${({ theme }) => `3px solid ${theme.colors.tertiary}`};
  margin-top: 10rem;
`

const StyledContentWrapper = styled(ContentWrapper)`
  && {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .footer-links {
      /* Adjust width of links wrapper accordingly */
      width: 10rem;
      display: flex;
      justify-content: space-between;
      @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 15rem;
      }
    }
  }
`

const StyledLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 1px;
`

const Footer = () => {
  return (
    <StyledFooter>
      <StyledContentWrapper>
        <Link to="/" aria-label="home">
          <Logo size="1.5rem" color={lightTheme.colors.primary} />
        </Link>
        <div className="footer-links" data-testid="footer-links">
          {footerLinks.map(({ name, url }, key) => (
            <StyledLink key={key} to={url}>
              {name}
            </StyledLink>
          ))}
        </div>
      </StyledContentWrapper>
    </StyledFooter>
  )
}

export default Footer
