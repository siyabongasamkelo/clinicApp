import * as Yup from "yup";

export const loginSchema = Yup.object({
  staffId: Yup.string()
    .required("Staff ID is required")
    .matches(/^[a-zA-Z0-9]+$/, "Staff ID must be alphanumeric"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = Yup.InferType<typeof loginSchema>;
