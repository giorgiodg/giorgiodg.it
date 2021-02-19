import styled from "styled-components"

const Underlining = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  transition: box-shadow 0.2s ease-out;
  &:hover {
    box-shadow: 0 ${({ big }) => (big ? "0.5rem" : "0.125rem")} 0
      ${({ theme }) => theme.colors.tertiary};
    color: ${({ theme }) => theme.colors.tertiary};
  }
`

export default Underlining
