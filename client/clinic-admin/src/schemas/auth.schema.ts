import * as Yup from "yup";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"), // Built-in Yup email validation
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Name is too short")
    .max(50, "Name is too long")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain one uppercase letter")
    .matches(/[0-9]/, "Must contain one number")
    .required("Password is required"),

  profilePic: Yup.mixed()
    .required("A profile picture is required")
    .test("fileSize", "File is too large (Max 2MB)", (value: any) => {
      return value && value.size <= MAX_FILE_SIZE;
    })
    .test(
      "fileFormat",
      "Unsupported Format (JPG, JPEG, PNG only)",
      (value: any) => {
        return value && SUPPORTED_FORMATS.includes(value.type);
      },
    ),

  role: Yup.string()
    .oneOf(["admin", "doctor"], "Please select a valid role")
    .required("Role is required"),
});

export type LoginSchemaType = Yup.InferType<typeof loginSchema>;
export type RegisterSchemaType = Yup.InferType<typeof registerSchema>;
