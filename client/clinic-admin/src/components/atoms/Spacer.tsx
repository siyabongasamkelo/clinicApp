import styled, { css } from "styled-components";

// 1. Define Breakpoints
const breakpoints = {
  mobile: "576px",
  tablet: "768px",
  desktop: "1024px",
};

// 2. Define Types for Responsive Props
type ResponsiveValue<T> = T | { mobile?: T; tablet?: T; desktop?: T };

interface SpacingProps {
  $m?: ResponsiveValue<string | number>; // Margin
  $p?: ResponsiveValue<string | number>; // Padding
  $mt?: ResponsiveValue<string | number>; // Margin Top
  $mb?: ResponsiveValue<string | number>; // Margin Bottom
  $pt?: ResponsiveValue<string | number>; // Padding Top
  $pb?: ResponsiveValue<string | number>; // Padding Bottom
  // Add more (ml, mr, pl, pr) as needed
}

// 3. Helper function to parse responsive objects
const getResponsiveStyles = (
  propName: string,
  value?: ResponsiveValue<string | number>,
) => {
  if (!value) return null;

  if (typeof value !== "object") {
    return css`
      ${propName}: ${typeof value === "number" ? `${value}px` : value};
    `;
  }

  return css`
    ${value.mobile &&
    css`
      @media (max-width: ${breakpoints.mobile}) {
        ${propName}: ${value.mobile}${typeof value.mobile === "number"
          ? "px"
          : ""};
      }
    `}
    ${value.tablet &&
    css`
      @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.desktop}) {
        ${propName}: ${value.tablet}${typeof value.tablet === "number"
          ? "px"
          : ""};
      }
    `}
    ${value.desktop &&
    css`
      @media (min-width: ${breakpoints.desktop}) {
        ${propName}: ${value.desktop}${typeof value.desktop === "number"
          ? "px"
          : ""};
      }
    `}
  `;
};

// 4. The Styled Component
export const Spacer = styled.div<SpacingProps>`
  ${({ $m }) => getResponsiveStyles("margin", $m)}
  ${({ $p }) => getResponsiveStyles("padding", $p)}
  ${({ $mt }) => getResponsiveStyles("margin-top", $mt)}
  ${({ $mb }) => getResponsiveStyles("margin-bottom", $mb)}
  ${({ $pt }) => getResponsiveStyles("padding-top", $pt)}
  ${({ $pb }) => getResponsiveStyles("padding-bottom", $pb)}
`;
