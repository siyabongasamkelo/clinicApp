import { useFormik } from "formik";
import { registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";

export const useRegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      profilePic: "",
      role: "admin",
      username: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);

        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append("password", values.password);
        formData.append("profilePhoto", values.profilePic);

        //await authService.register(formData);
        await register(formData);
        notify.success(`User successfully registered`);
        setSubmitting(false);
        // navigate("/dashboard");
      } catch (err: any) {
        notify.error("Registration Failed");
        setServerError(err.response?.data?.message || "Authentication failed");
        notify.error(err.response?.data?.message || "Registering failed");
      }
    },
  });

  return { formik, serverError };
};
