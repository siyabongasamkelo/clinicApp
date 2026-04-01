import styled from "styled-components";

interface SpanProps {
  color?: string;
}

export const SmallText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.paragraph};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

export const FormLabel = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.blackText};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

export const FormForgotPasswordLink = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  font-style: normal;
  line-height: 22px;
  text-align: right;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
  }

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
    line-height: 22px;
  }

  @media (min-width: 1280px) {
    font-size: ${(props) => props.theme.fontSizes.sm};
  }
`;

export const FormRegisterLink = styled.label`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.primary};
  font-style: normal;
  line-height: 22px;
  text-align: left;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
  }

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
`;

export const ServerErrors = styled.h4`
  font-size: ${(props) => props.theme.fontSizes.sm};
  color: ${(props) => props.theme.colors.error};
  font-style: normal;
  line-height: 22px;
  text-align: left;
`;

export const BigText = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.xxxl};
  font-weight: 400;
  color: ${(props) => props.color || props.theme.colors.primary};
  text-align: center;
  letter-spacing: 0.5rem;

  @media (min-width: 900px) {
    font-size: ${(props) => props.theme.fontSizes.xxxl};
  }

  @media (min-width: 1200px) {
    font-size: ${(props) => props.theme.fontSizes.xxxl};
  }
`;

export const MediumText = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.xxl};
  font-weight: 600;
  color: ${(props) => props.color || props.theme.colors.primary};
  text-align: left;
  letter-spacing: 0.5rem;
`;

export const Span = styled.span<SpanProps>`
  color: ${({ color }) => color || "#1E1E1E"};
`;
