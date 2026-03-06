import { useFormik } from "formik";
import { loginSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        await login({ email: values.email, password: values.password });
        notify.success(`Successfully logged in!`);
        setSubmitting(false);
        // navigate("/dashboard");
      } catch (err: any) {
        setServerError(err.response?.data?.message || "Authentication failed");
        notify.error(err.response?.data?.message || "Login failed");
      }
    },
  });

  return { formik, serverError };
};
