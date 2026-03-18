import styled from "styled-components";

export const SmallText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  font-style: normal;
  line-height: 22px;
  text-align: center;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
    line-height: 22px;
  }

  @media (min-width: 1280px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

export const FormLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  font-style: normal;
  line-height: 22px;
  text-align: left;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
    line-height: 22px;
  }

  @media (min-width: 1280px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

export const FormErrorLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.error};
  font-style: normal;
  line-height: 22px;
  text-align: left;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
    line-height: 22px;
  }

  @media (min-width: 1280px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

export const BigText = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.xxxl};
  font-weight: 400;
  color: ${(props) => props.theme.colors.tertiary};
  text-align: center;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.xxxl};
  }

  @media (min-width: 1200px) {
    font-size: ${(props) => props.theme.fontSizes.xxxl};
  }
`;

export const HeroText = styled.h1`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  text-align: center;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }

  @media (min-width: 1200px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
    font-size: 38px;
  }
`;
