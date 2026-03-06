import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"), // Built-in Yup email validation
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = Yup.InferType<typeof loginSchema>;
