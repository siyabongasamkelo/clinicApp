// src/theme/styled.d.ts
import "styled-components";
import { appTheme } from "../styles/Theme"; // Point this to your theme file

// This is the magic part: it extracts the type from your object
type Theme = typeof appTheme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
