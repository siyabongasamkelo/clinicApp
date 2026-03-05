import { useFormik } from "formik";
import { loginSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { staffId: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setServerError(null);
        await login({ username: values.staffId, password: values.password });
        navigate("/dashboard");
      } catch (err: any) {
        setServerError(err.response?.data?.message || "Authentication failed");
      }
    },
  });

  return { formik, serverError };
};
