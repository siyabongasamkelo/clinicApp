import styled, { css } from "styled-components";

interface BoxProps {
  // Box Model
  $w?: string | number;
  $maxW?: string | number;
  $h?: string | number;
  $bg?: string;
  $radius?: string | number;
  $mL?: string | number;

  // Layout Toggle
  $display?: "flex" | "grid" | "block" | "none";

  // Flex/Grid Alignment (Only active if $display is flex/grid)
  $dir?: "row" | "column";
  $align?: "start" | "center" | "end" | "baseline" | "stretch";
  $justify?: "start" | "center" | "end" | "space-between" | "space-around";
  $gap?: string | number; // Built-in spacing for flex/grid items
  $wrap?: "wrap" | "nowrap";
}

export const Box = styled.div<BoxProps>`
  /* 1. Base Box Properties */
  box-sizing: border-box;
  width: ${({ $w }) => (typeof $w === "number" ? `${$w}` : $w || "auto")};
  max-width: ${({ $maxW }) =>
    typeof $maxW === "number" ? `${$maxW}px` : $maxW || "none"};
  height: ${({ $h }) => (typeof $h === "number" ? `${$h}` : $h || "auto")};
  background-color: ${({ $bg, theme }) =>
    theme.colors?.[$bg || ""] || $bg || "transparent"};
  border-radius: ${({ $radius }) =>
    typeof $radius === "number" ? `${$radius}px` : $radius || "0"};

  /* 2. Layout Logic */
  display: ${({ $display }) => $display || "block"};
  flex-direction: ${({ $dir }) => $dir || "row"};
  align-items: ${({ $align }) => $align || "stretch"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
  flex-wrap: ${({ $wrap }) => $wrap || "nowrap"};

  /* 3. The "Gap" Killer - Use theme spacing if available */
  gap: ${({ $gap, theme }) =>
    theme.spacing?.[$gap as string] ||
    (typeof $gap === "number" ? `${$gap}px` : $gap || "0")};
  margin-left: ${({ $mL }) =>
    typeof $mL === "number" ? `${$mL}px` : $mL || "-175px"};
`;
